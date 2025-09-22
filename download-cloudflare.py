import os
import sys
import subprocess
import urllib.request
import shutil

def get_target_triple():
    try:
        output = subprocess.check_output(["rustc", "-vV"], text=True)
        for line in output.splitlines():
            if line.startswith("host:"):
                return line.split("host:")[1].strip()
        print("❌ Không tìm thấy target triple")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Lỗi khi chạy rustc -vV: {e}")
        sys.exit(1)

def get_download_url():
    platform = sys.platform
    if platform.startswith("win"):
        return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
    elif platform.startswith("linux"):
        return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
    elif platform.startswith("darwin"):
        return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64"
    else:
        print("❌ Hệ điều hành không được hỗ trợ")
        sys.exit(1)

def download_and_rename(target_triple):
    url = get_download_url()
    ext = ".exe" if sys.platform.startswith("win") else ""
    temp_file = f"cloudflared_temp{ext}"
    final_path = os.path.join("src-tauri", "bin", f"cloudflared-{target_triple}{ext}")

    print(f"🌐 Đang tải Cloudflared từ: {url}")
    try:
        urllib.request.urlretrieve(url, temp_file)
        os.makedirs(os.path.dirname(final_path), exist_ok=True)

        if os.path.exists(final_path):
            os.remove(final_path)
            print(f"🧹 Đã xóa file cũ: {final_path}")

        shutil.move(temp_file, final_path)
        print(f"✅ Đã lưu tại: {final_path}")
    except Exception as e:
        print(f"❌ Lỗi khi tải hoặc di chuyển file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    triple = get_target_triple()
    download_and_rename(triple)
