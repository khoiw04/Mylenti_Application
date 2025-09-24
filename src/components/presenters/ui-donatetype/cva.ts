import { cva } from "class-variance-authority";
import { defaultVariants } from "@/data/obs-overlay";

const donaterMainContainerVariants = cva("", {
  variants: {
    currentPreset: {
      default: "max-w-lg flex flex-col items-center text-center",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    },
  },
  ...defaultVariants
})

const donateEmojiContainerVarients = cva("", {
  variants: {
    currentPreset: {
      default: "size-40 rounded-4xl overflow-hidden relative",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
    },
  },
  ...defaultVariants
})

const donaterNameVariants = cva("", {
  variants: {
    currentPreset: {
      default: "font-medium mt-4 mb-2",
      "Mori Seikai": "",
      "Siini": "",
      "Empty": ""
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
      "Empty": ""
    },
  },
  ...defaultVariants
});


export { donaterMainContainerVariants, donaterNameVariants, donateEmojiContainerVarients, donaterCommentVariants }