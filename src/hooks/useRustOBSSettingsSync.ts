import { debounce } from '@tanstack/react-pacer';
import useTauriSafeEffect from './useTauriSideEffect';
import { OBSOverlayTauriSettingsProps, loadOBSSetting, saveOBSSetting } from '@/store';
import { sanitizeOBSOverlaySettings } from '@/func/db.sanitizeOBSOverlaySettings';

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