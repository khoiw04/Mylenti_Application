import { Store } from "@tanstack/store";
import type { NotificationType } from "@/types/store/notifcation";

export const NotificationStore = new Store<NotificationType>([])