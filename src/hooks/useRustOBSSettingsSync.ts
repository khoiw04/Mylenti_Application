import { useEffect } from 'react';
import { debounce } from '@tanstack/react-pacer';
import { OBSOverlaySettingsProps, loadOBSSetting, saveOBSSetting } from '@/store';

export default function useRustOBSSettingSync() {
  useEffect(() => {
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

  return null
}

export const initOBSOverlaySettings = async () => {
  // const saved = await loadOBSSetting();

  // useEffect(() => {
  //     if (typeof saved === 'object') {
  //       OBSOverlaySettingsProps.setState(saved);
  //     }
  // }, [])
  return null
}