import { useStore } from "@tanstack/react-store";
import { ChatTypeStrategy } from "@/func/fn.stragery";
import { OBSOverlaySettingsProps } from "@/store";

export default function Overlay() {
  const { currentKeyChatType } = useStore(OBSOverlaySettingsProps);
  const ExampleChatType = ChatTypeStrategy[currentKeyChatType];

  return ExampleChatType ? <ExampleChatType /> : <div>Không có overlay phù hợp</div>;
}