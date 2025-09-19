import { isTauri } from '@tauri-apps/api/core';
import { useEffect } from 'react';

export default function useTauriSafeEffect(effect: () => void | (() => void), deps: React.DependencyList) {
  useEffect(() => {
    if (typeof window !== 'undefined' && isTauri()) {
      return effect();
    } else {
      console.warn('Tauri APIs are not available in this environment.');
    }
  }, deps);
}