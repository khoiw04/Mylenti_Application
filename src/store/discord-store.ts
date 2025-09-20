import { Store } from "@tanstack/store";

export const DiscordInfoStore = new Store({
    isAuthenticated: false,
    meta: {
        id: '',
        avatar: '',
        username: '',
        global_name: ''
    },
})

export const DiscordStraregy = new Store({
  onDiscordLogInClick: () => {},
  onDiscordLogOutClick: async () => await ({
    status: "",
    message: ""
  })
})