import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { APPCONFIG } from "@/data/config";
import { saveSetting } from "@/store";

export default function VoiceWarnToogle() {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này sẽ khiến AI hoạt động. AI sẽ chiếm rất nhiều dung lượng để chạy.
                    Hãy tưởng tượng Valorant đang chạy trên máy bạn
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                    onClick={async () => {
                        await saveSetting(APPCONFIG.FILE.VOICE_WARN_KEY, 'true')
                    }}
                >
                    Chấp nhận
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}