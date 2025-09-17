import { useStore } from "@tanstack/react-store";
import { ChatTypeStrategy } from "@/func/fn.stragery";
import { OBSOverlayTauriSettingsProps } from "@/store";

export default function Overlay() {
  const { currentKeyChatType } = useStore(OBSOverlayTauriSettingsProps);
  const ExampleChatType = ChatTypeStrategy[currentKeyChatType];

  return ExampleChatType ? <ExampleChatType /> : <div>Không có overlay phù hợp</div>;
}