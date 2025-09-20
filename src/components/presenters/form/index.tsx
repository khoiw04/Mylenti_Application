import {  useStore } from "@tanstack/react-form";
import { ChevronDownIcon, GalleryVerticalEnd } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TermOfService from "./termofservice";
import TermOfPrivacy from "./termofprivacy";
import type {AnyFieldMeta} from "@tanstack/react-form";
import type { ButtonFieldType, ComboBoxType, ShowBugType, TextFieldType } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext, useFormContext } from "@/hooks/useFormContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LogoForm({message = 'Mylenti.'}) {
  return (
    <Link to="/" className="flex items-center gap-2 self-center font-medium">
    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-4" />
    </div>
    {message}
    </Link>
  )
}

export function Footer({message = 'nhập'}) {
    return (
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Đăng {message}, bạn sẽ đồng ý <TermOfService />{" "}
        và 
        <br />
        <TermOfPrivacy />.
      </div>
    )
}

export function ButtonSubmit({
      children,
      ...props
    } : ButtonFieldType) {
  const form = useFormContext()
  const [isSubmitting, canSubmit] = useStore(form.store, (state) => [
      state.isSubmitting,
      state.canSubmit
  ])

  return (
    <Button
      type="submit"
      disabled={!canSubmit || isSubmitting}
      {...props}
    >
      {children}
    </Button>
  )
}

export function TextField({
    className,
    asTextarea = false,
    asNumeric = false,
    showLabel = false,
    showBug = true,
    ...props
}: TextFieldType & ShowBugType) {
    const field = useFieldContext<string>()

    return (
        <>
            {showLabel && <Label htmlFor={field.name}>
              {field.name}
            </Label>}
            <Input
                id={field.name}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                value={field.state.value ?? ''}
                asTextarea={asTextarea}
                asNumeric={asNumeric}
                className={className}
                {...props}
            />
            {showBug && <FieldErrors meta={field.state.meta} />}
        </>
    )
}

export function ComboBox({
    checkboxData,
    placeholder = '',
    disabled = false,
    showBug = true,
    ...props
}: ComboBoxType) {
    const field = useFieldContext<string>()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(checkboxData[checkboxData.findIndex(b => field.state.value === b)])

    useEffect(() => field.setValue(value), [value])

    return (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                {...props}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
              >
                {value ? (
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    {checkboxData.find((item) => item === value)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Tìm ngân hàng
                  </span>
                )}
                <ChevronDownIcon
                  size={16}
                  className="text-muted-foreground/80 shrink-0"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder="Tìm ngân hàng..." />
                <CommandList className="max-h-none">
                  <CommandEmpty>Không thấy ngân hàng nào.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="flex max-h-[300px] flex-col overflow-hidden">
                      {checkboxData.map((item) => (
                        <CommandItem
                          key={item}
                          value={item}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {item}
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {item.toLocaleString()}
                          </span>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {showBug && <FieldErrors meta={field.state.meta} />}
        </>
    )
}

export function Divide({ message = 'or' }) {
    return (
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          {message}
        </span>
      </div>
    )
}

const FieldErrors = ({ meta }: { meta?: AnyFieldMeta }) => {
  if (!meta || !meta.isTouched || meta.errors.length === 0) return null;

  return (
    <>
      {meta.errors.map(({ message }, index) => (
        <p
          key={`message_${index}`}
          className="relative z-0 text-wrap w-fit text-sm translate-y-1 text-paragraph-smaller font-medium text-left text-red-400 text-shadow-transparent"
        >
          {message}
        </p>
      ))}
    </>
  );
};