VERBOSE = True

import subprocess
import sys
import os
import shutil
import importlib.util

print(f"Using Python: {sys.executable}")

def get_target_triple():
    try:
        rust_info = subprocess.check_output(["rustc", "-vV"], text=True)
        for line in rust_info.splitlines():
            if line.startswith("host:"):
                return line.split("host:")[1].strip()
        print("Khong xac dinh duoc target triple tu rustc")
        sys.exit(1)
    except Exception as e:
        print(f"Loi khi chay rustc -vV: {e}")
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

def build_executable():
    script_path = "src-tauri/python/donate_voice.py"
    models_path = "src-tauri/python/models"
    cmd = [
        "pyinstaller",
        "--onefile",
        "--console",
        "--add-data", "src-tauri/python/vietvoicetts;vietvoicetts",
        "--add-data", f"{models_path};models",
        "--hidden-import", "vietvoicetts",
        "--collect-submodules", "vietvoicetts",
        "--clean",
        script_path
    ]
    print("Dang build donate_voice.exe...")
    subprocess.run(cmd, check=True)

def move_executable(target_triple):
    dist_path = "dist/donate_voice.exe"
    ext = ".exe" if sys.platform == "win32" else ""
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
    build_executable()
    target_triple = get_target_triple()
    move_executable(target_triple)