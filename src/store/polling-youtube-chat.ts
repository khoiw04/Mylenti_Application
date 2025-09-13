import { Store } from '@tanstack/store'

export const PollingStatusStore = new Store({
  isPaused: false,
  isError: false,
  lastErrorMessage: '',
  resumePolling: () => {}
})

export const PollingStatusStragery = new Store({
  setIsPaused: (boolean: boolean) => 
    PollingStatusStore.setState(prev => ({
      ...prev,
      isPaused: boolean
    })),
  setIsError: (boolean: boolean) => 
    PollingStatusStore.setState(prev => ({
      ...prev,
      isError: boolean
    })),
  setLastErrorMessage: (msg: string) => 
    PollingStatusStore.setState(prev => ({
      ...prev,
      lastErrorMessage: msg
    })),
  setResumePolling: (fn: () => void) => 
    PollingStatusStore.setState(prev => ({
      ...prev,
      resumePolling: fn
    })),
})