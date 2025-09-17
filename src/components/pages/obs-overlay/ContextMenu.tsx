import { Share2 } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import { useState } from "react";
import EmojiFileUpload from "./EmojiFileUpload";
import SoundFileUpload from "./SoundFileUpload";
import { ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";
import { OBSOverlaySettingStragery, OBSOverlayTauriSettingsProps } from "@/store";
import { overlayFieldConfigs } from "@/data/obs-overlay";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ContextMenuContentMain() {
  const [dialogType, setDialogType] = useState<'image' | 'sound' | null>(null)

  const { ChatType, currentKeyChatType, showComment, DonateProps: { enableVoice } } = useStore(OBSOverlayTauriSettingsProps)
  const { currentKeyChatTypeStragery, showCommentStragery, showLabelStragery, toogleVoiceDonatePropsStragery } = useStore(OBSOverlaySettingStragery)

    return (
      <Dialog>
        <ContextMenuContent className="w-52">
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>YouTube</ContextMenuSubTrigger>
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
          <ContextMenuSub>
            <ContextMenuCheckboxItem
              onClick={() => currentKeyChatTypeStragery('Donate')}
            >
              Donate
            </ContextMenuCheckboxItem>
          </ContextMenuSub>
          <ContextMenuSeparator />
          {currentKeyChatType === 'Donate' ?
          <>
          <DialogTrigger asChild>
            <ContextMenuCheckboxItem onClick={() => setDialogType('image')}>
                Thay Ảnh
            </ContextMenuCheckboxItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <ContextMenuCheckboxItem onClick={() => setDialogType('sound')}>
                Thay Âm Thanh
            </ContextMenuCheckboxItem>
          </DialogTrigger>
          <ContextMenuCheckboxItem
            checked={enableVoice}
            onClick={() => toogleVoiceDonatePropsStragery(!enableVoice)}
          >
              {!enableVoice ? 'Bật' : 'Tắt'} {" "}
              Giọng Nói
          </ContextMenuCheckboxItem>
          </>
          :
          <>
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
                      showLabelStragery(
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
          </>
          }
        </ContextMenuContent>
        <DialogContent>
          <DialogTitle className="sr-only">
            {dialogType === 'image' ? 'Đăng ảnh' : 'Đăng Âm Thanh'}
            <DialogDescription className="sr-only">
              {dialogType === 'image' ? 'Đăng tối đa 4 ảnh' : 'Đăng tối đa 4 Âm Thanh'}
            </DialogDescription>
          </DialogTitle>
          {dialogType === 'image' && <EmojiFileUpload />}
          {dialogType === 'sound' && <SoundFileUpload />}
        </DialogContent>
      </Dialog>
    )
}