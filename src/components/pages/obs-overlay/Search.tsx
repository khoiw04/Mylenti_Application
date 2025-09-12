import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react"
import type { SearchProps, presetUserVariantsValueType } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { presetUserVariants } from "@/data/obs-overlay"

export default function Select(props: SearchProps) {
  const { selectArray, open, onOpenChange, value, onValueChange } = props
  const currentValueSelect = selectArray.find((preset) => preset === value)

  return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            role="combobox"
            variant="outline"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", value==='default' && "text-muted-foreground")}>
              {currentValueSelect === 'default' ? "Mặc Định" : currentValueSelect}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 rotate-180 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="center"
        >
          <Command>
            <CommandInput placeholder="Tìm Preset..." />
            <CommandList>
              <CommandEmpty>Không có</CommandEmpty>
              <CommandGroup>
                {presetUserVariants.map((preset) => (
                  <CommandItem
                    key={preset}
                    value={preset}
                    onSelect={(currentValue) => {
                      const typedValue = currentValue as presetUserVariantsValueType;
                      onValueChange(typedValue === value ? 'default' : typedValue)
                      onOpenChange(false)
                    }}
                    className={cn(preset==='default' && "text-muted-foreground")}
                  >
                    {preset === 'default' ? 'Mặc Định' : preset}
                    {value === preset && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                >
                  <PlusIcon
                    size={16}
                    className="-ms-2 opacity-60"
                    aria-hidden="true"
                  />
                  <div className="flex-col flex items-start">
                    Thêm
                  </div>
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}
