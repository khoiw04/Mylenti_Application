import { LucidePlay } from "lucide-react";
import { useStore } from "@tanstack/react-store";
import ButtonFunction from './ButtonFunction'
import { PollingStatusStore } from "@/store";

export default function ResumePolling() {
    const { resumePolling } = useStore(PollingStatusStore)
    
    return (
        <ButtonFunction
            icon={<LucidePlay />}
            description="Lỗi hoặc Dừng? Nếu Dừng, 30 giây sau sẽ tự khởi động. Nếu lỗi! Cần khởi động lại."
            title="Khởi Động lại Khung Chat"
            onClick={resumePolling}
        />
    )
}