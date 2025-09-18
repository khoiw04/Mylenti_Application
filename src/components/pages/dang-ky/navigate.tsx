import { Link } from "@tanstack/react-router";

export default function Navigate() {
    return (
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <div>
          Đã có tài khoản?{" "}
          <Link to='/' className="underline underline-offset-4">
            Đăng nhập
          </Link>
        </div>
      </div>
    )
}