import { Link } from "@tanstack/react-router";

export default function Navigate() {
    return (
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <div>
          Không có tài khoản?{" "}
          <Link to='/dang-ky' className="underline underline-offset-4">
            Đăng ký
          </Link>
        </div>
        <div className="mt-[1ch]">
          Không nhớ mật khẩu?{" "}
          <Link to='/quen-mat-khau' className="underline underline-offset-4">
            Khôi phục
          </Link>
        </div>
      </div>
    )
}