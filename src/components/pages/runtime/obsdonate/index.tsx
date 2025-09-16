import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import DonateComponent from "@/components/presenters/ui-donatetype/component";
import { OBSOVerlaySettingsDonateWebsiteStore } from "@/store/obs-overlay-donate-website";
import { OBSOverlaySettingsWebsiteStore } from "@/store";
import { RandomNumberInRange } from "@/lib/utils";

type DonatePayload = {
  name: string
  amount: string
  message: string
  emoji: string
  sound: string
}

export default function OBSDonate() {
  const [donateQueue, setDonateQueue] = useState<Array<DonatePayload>>([]);
  const [currentDonate, setCurrentDonate] = useState<DonatePayload | null>(null)

  useEffect(() => {
    const unsubscribe = OBSOVerlaySettingsDonateWebsiteStore.subscribe(({ prevVal, currentVal }) => {
      if (currentVal.name && currentVal.name !== prevVal.name) {
        const { emojiURL, soundURL } = OBSOverlaySettingsWebsiteStore.state.DonateProps;

        const selectedEmoji = emojiURL[RandomNumberInRange(emojiURL.length)];
        const selectedSound = soundURL[RandomNumberInRange(soundURL.length)];

        const newDonate = {
          name: currentVal.name,
          amount: currentVal.amount,
          message: currentVal.message,
          emoji: selectedEmoji,
          sound: selectedSound,
        };

        setDonateQueue((prev) => [...prev, newDonate])
      }
    })

    return () => unsubscribe()
  }, []);

  useEffect(() => {
    if (!currentDonate && donateQueue.length > 0) {
      const next = donateQueue[0]
      setCurrentDonate(next)
      setDonateQueue((prev) => prev.slice(1));

      const audio = new Audio(next.sound);
      audio.play().catch((err) => toast.warning(`Không thể phát âm thanh: ${err}`))

      audio.onended = () => {
        const utterance = new SpeechSynthesisUtterance(
          `${next.name} vừa donate ${next.amount}. ${next.message}`
        );

        utterance.lang = 'vi-VN';
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
        utterance.voice =
          speechSynthesis.getVoices().find(v => v.lang === 'vi-VN') ??
          speechSynthesis.getVoices().find(v => v.lang === 'en-US') ??
          null;

        speechSynthesis.speak(utterance);

        setCurrentDonate(null);
        URL.revokeObjectURL(next.sound);
        URL.revokeObjectURL(next.emoji);
      };
    }
  }, [donateQueue, currentDonate]);

  return (
    <AnimatePresence>
      {currentDonate && (
        <motion.div
          key={currentDonate.name + currentDonate.amount + crypto.randomUUID()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <DonateComponent
            donatePrice={currentDonate.amount}
            srcDonateComment={currentDonate.name}
            srcDonateParagraph={currentDonate.message}
            srcDonateEmoji={currentDonate.emoji}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}