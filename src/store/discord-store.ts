import { Store } from "@tanstack/store";

export const DiscordStraregy = new Store({
  onDiscordLogInClick: () => {},
  onDiscordLogOutClick: async () => await ({
    status: "",
    message: ""
  })
})