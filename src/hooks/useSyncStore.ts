import { useEffect } from "react";

export function useSyncStore<T>(
  store: { setState: (updater: (prev: T) => T) => void },
  updater: (prev: T) => T,
  deps: React.DependencyList
) {
  useEffect(() => {
    store.setState(updater);
  }, deps);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function useMergeStoreField<T, K extends keyof T>(
  store: { setState: (updater: (prev: T) => T) => void },
  key: K,
  partial: Partial<T[K]>,
  deps: React.DependencyList
) {
  useEffect(() => {
    store.setState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...partial
      }
    }));
  }, deps);
}