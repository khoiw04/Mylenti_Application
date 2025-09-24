import { cva } from "class-variance-authority";
import { defaultVariants } from "@/data/obs-overlay";

const commenterMainContainerVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex items-center gap-4",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    },
    memberPreset: {
      default: 'bg-neutral-300 rounded-2xl p-2',
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    }
  },
  ...defaultVariants
})

const infoCommenterContainerVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex items-center gap-4",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
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
      "Empty": ""
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
      "Empty": ""
    },
  },
  ...defaultVariants
});


export { commenterMainContainerVariants, infoCommenterContainerVariants, commenterNameVariants, commentVariants }