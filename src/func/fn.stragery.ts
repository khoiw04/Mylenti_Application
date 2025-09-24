import { toast } from "sonner";
import { open } from "@tauri-apps/plugin-shell";
import WebSocketYouTubeMessage from "./websocketWebsite.YouTubeMessage";
import type { ChatTypeStrategyType, LoaderPropsStrategy, MemberIconStrategyType, ModeratorIconStrategyType, SuperchatIconStrategyType, UploadStrategyProps, VerifiedIconStrategyType, WebSocketHandlerStrategyType } from "@/types";
import WebSocketDonateTranscation from "@/func/websocketWebsite.DonateTranscation";
import WebSocketOBSSetting from "@/func/websocketWebsite.OBSSetting";
import { avatarStore } from "@/store";
import { bankQueries, donateQueries, profileQueries } from "@/lib/queries";
import { addAtPrefix } from "@/lib/utils";
import { MemberChat, ModeratorChat, NormalChat, SuperchatChat, VerifiedChat } from "@/components/presenters/ui-chattype";
import { DefaultAvatarVertifed } from "@/components/presenters/ui-chattype/AvatarVertifed";
import { DefaultAvatarModerator } from "@/components/presenters/ui-chattype/AvatarModerator";
import { DefaultAvatarMember } from "@/components/presenters/ui-chattype/AvatarMember";
import DonateType from "@/components/presenters/ui-donatetype";

export const UploadStrategy: UploadStrategyProps = {
  get: (from: string, files: Array<File>) => {
    const formData = new FormData()
    formData.append("from", from);
    files.forEach(file => formData.append("files", file));

    return formData
  },
  send: async (formData) => {
    return await fetch("/uploadFiles", {
      method: "POST",
      body: formData
    })
  },
  validate: async (response: Response) => {
    return await response.json().catch(() => {
      throw new Error("Phản hồi từ server không hợp lệ.");
    })
  },
  check: (response: Response, result: any) => {
    if (!response.ok || result?.error) {
      throw new Error(result?.error?.message || "Đăng ảnh thất bại");
    }
  }
}

export const cropedStrategy = {
  checkImage: (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
    }
  },
  updatePreview: (blobUrl: string) =>
    avatarStore.setState(prev => ({ ...prev, previewImage: blobUrl, open: true })),
  updateResult: (cropped: string | null | undefined) =>
    cropped
      ? avatarStore.setState(prev => ({ ...prev, croppedImage: cropped }))
      : toast.error('Lỗi: Không cắt được ảnh'),
};

export const logInWithOauthStrategy = {
  sessionFailed: (provider: string) => {
    toast.error(`Không lấy được Session từ ${provider}`)
    return
  },
  popupFailed: () => {
    toast.error('Trình duyệt chặn popup')
    return
  },
  tauriDirect: async  (url: string) => {
    await open(url)
  }
}

export const loaderStrategy: LoaderPropsStrategy = {
  getUserData: async (profileID, ctx) =>
    await ctx.queryClient.ensureQueryData(profileQueries.user(addAtPrefix(profileID))),

  getDonateDatabaseList: async (profileID, ctx) =>
    await ctx.queryClient.ensureQueryData(donateQueries.donate(addAtPrefix(profileID))),

  getBanksData: async (profileID, ctx) =>
    await ctx.queryClient.ensureQueryData(bankQueries.bankQueries(addAtPrefix(profileID)))
};

export const ChatTypeStrategy: ChatTypeStrategyType = {
  "Moderator": ModeratorChat,
  "Normal": NormalChat,
  "Superchat": SuperchatChat,
  "Member": MemberChat,
  "Verified": VerifiedChat,
  "Donate": DonateType
}

export const VerifiedIconStrategy: VerifiedIconStrategyType = {
  default: ({ srcAvatar }) => DefaultAvatarVertifed({ srcAvatar }),
  "Mori Seikai": ({ srcAvatar }) => DefaultAvatarVertifed({ srcAvatar }),
  "Siini": ({ srcAvatar }) => DefaultAvatarVertifed({ srcAvatar }),
  "Empty": ({ srcAvatar }) => DefaultAvatarVertifed({ srcAvatar }),
}

export const ModeratorIconStrategy: ModeratorIconStrategyType = {
  default: ({ srcAvatar }) => DefaultAvatarModerator({ srcAvatar }),
  "Mori Seikai": ({ srcAvatar }) => DefaultAvatarModerator({ srcAvatar }),
  "Siini": ({ srcAvatar }) => DefaultAvatarModerator({ srcAvatar }),
  "Empty": ({ srcAvatar }) => DefaultAvatarModerator({ srcAvatar }),  
}

export const MemberIconStrategy: MemberIconStrategyType = {
  default: ({ srcAvatar, srcTypeMember }) => DefaultAvatarMember({ srcAvatar, srcTypeMember }),
  "Mori Seikai": ({ srcAvatar, srcTypeMember }) => DefaultAvatarMember({ srcAvatar, srcTypeMember }),
  "Siini": ({ srcAvatar, srcTypeMember }) => DefaultAvatarMember({ srcAvatar, srcTypeMember }),
  "Empty": ({ srcAvatar, srcTypeMember }) => DefaultAvatarMember({ srcAvatar, srcTypeMember }),
}

export const SuperchatIconStrategy: SuperchatIconStrategyType = {
  Member: MemberIconStrategy,
  Moderator: ModeratorIconStrategy,
  Verified: VerifiedIconStrategy
}

export const WebSocketReceiveStrategy: WebSocketHandlerStrategyType = {
  'new-transaction': WebSocketDonateTranscation,
  'live-chat-message': WebSocketYouTubeMessage,
  'overlay-settings-update': WebSocketOBSSetting,
}

export const messagesWebSocketLogStrategy = {
  success: 'Đã kết nối WebSocket',
  warn: 'Lỗi kết nối WebSocket, tự động kết nối lại sau 30 giây',
  error: 'Kết nối WebSocket đã đóng'
}