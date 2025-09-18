import { Store } from "@tanstack/store";

export const IndexState = new Store({
  finishGoogleOBSAuth: false
})

export const IndexStraregy = new Store({
  onGoogleLogInClick: () => {},
  onGoogleLogOutClick: async () => await ({
    status: "",
    message: ""
  }),
  onFinishGoogleOBSAuth: () => IndexState.setState(prev => ({ ...prev, finishGoogleOBSAuth: true })),
  onLogOutGoogleOBSAuth: () => IndexState.setState(prev => ({ ...prev, finishGoogleOBSAuth: false }))
})