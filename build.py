VERBOSE = True

import subprocess
import sys
import os
import shutil
import importlib.util
import requests
import platform

print(f"Using Python: {sys.executable}")

MODEL_URL = "https://huggingface.co/nguyenvulebinh/VietVoice-TTS/resolve/main/model-bin.pt"
MODEL_PATH = "src-tauri/python/models/model-bin.pt"
SCRIPT_PATH = "src-tauri/python/donate_voice.py"

def get_target_triple():
    arch = platform.machine().lower()
    system = sys.platform

    print(f"[DEBUG] Kiến trúc: {arch}, Hệ điều hành: {system}")

    if system == "darwin":
        if arch == "arm64":
            return "aarch64-apple-darwin"
        elif arch == "x86_64":
            return "x86_64-apple-darwin"
    elif system == "linux":
        return "x86_64-unknown-linux-gnu"
    elif system == "win32":
        return "x86_64-pc-windows-msvc"

    print(f"[ERROR] Không xác định được target triple cho hệ thống: {system}, kiến trúc: {arch}")
    sys.exit(1)

def copy_vietvoicetts():
    spec = importlib.util.find_spec("vietvoicetts")
    if spec and spec.origin:
        source_dir = os.path.dirname(spec.origin)
        target_dir = "src-tauri/python/vietvoicetts"
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        shutil.copytree(source_dir, target_dir)
        print(f"Da copy vietvoicetts tu site-packages -> {target_dir}")
    else:
        print("Khong tim thay vietvoicetts trong site-packages")
        sys.exit(1)

def ensure_vietvoicetts_installed():
    try:
        import vietvoicetts
        print("Thu vien vietvoicetts da duoc cai dat.")
    except ImportError:
        print("Chua cai vietvoicetts. Dang cai dat...")
        subprocess.run([sys.executable, "-m", "pip", "install", "vietvoicetts"], check=True)

def clean_previous_build():
    for folder in ["build", "dist"]:
        if os.path.exists(folder):
            shutil.rmtree(folder)
    if os.path.exists("donate_voice.spec"):
        os.remove("donate_voice.spec")

def download_model_if_missing():
    if not os.path.exists(MODEL_PATH):
        print("Model chua ton tai. Dang tai tu Hugging Face...")
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        try:
            response = requests.get(MODEL_URL)
            response.raise_for_status()
            with open(MODEL_PATH, "wb") as f:
                f.write(response.content)
            print("Da tai model thanh cong:", MODEL_PATH)
        except Exception as e:
            print("Loi khi tai model:", e)
            sys.exit(1)
    else:
        print("Model da ton tai:", MODEL_PATH)

def build_executable():
    sep = ";" if sys.platform == "win32" else ":"

    cmd = [
        "pyinstaller",
        "--onefile",
        "--console",
        "--add-data", f"src-tauri/python/vietvoicetts{sep}vietvoicetts",
        "--add-data", f"{MODEL_PATH}{sep}models",
        "--hidden-import", "vietvoicetts",
        "--collect-submodules", "vietvoicetts",
        "--clean",
        SCRIPT_PATH
    ]
    print("Dang build donate_voice...")
    subprocess.run(cmd, check=True)

def move_executable(target_triple):
    ext = ".exe" if sys.platform == "win32" else ""
    dist_path = f"dist/donate_voice{ext}"
    target_path = f"src-tauri/bin/donate_voice-{target_triple}{ext}"
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    if os.path.exists(dist_path):
        os.replace(dist_path, target_path)
        print(f"Da di chuyen: {dist_path} -> {target_path}")
    else:
        print(f"Build that bai: Khong tim thay file tai {os.path.abspath(dist_path)}")

if __name__ == "__main__":
    ensure_vietvoicetts_installed()
    copy_vietvoicetts()
    clean_previous_build()
    download_model_if_missing()
    build_executable()
    target_triple = get_target_triple()
    move_executable(target_triple)