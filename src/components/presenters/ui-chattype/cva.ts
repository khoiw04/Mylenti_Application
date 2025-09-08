import { cva } from "class-variance-authority";
import { defaultVariants } from "@/data/obs-overlay";

const containerMainVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex items-center gap-4",
      "Mori Seikai": "",
      "Siini": "",
    },
    memeberPreset: {
      default: 'bg-neutral-300 rounded-2xl p-2',
      "Mori Seikai": "",
      "Siini": "",
    }
  },
  ...defaultVariants
})

const infoUserContainerVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex items-center gap-4",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
})

const commenterNameVariants = cva("", {
  variants: {
    currentPreset: {
      default: "font-bold",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
})

const commentVariants = cva("", {
  variants: {
    currentPreset: {
      default: "",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
});


export { containerMainVariants, infoUserContainerVariants, commenterNameVariants, commentVariants }