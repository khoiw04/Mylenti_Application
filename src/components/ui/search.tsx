import * as React from "react"
import { useEffect } from "react"
import { Command as CommandPrimitive, useCommandState } from "cmdk"

import { SearchIcon } from "lucide-react"
import { useRouter } from "@tanstack/react-router"
import type { searchGroups } from "@/data/header"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export type Option = typeof searchGroups[number]

interface MultipleSelectorProps {
  value?: Array<Option>
  defaultOptions?: Array<Option>
  /** manually controlled options */
  options?: Array<Option>
  placeholder?: string
  /** Loading component. */
  loadingIndicator?: React.ReactNode
  /** Empty component. */
  emptyIndicator?: React.ReactNode
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean
  /** async search */
  onSearch?: (value: string) => Promise<Array<Option>>
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Array<Option>
  onChange?: (options: Array<Option>) => void
  /** Limit the maximum number of selected options. */
  maxSelected?: number
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  /** Group the options base on provided key. */
  groupBy?: string
  className?: string
  badgeClassName?: string
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >
  /** hide the clear all button. */
  hideClearAllButton?: boolean
}

export interface MultipleSelectorRef {
  selectedValue: Array<Option>
  input: HTMLInputElement
  focus: () => void
  reset: () => void
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

const CommandEmpty = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
  const render = useCommandState((state) => state.filtered.count === 0)

  if (!render) return null

  return (
    <div
      className={cn("px-2 py-4 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  )
}

CommandEmpty.displayName = "CommandEmpty"

const MultipleSelector = ({
  placeholder,
  defaultOptions = [],
  delay,
  onSearch,
  loadingIndicator,
  emptyIndicator,
  hidePlaceholderWhenSelected,
  disabled,
  groupBy,
  className,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false,
}: MultipleSelectorProps) => {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [onScrollbar, setOnScrollbar] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = React.useState("")
  const debouncedSearchTerm = useDebounce(inputValue, delay || 500)

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false)
      inputRef.current.blur()
    }
  }

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchend", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchend", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchend", handleClickOutside)
    }
  }, [open])

  useEffect(() => {
    /** async search */

    const doSearch = () => {
      setIsLoading(true)
      setIsLoading(false)
    }

    const exec = () => {
      if (!onSearch || !open) return

      if (triggerSearchOnFocus) {
        doSearch()
      }

      if (debouncedSearchTerm) {
        doSearch()
      }
    }

    void exec()
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus])

  // CTRL+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac")
      const isShortcutPressed = isMac ? event.metaKey : event.ctrlKey

      if (isShortcutPressed && event.key.toLowerCase() === "k") {
        event.preventDefault()
        inputRef.current?.focus()
      }
      
      if (open && event.key === "Escape") {
        inputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const EmptyItem = React.useCallback(() => {
    if (!emptyIndicator) return undefined

    if (onSearch && !creatable) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      )
    }

    return <CommandEmpty>{emptyIndicator}</CommandEmpty>
  }, [creatable, emptyIndicator, onSearch])

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = React.useCallback(() => {
    if (commandProps?.filter) {
      return commandProps.filter
    }

    if (creatable) {
      return (value: string, search: string) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1
      }
    }
    // Using default filter in `cmdk`. We don&lsquo;t have to provide it.
    return undefined
  }, [creatable, commandProps?.filter])

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      onKeyDown={(e) => {
        commandProps?.onKeyDown?.(e)
      }}
      className={cn(
        "h-auto overflow-visible bg-transparent",
        "relative mx-auto w-full max-w-xs",
        commandProps?.className
      )}
      shouldFilter={
        commandProps?.shouldFilter !== undefined
          ? commandProps.shouldFilter
          : !onSearch
      }
      filter={commandFilter()}
    >
      <div
        className={cn(
          "border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative min-h-[38px] rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
          !hideClearAllButton && "pe-9",
          className
        )}
        onClick={() => {
          if (disabled) return
          inputRef.current?.focus()
        }}
      >
        <div className="flex flex-wrap gap-1">
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={(value) => {
              setInputValue(value)
              inputProps?.onValueChange?.(value)
            }}
            onBlur={(event) => {
              if (!onScrollbar) {
                setOpen(false)
              }
              inputProps?.onBlur?.(event)
            }}
            onFocus={(event) => {
              setOpen(true)
              if (triggerSearchOnFocus) {
                onSearch?.(debouncedSearchTerm)
              }
              inputProps?.onFocus?.(event)
            }}
            placeholder={placeholder}
            className={cn(
              "placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-hidden disabled:cursor-not-allowed",
              "peer h-8 ps-8 pe-10",
              {
                "w-full": hidePlaceholderWhenSelected,
              },
              inputProps?.className
            )}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
            <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className={cn(
            "border-input absolute top-2 z-10 w-full overflow-hidden rounded-md border",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            !open && "hidden"
          )}
          data-state={open ? "open" : "closed"}
        >
          {open && (
            <CommandList
              className="bg-popover text-popover-foreground shadow-lg outline-hidden"
              onMouseLeave={() => {
                setOnScrollbar(false)
              }}
              onMouseEnter={() => {
                setOnScrollbar(true)
              }}
              onMouseUp={() => {
                inputRef.current?.focus()
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {!selectFirstItem && (
                    <CommandItem value="-" className="hidden" />
                  )}
                  {defaultOptions.map((group) => (
                    <CommandGroup 
                      key={group.heading} 
                      heading={group.heading}
                      className="h-full overflow-auto"
                    >
                      {group.items.map((item) => (
                        <CommandItem 
                          key={item.href}
                          value={item.value}
                          onSelect={() => router.navigate({to: item.href})}
                          className="cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          {item.value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </div>
    </Command>
  )
}

MultipleSelector.displayName = "MultipleSelector"
export default MultipleSelector