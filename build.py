import subprocess
import sys
import os
import shutil

print(f"🐍 Using Python: {sys.executable}")

try:
    import vietvoicetts
    print("✅ Thư viện vietvoicetts đã được cài.")
except ImportError:
    print("❌ Thư viện vietvoicetts chưa được cài. Đang cài đặt...")
    subprocess.run([sys.executable, "-m", "pip", "install", "vietvoicetts"], check=True)

script_path = "src-tauri/python/donate_voice.py"
models_path = "src-tauri/python/models"
spec_file = "donate_voice.spec"

for folder in ["build", "dist"]:
    if os.path.exists(folder):
        shutil.rmtree(folder)
if os.path.exists(spec_file):
    os.remove(spec_file)

cmd = [
    "pyinstaller",
    "--onefile",
    "--add-data", f"{models_path}{os.pathsep}models",
    "--hidden-import", "vietvoicetts",
    "--collect-submodules", "vietvoicetts",
    "--clean",
    script_path
]

print("🔧 Đang build donate_voice.exe...")
subprocess.run(cmd, check=True)

dist_path = "dist/donate_voice.exe"
target_path = "src-tauri/bin/donate_voice.exe"

if os.path.exists(dist_path):
    os.replace(dist_path, target_path)
    print(f"✅ Đã di chuyển: {dist_path} → {target_path}")
else:
    print("❌ Build thất bại: Không tìm thấy donate_voice.exe")