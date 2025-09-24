import { cva } from "class-variance-authority"
import { defaultVariants } from "@/data/obs-overlay"

const containerSuperChatVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex max-w-sm flex-col divide-y items-start bg-neutral-300 rounded-2xl px-4 py-3 *:first:pb-2.5 *:last:pt-2.5",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    },
  },
  ...defaultVariants
})

const infoUserSuperchatContainerVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex w-full items-center gap-4",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    },
  },
  ...defaultVariants
})

const containerPriceVariants = cva("", {
  variants: {
    currentPreset: {
      default: "font-bold flex flex-col *:last:font-normal",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    },
  },
  ...defaultVariants
})

export { containerPriceVariants, infoUserSuperchatContainerVariants, containerSuperChatVariants }