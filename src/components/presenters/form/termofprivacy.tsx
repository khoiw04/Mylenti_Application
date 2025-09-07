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

export default function TermOfPrivacy({header = 'Chính sách Bảo mật'}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="underline cursor-pointer underline-offset-4 mt-[0.5ch] block">
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
                    <div className="space-y-1">
                    <p>
                        <strong>Thu thập và sử dụng dữ liệu</strong>
                    </p>
                    <p>
                        Chúng tôi thu thập các thông tin cần thiết để cung cấp dịch vụ, bao gồm tên, địa chỉ email, phương thức thanh toán và lịch sử giao dịch. Dữ liệu này được sử dụng nhằm mục đích xác thực, cải thiện trải nghiệm người dùng và đảm bảo an toàn hệ thống.
                    </p>
                    </div>
                    <div className="space-y-1">
                    <p>
                        <strong>Chia sẻ thông tin với bên thứ ba</strong>
                    </p>
                    <p>
                        Chúng tôi cam kết không chia sẻ thông tin cá nhân của bạn với bên thứ ba trừ khi:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Được sự đồng ý rõ ràng từ bạn.</li>
                        <li>Phục vụ mục đích pháp lý hoặc theo yêu cầu của cơ quan chức năng.</li>
                        <li>Hợp tác với đối tác cung cấp dịch vụ thanh toán hoặc bảo mật.</li>
                    </ul>
                    </div>
                    <div className="space-y-1">
                    <p>
                        <strong>Bảo mật thông tin</strong>
                    </p>
                    <p>
                        Dữ liệu người dùng được mã hóa bằng công nghệ SSL 256-bit và lưu trữ trên hệ thống bảo mật cao. Chúng tôi thực hiện kiểm tra định kỳ để ngăn chặn truy cập trái phép, rò rỉ hoặc mất mát dữ liệu.
                    </p>
                    </div>
                    <div className="space-y-1">
                    <p>
                        <strong>Quyền của người dùng</strong>
                    </p>
                    <p>
                        Bạn có <b><i>quyền truy cập, chỉnh sửa</i></b> bất kỳ lúc nào thông qua 
                        trang quản lý tài khoản hoặc liên hệ với bộ phận hỗ trợ. Ngược lại, Tài khoản 
                        sẽ <b><i>không thể xóa trừ khi sau 1 năm không sử dụng</i></b>. 
                        Với mục đích, lưu thông tin giao dịch, nhằm phục vụ mục đích pháp lý 
                        hoặc yêu cầu của các cơ quan chức năng.
                    </p>
                    </div>
                    <div className="space-y-1">
                    <p>
                        <strong>Cookies và công nghệ theo dõi</strong>
                    </p>
                    <p>
                        Nền tảng chỉ sử dụng cookies để ghi nhớ tùy chọn người dùng và lưu thời gian đăng nhập.
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