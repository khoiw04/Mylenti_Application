import { debounce } from '@tanstack/react-pacer';
import { useStore } from '@tanstack/react-store';
import { BaseDirectory, tempDir } from '@tauri-apps/api/path';
import { readDir, remove } from '@tauri-apps/plugin-fs'
import useTauriSafeEffect from './useTauriSideEffect';
import { OBSOverlayTauriSettingsProps, loadOBSSetting, saveOBSSetting } from '@/store';
import { sanitizeOBSOverlaySettings } from '@/func/db.sanitizeOBSOverlaySettings';
import { DonateVoiceController } from '@/class/DonateVoiceController';

export const useInitOBSOverlaySettings = () => {
  useTauriSafeEffect(() => {
    (async () => {
      const saved = await loadOBSSetting();
      if (typeof saved === 'object') {
        const safeState = sanitizeOBSOverlaySettings(saved);
        OBSOverlayTauriSettingsProps.setState(safeState);
      }
    })()
  }, []);
};

export default function useSyncOBSOverlaySettings() {
  useTauriSafeEffect(() => {
    const debouncedSave = debounce(saveOBSSetting, {
      wait: 500,
      trailing: true
    });

    const unsub = OBSOverlayTauriSettingsProps.subscribe(({ currentVal }) => {
      debouncedSave(currentVal);
    });

    return () => {
      unsub()
    };
  }, [])
}

export function useSyncOBSDonateSetting() {
  const { DonateProps: { enableVoice } } = useStore(OBSOverlayTauriSettingsProps)

  async function deleteAllMEIFolders() {
    try {
      const temp = await tempDir()
      const entries = await readDir(temp)

      for (const entry of entries) {
        if (entry.name.includes('_MEI')) {
          await remove(entry.name, { recursive: true, baseDir: BaseDirectory.Temp })
        }
      }
    } catch (err) {
      console.error('❌ Lỗi khi đọc thư mục TEMP:', err)
    }
  }

  useTauriSafeEffect(() => {
    if (enableVoice) {
      DonateVoiceController.start()
    } else {
      (async () => {
        await deleteAllMEIFolders()
      })()
      DonateVoiceController.stop()
    }
    return () => DonateVoiceController.stop()
  }, [enableVoice])
}