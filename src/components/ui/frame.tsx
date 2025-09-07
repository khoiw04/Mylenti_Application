import type { formFrameProps } from "@/types/ui/frame";
import { cn } from "@/lib/utils";

export function FormFrame({ children, footer, className }: formFrameProps) {
    return (
      <div className={cn("bg-muted overflow-hidden flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10", className)}>
          <div className="flex w-full max-w-sm flex-col gap-6">
                {children}
          </div>
          {footer}
      </div>
    )
}