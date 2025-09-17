@echo off
setlocal enabledelayedexpansion

echo 🐍 Đang dùng Python: %PYTHON%
where python >nul 2>nul
if errorlevel 1 (
    echo ❌ Không tìm thấy Python trong PATH. Vui lòng cài đặt Python hoặc thêm vào PATH.
    exit /b 1
)

echo 🧹 Dọn dẹp build cũ...
rmdir /s /q build
rmdir /s /q dist
del donate_voice.spec 2>nul

echo 📦 Đang copy thư viện vietvoicetts từ site-packages...
python -c "import importlib.util, shutil, os; \
spec = importlib.util.find_spec('vietvoicetts'); \
src = os.path.dirname(spec.origin); \
dst = 'src-tauri/python/vietvoicetts'; \
shutil.rmtree(dst, ignore_errors=True); \
shutil.copytree(src, dst); \
print(f'✅ Đã copy từ {src} → {dst}')"

echo 🛠️ Đang build donate_voice.exe bằng PyInstaller...
pyinstaller src-tauri/python/donate_voice.py ^
  --onefile ^
  --add-data src-tauri/python/models;models ^
  --add-data src-tauri/python/vietvoicetts;vietvoicetts ^
  --clean

if exist dist\donate_voice.exe (
    echo ✅ Build thành công. Đang di chuyển file .exe...
    move /Y dist\donate_voice.exe src-tauri\bin\donate_voice.exe
) else (
    echo ❌ Build thất bại. Không tìm thấy donate_voice.exe
    exit /b 1
)

echo 🚀 Đang khởi động Flask server...
start cmd /K "cd /d src-tauri\bin && donate_voice.exe"

echo ✅ Hệ thống đã khởi động hoàn tất!
exit /b 0
