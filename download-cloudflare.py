import os
import platform
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
        print("Khong tim thay target triple")
        sys.exit(1)
    except Exception as e:
        print(f"Loi khi chay rustc -vV: {e}")
        sys.exit(1)

def get_download_url():
    platform_name = sys.platform
    arch = platform.machine()

    if platform_name.startswith("win"):
        return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
    elif platform_name.startswith("linux"):
        return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
    elif platform_name.startswith("darwin"):
        if arch == "arm64":
            return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64"
        elif arch == "x86_64":
            return "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64"
        else:
            print(f"Khong ho tro kien truc: {arch}")
            sys.exit(1)
    else:
        print("He dieu hanh khong duoc ho tro")
        sys.exit(1)

def download_and_rename(target_triple):
    url = get_download_url()
    ext = ".exe" if sys.platform.startswith("win") else ""
    temp_file = f"cloudflared_temp{ext}"
    final_path = os.path.join("src-tauri", "bin", f"cloudflared-{target_triple}{ext}")

    print(f"Dang tai tu Cloudflare tu: {url}")
    try:
        urllib.request.urlretrieve(url, temp_file)
        os.makedirs(os.path.dirname(final_path), exist_ok=True)

        if os.path.exists(final_path):
            os.remove(final_path)
            print(f"Da xoa file cu: {final_path}")

        shutil.move(temp_file, final_path)
        print(f"Da luu tai: {final_path}")
    except Exception as e:
        print(f"Loi khi tai hoac da di chuyen file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    triple = get_target_triple()
    download_and_rename(triple)
