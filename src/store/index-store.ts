import { Store } from "@tanstack/store";

export const IndexState = new Store({
  finishGoogleOBSAuth: false
})

export const IndexStraregy = new Store({
  onGoogleClick: () => {},
  onFinishGoogleOBSAuth: () => IndexState.setState(prev => ({ ...prev, finishGoogleOBSAuth: true }))
})