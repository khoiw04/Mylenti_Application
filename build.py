import subprocess
import sys
import os
import shutil
import importlib.util

print(f"🐍 Using Python: {sys.executable}")

def copy_vietvoicetts():
    spec = importlib.util.find_spec("vietvoicetts")
    if spec and spec.origin:
        source_dir = os.path.dirname(spec.origin)
        target_dir = "src-tauri/python/vietvoicetts"
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        shutil.copytree(source_dir, target_dir)
        print(f"📦 Đã copy vietvoicetts từ site-packages → {target_dir}")
    else:
        print("❌ Không tìm thấy vietvoicetts trong site-packages")
        sys.exit(1)

def ensure_vietvoicetts_installed():
    try:
        import vietvoicetts
        print("✅ Thư viện vietvoicetts đã được cài.")
    except ImportError:
        print("❌ Chưa cài vietvoicetts. Đang cài đặt...")
        subprocess.run([sys.executable, "-m", "pip", "install", "vietvoicetts"], check=True)

def clean_previous_build():
    for folder in ["build", "dist"]:
        if os.path.exists(folder):
            shutil.rmtree(folder)
    if os.path.exists("donate_voice.spec"):
        os.remove("donate_voice.spec")

def build_executable():
    script_path = "src-tauri/python/donate_voice.py"
    models_path = "src-tauri/python/models"
    cmd = [
        "pyinstaller",
        "--onefile",
        "--add-data", "src-tauri/python/vietvoicetts;vietvoicetts",
        "--add-data", f"{models_path};models",
        "--hidden-import", "vietvoicetts",
        "--collect-submodules", "vietvoicetts",
        "--clean",
        script_path
    ]
    print("🔧 Đang build donate_voice.exe...")
    subprocess.run(cmd, check=True)

def move_executable():
    dist_path = "dist/donate_voice.exe"
    target_path = "src-tauri/bin/donate_voice.exe"
    if os.path.exists(dist_path):
        os.replace(dist_path, target_path)
        print(f"✅ Đã di chuyển: {dist_path} → {target_path}")
    else:
        print("❌ Build thất bại: Không tìm thấy donate_voice.exe")

if __name__ == "__main__":
    ensure_vietvoicetts_installed()
    copy_vietvoicetts()
    clean_previous_build()
    build_executable()
    move_executable()
