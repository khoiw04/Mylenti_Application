import subprocess
import os

script_path = "src-tauri/python/donate_voice.py"

cmd = [
    "pyinstaller",
    "--onefile",
    "--add-data", "src-tauri/python/models;models",
    script_path,
    "--clean"
]

print("🔧 Building donate_voice.exe...")
subprocess.run(cmd, check=True)

dist_path = "dist/donate_voice.exe"
target_path = "src-tauri/bin/donate_voice.exe"

os.replace(dist_path, target_path)
print(f"✅ Moved {dist_path} → {target_path}")