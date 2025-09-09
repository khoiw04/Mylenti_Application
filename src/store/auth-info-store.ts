import { Store } from "@tanstack/store";

export const authInfoStore = new Store({
    isAuthenticated: false,
    email: '',
    currentUser: '',
    display_name: '',
    display_avatar: '',
    socialInfo: {
        facebook: null as string | null,
        x: null as string | null,
        youtube: null as string | null
    }
})