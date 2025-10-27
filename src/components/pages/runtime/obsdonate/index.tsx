import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import DonateComponent from "@/components/presenters/ui-donatetype/component";
import { OBSOverlayDataDonateWebsiteStore } from "@/store/obs-overlay-donate-website";
import { OBSOverlayWebsiteSettingsStore } from "@/store";
import { RandomNumberInRange } from "@/lib/utils";

type DonatePayload = {
  name: string
  amount: string
  message: string
  emoji: string
  sound: string
  id: string
}

export default function OBSDonate() {
  const [donateQueue, setDonateQueue] = useState<Array<DonatePayload>>([]);
  const [currentDonate, setCurrentDonate] = useState<DonatePayload | null>(null)
  const { emojiURL, soundURL, enableVoice, currentPreset } = useStore(
    OBSOverlayWebsiteSettingsStore,
    s => ({
      emojiURL: s.DonateProps.emojiURL,
      soundURL: s.DonateProps.soundURL,
      enableVoice: s.DonateProps.enableVoice,
      currentPreset: s.currentPreset
    })
  )

  useEffect(() => {
    const unsubscribe = OBSOverlayDataDonateWebsiteStore.subscribe(({ prevVal, currentVal }) => {
      if (JSON.stringify(currentVal) !== JSON.stringify(prevVal)) {

        const selectedEmoji = emojiURL[RandomNumberInRange(emojiURL.length)].path
        const selectedSound = soundURL[RandomNumberInRange(soundURL.length)].path

        const newDonate = {
          name: currentVal.name,
          amount: currentVal.amount,
          message: currentVal.message,
          emoji: selectedEmoji,
          sound: selectedSound,
          id: currentVal.name + currentVal.amount + crypto.randomUUID()
        };

        setDonateQueue((prev) => [...prev, newDonate])
        console.log('New', newDonate)
      }
    })

    return () => unsubscribe()
  }, [emojiURL, soundURL]);

  useEffect(() => {
    console.log('Queue', donateQueue)
    if (!currentDonate && donateQueue.length > 0) {
      const next = donateQueue[0];
      setDonateQueue((prev) => prev.slice(1));

      const fetchTTS = async (text: string): Promise<string> => {
        try {
          const res = await fetch('http://127.0.0.1:4545/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voice: 'vi' })
          });

          const blob = await res.blob();
          return URL.createObjectURL(blob);
        } catch (err) {
          toast.error(`Không thể tạo giọng nói: ${err}`);
          return "";
        }
      };

      const prepareAndPlay = async () => {
        const ttsText = next.message;
        const ttsURL = enableVoice ? await fetchTTS(ttsText) : '';

        setCurrentDonate(next);

        const emojiAudio = new Audio(next.sound);
        emojiAudio.play().catch(() => {
          setTimeout(() => { 
            setCurrentDonate(null); 
            URL.revokeObjectURL(next.sound); 
            URL.revokeObjectURL(next.emoji); 
          }, 8000);
        });

        emojiAudio.onended = () => {
          const ttsAudio = new Audio(ttsURL);
          ttsAudio.play();

          ttsAudio.onended = () => {
            setTimeout(() => {
              setCurrentDonate(null);
              URL.revokeObjectURL(next.sound);
              URL.revokeObjectURL(next.emoji);
              URL.revokeObjectURL(ttsURL);
            }, 8000)
          };
        };
      };

      prepareAndPlay();
    }
  }, [donateQueue, currentDonate]);

  return (
    <AnimatePresence>
      {currentDonate && (
        <motion.div
          key={currentDonate.id}
          className="flex justify-center items-center h-dvh bg-transparent!"
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
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}