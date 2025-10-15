# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_submodules

hiddenimports = ['vietvoicetts']
hiddenimports += collect_submodules('vietvoicetts')


a = Analysis(
    ['src-tauri\\python\\donate_voice.py'],
    pathex=[],
    binaries=[],
    datas=[('src-tauri/python/vietvoicetts', 'vietvoicetts'), ('src-tauri/python/models/model-bin.pt', 'models')],
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='donate_voice',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
