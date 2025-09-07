import { NumericFormat } from "react-number-format"
import { cva } from "class-variance-authority"
import type { TextFieldType } from "@/types/ui/form"
import { cn } from "@/lib/utils"

export const inputVariants = cva(
  "rounded transition-colors",
  {
    variants: {
      variant: {
        default:
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        signInUp:
          "z-10 relative | bg-neutral-200 | text-black/90 sm:text-[2vmin] lg:text-[1.5vmin] | outline outline-neutral-300 hover:outline-neutral-300/85 hover:bg-neutral-200/40",
        settings:
          "z-10 relative flex w-full rounded-md border border-neutral-200 px-3 py-1 shadow-sm transition-colors placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
        publish:
          "z-10 relative w-full rounded-md border pl-2 py-1.5 disabled:bg-gray-50 placeholder:normal-case focus:outline-none focus:border-neutral-400"
      },
      fieldSize: {
        default: "",
        form: "px-[2vmin] py-[2vmin] sm:px-[1.25vmin] sm:py-[1.25vmin] lg:px-[1vmin] lg:py-[1vmin]"
      },
    },
    defaultVariants: {
      variant: "default",
      fieldSize: "default",
    },
    compoundVariants: [
      {
        variant: "signInUp",
        fieldSize: "form",
        class: "font-medium"
      }
    ]
  }
)

function Input({
  asTextarea = false,
  asNumeric = false,
  className = '',
  variant,
  fieldSize,
  ...props
}: TextFieldType) {

  if (asTextarea) {
    const { type, ...rest } = props
    return (
      <textarea
        className={cn(inputVariants({ variant, fieldSize, className }))}
        {...rest}
      />
    )
  }

  if (asNumeric) {
    const { type, value, defaultValue, ...rest } = props;
    return (
      <NumericFormat
        thousandSeparator=","
        allowLeadingZeros
        allowNegative={false}
        decimalScale={0}
        className={cn(inputVariants({ variant, fieldSize, className }))}
        {...rest}
      />
    );
  }
  
  return (
    <input
      className={cn(inputVariants({ variant, fieldSize, className }))}
      {...props}
    />
  )
}

export { Input }