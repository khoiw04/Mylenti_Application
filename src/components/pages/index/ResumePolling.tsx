import { LucideBug, LucidePlay } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import ButtonFunction from './ButtonFunction'
import { PollingStatusStore } from "@/store";

export default function ResumePolling() {
    const { manualPolling, isError } = useStore(PollingStatusStore)
    
    return (
        <ButtonFunction
            icon={isError ? <LucideBug /> : <LucidePlay />}
            description={isError ? "Lỗi! Cần khởi động lại." : "30 giây sau sẽ tự khởi động"}
            title="Khởi Động lại Khung Chat"
            onClick={manualPolling}
        />
    )
}