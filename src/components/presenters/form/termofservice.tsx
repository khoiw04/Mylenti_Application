import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermOfService({header = 'Điều khoản Dịch Vụ'}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="underline cursor-pointer underline-offset-4">
          {header}
        </span>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="px-6 pt-6">
              {header}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="p-6">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  <div className="space-y-1 **:select-auto">
                    <p>
                      <strong>Giao dịch ủng hộ (Donation/Subscription)</strong>
                    </p>
                    <p>
                      Người dùng có thể lựa chọn ủng hộ streamer thông qua các hình thức như <b><i>donation, subscription hoặc gifting.</i></b> Khi thực hiện giao dịch, người dùng đồng ý rằng:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Các khoản ủng hộ là <b>tự nguyện</b> và không thể hoàn lại, trừ khi có lỗi kỹ thuật được xác minh bởi hệ thống.</li>
                      <li>Streamer không có nghĩa vụ cung cấp sản phẩm, dịch vụ hoặc quyền lợi đặc biệt nào để đổi lại khoản ủng hộ, trừ khi có thông báo rõ ràng từ trước.</li>
                      <li>Người dùng cam kết không sử dụng các phương thức thanh toán không hợp lệ hoặc gian lận. Vi phạm có thể dẫn đến việc khóa tài khoản.</li>
                      <li>Thông tin giao dịch sẽ được xử lý theo chính sách bảo mật của nền tảng, đảm bảo an toàn dữ liệu cá nhân.</li>
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>Chính sách hoàn tiền</strong>
                    </p>
                    <p>
                      Các khoản ủng hộ không được hoàn lại, toàn bộ giao dịch được đưa thẳng tới Streamer.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>Quyền và trách nhiệm của streamer</strong>
                    </p>
                    <p>
                      Streamer có quyền từ chối hoặc chặn các khoản ủng hộ nếu phát hiện hành vi quấy rối, spam hoặc vi phạm quy tắc cộng đồng. Streamer không chịu trách nhiệm pháp lý đối với nội dung hoặc mục đích của khoản ủng hộ.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <strong>Liên hệ hỗ trợ</strong>
                    </p>
                    <p>
                      Nếu bạn gặp sự cố trong quá trình ủng hộ, vui lòng liên hệ bộ phận hỗ trợ qua email hoặc hệ thống ticket để được xử lý nhanh chóng.
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-6 pb-6 sm:justify-start">
            <DialogClose asChild>
              <Button type="button">OK</Button>
            </DialogClose>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}