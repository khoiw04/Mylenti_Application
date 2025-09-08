import { ContextMenuContent, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu"

export default function ContextMenuContentMain() {
    return (
      <ContextMenuContent className="w-52">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Loại</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">

            <ContextMenuSeparator />
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    )
}