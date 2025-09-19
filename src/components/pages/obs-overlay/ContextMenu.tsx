import { Share2 } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import { useState } from "react";
import EmojiFileUpload from "./EmojiFileUpload";
import SoundFileUpload from "./SoundFileUpload";
import VoiceWarnToogle from "./VoiceWarnToogle";
import { ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from "@/components/ui/context-menu";
import { OBSOverlayTauriSettingStragery, OBSOverlayTauriSettingsProps, loadSetting, saveSetting } from "@/store";
import { overlayFieldConfigs } from "@/data/obs-overlay";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import useTauriSafeEffect from "@/hooks/useTauriSideEffect";

export default function ContextMenuContentMain() {
  const [dialogType, setDialogType] = useState<'image' | 'sound' | 'voice_warn' | null>(null)
  const [voiceWarning, setVoiceWarning] = useState(false)
  const { ChatType, currentKeyChatType, showComment, DonateProps: { enableVoice } } = useStore(OBSOverlayTauriSettingsProps)
  const { currentKeyChatTypeStragery, showCommentStragery, showLabelStragery, toogleVoiceDonatePropsStragery } = useStore(OBSOverlayTauriSettingStragery)
  useTauriSafeEffect(() => {
    const fetchVoiceWarning = async () => {
      let value = await loadSetting('voice_warn') as string
      if (Array.isArray(value)) {
        await saveSetting('voice_warn', 'false')
        value = await loadSetting('voice_warn') as string
      }
      setVoiceWarning(value === 'true')
    }

    fetchVoiceWarning()
  }, [])
    return (
      <AlertDialog>
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
            <AlertDialogTrigger asChild>
              <ContextMenuCheckboxItem
                checked={enableVoice}
                onClick={() => {
                  if (!voiceWarning) {
                    setDialogType('voice_warn')
                  } else {
                    toogleVoiceDonatePropsStragery(!enableVoice)
                    setDialogType(null)
                  }
                }}
              >
                  {!enableVoice ? 'Bật' : 'Tắt'} {" "}
                  Giọng Nói
              </ContextMenuCheckboxItem>
            </AlertDialogTrigger>
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
        {dialogType === 'voice_warn' && <VoiceWarnToogle setVoiceWarning={setVoiceWarning} />}
      </AlertDialog>
    )
}