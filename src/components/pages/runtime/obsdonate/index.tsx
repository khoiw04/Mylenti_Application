import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import DonateComponent from "@/components/presenters/ui-donatetype/component";
import { OBSOverlayDataDonateWebsiteStore } from "@/store/obs-overlay-donate-website";
import { OBSOverlaySettingsWebsiteStore } from "@/store";
import { BinarytoBLOB, RandomNumberInRange } from "@/lib/utils";

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
  const { emojiURL, soundURL, currentPreset } = useStore(
    OBSOverlaySettingsWebsiteStore,
    s => ({
      emojiURL: s.DonateProps.emojiURL,
      soundURL: s.DonateProps.soundURL,
      currentPreset: s.currentPreset
    })
  )

  useEffect(() => {
    const unsubscribe = OBSOverlayDataDonateWebsiteStore.subscribe(({ prevVal, currentVal }) => {
      if (currentVal.name && currentVal.name !== prevVal.name) {

        const selectedEmoji = BinarytoBLOB(emojiURL[RandomNumberInRange(emojiURL.length)]);
        const selectedSound = BinarytoBLOB(soundURL[RandomNumberInRange(soundURL.length)]);

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
  }, [emojiURL, soundURL]);

  useEffect(() => {
    if (!currentDonate && donateQueue.length > 0) {
      console.log(donateQueue)
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
          className="flex justify-center items-center h-dvh"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <DonateComponent
            currentPreset={currentPreset}
            donatePrice={currentDonate.amount}
            srcDonateComment={currentDonate.name}
            srcDonateParagraph={currentDonate.message}
            srcDonateEmoji={currentDonate.emoji}
            style={{ color: 'white' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}