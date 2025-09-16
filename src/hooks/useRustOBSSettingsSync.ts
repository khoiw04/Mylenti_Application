import { debounce } from '@tanstack/react-pacer';
import useTauriSafeEffect from './useTauriSideEffect';
import { OBSOverlaySettingsProps, loadOBSSetting, saveOBSSetting } from '@/store';
import { sanitizeOBSOverlaySettings } from '@/data/db.sanitizeOBSOverlaySettings';

export const useInitOBSOverlaySettings = () => {
  useTauriSafeEffect(() => {
    const init = async () => {
      const saved = await loadOBSSetting();
      if (typeof saved === 'object') {
        const safeState = sanitizeOBSOverlaySettings(saved);
        OBSOverlaySettingsProps.setState(safeState);
      }
    };

    init();
  }, []);
};

export default function useSyncOBSOverlaySettings() {
  useTauriSafeEffect(() => {
    const debouncedSave = debounce(saveOBSSetting, {
      wait: 500,
      trailing: true,
    });

    const unsub = OBSOverlaySettingsProps.subscribe(({ currentVal }) => {
      debouncedSave(currentVal);
    });

    return () => {
      unsub()
    };
  }, [])
}