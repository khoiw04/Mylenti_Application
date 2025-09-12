import { Share2 } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import { ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";
import { OBSOverlaySettingStragery, OBSOverlaySettingsProps } from "@/store";
import { overlayFieldConfigs } from "@/data/obs-overlay";

export default function ContextMenuContentMain() {
  const { ChatType, currentKeyChatType, showComment } = useStore(OBSOverlaySettingsProps)
  const { currentKeyChatTypeStragery, showCommentStragery, showAvatarStragery } = useStore(OBSOverlaySettingStragery)

    return (
      <ContextMenuContent className="w-52">
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Loại</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            {ChatType.map(chattype => {
              return (
                <ContextMenuCheckboxItem
                  key={chattype.key}
                  checked={currentKeyChatType === chattype.key}
                  onClick={() => currentKeyChatTypeStragery(chattype.key)}
                >
                  {chattype.label}
                </ContextMenuCheckboxItem>
              )
            })}
            <ContextMenuSeparator />
            <ContextMenuItem inset>
                Chia sẻ
                <ContextMenuShortcut>
                    <Share2 />
                </ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        {overlayFieldConfigs.map(field => (
          <ContextMenuSub key={field.key}>
            <ContextMenuSubTrigger inset>
              {field.label}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              {ChatType.map(chattype => (
                <ContextMenuCheckboxItem
                  key={`${chattype.key}-${field.key}`}
                  checked={chattype.config[field.key]}
                  onClick={() => 
                    showAvatarStragery(
                      chattype.key,
                      field.key,
                      !chattype.config[field.key]
                  )}
                >
                  {chattype.label}
                </ContextMenuCheckboxItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        ))}
        <ContextMenuCheckboxItem 
          checked={showComment}
          onClick={() => showCommentStragery(!showComment)}
        >
            Bình luận
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    )
}