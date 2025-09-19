import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { saveSetting } from "@/store";

export default function VoiceWarnToogle({ setVoiceWarning }: { setVoiceWarning: React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này sẽ khiến AI hoạt động. AI sẽ chiếm rất nhiều dung lượng để chạy.
                    Hãy tưởng tượng Cyberpunk 2077 đang chạy trên máy bạn
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                    onClick={async () => {
                        await saveSetting('voice_warn', 'true')
                        setVoiceWarning(false)
                    }}
                >
                    Chấp nhận
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}