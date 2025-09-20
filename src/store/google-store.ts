import { Store } from "@tanstack/store";

export const GoogleState = new Store({
  finishGoogleOBSAuth: false
})

export const GoogleStraregy = new Store({
  onGoogleLogInClick: () => {},
  onGoogleLogOutClick: async () => await ({
    status: "",
    message: ""
  }),
  onFinishGoogleOBSAuth: () => GoogleState.setState(prev => ({ ...prev, finishGoogleOBSAuth: true })),
  onLogOutGoogleOBSAuth: () => GoogleState.setState(prev => ({ ...prev, finishGoogleOBSAuth: false }))
})