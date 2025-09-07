import { cva } from "class-variance-authority";

const containerMainVariants = cva("inline-flex items-center gap-4", {
  variants: {
    styleContainer: {
      default: "",
      compact: "gap-1",
    },
  },
  defaultVariants: {
    styleContainer: "default",
  },
})

const infoUserContainerVariants = cva("inline-flex items-center gap-4", {
  variants: {
    userContainer: {
      default: "",
      compact: "gap-1",
    },
  },
  defaultVariants: {
    userContainer: "default",
  },
});

const commenterNameVariants = cva("font-bold", {
  variants: {
    emphasis: {
      default: "",
      subtle: "text-gray-500",
    },
  },
  defaultVariants: {
    emphasis: "default",
  },
});

const commentVariants = cva("", {
  variants: {
    tone: {
      default: "",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});


export { containerMainVariants, infoUserContainerVariants, commenterNameVariants, commentVariants }