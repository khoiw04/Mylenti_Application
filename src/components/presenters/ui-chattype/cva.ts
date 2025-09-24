import { cva } from "class-variance-authority";
import { defaultVariants } from "@/data/obs-overlay";

const commenterMainContainerVariants = cva("", {
  variants: {
    currentPreset: {
      default: "inline-flex items-center gap-4",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": "containerlivechat main"
    },
    memberPreset: {
      default: 'bg-neutral-300 rounded-2xl p-2',
      "Mori Seikai": "",
      "Siini": "",
      "Empty": "containerlivechat member"
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
      "Empty": "containerlivechat main info"
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
      "Empty": "containerlivechat main info name"
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
      "Empty": "containerlivechat main info comment"
    },
  },
  ...defaultVariants
});


export { commenterMainContainerVariants, infoCommenterContainerVariants, commenterNameVariants, commentVariants }