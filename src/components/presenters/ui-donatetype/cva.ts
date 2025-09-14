import { cva } from "class-variance-authority";
import { defaultVariants } from "@/data/obs-overlay";

const donaterMainContainerVariants = cva("flex flex-col items-center text-center", {
  variants: {
    currentPreset: {
      default: "max-w-lg",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
})

const donateEmojiContainerVarients = cva("overflow-hidden relative", {
  variants: {
    currentPreset: {
      default: "size-40 rounded-4xl",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
})

const donaterNameVariants = cva("my-4", {
  variants: {
    currentPreset: {
      default: "font-medium text-lg",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
})

const donaterCommentVariants = cva("", {
  variants: {
    currentPreset: {
      default: "",
      "Mori Seikai": "",
      "Siini": "",
    },
  },
  ...defaultVariants
});


export { donaterMainContainerVariants, donaterNameVariants, donateEmojiContainerVarients, donaterCommentVariants }