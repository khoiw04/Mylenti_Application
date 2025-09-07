import { toast } from "sonner";
import type { ChatTypeStrategyType, LoaderPropsStrategy, UploadStrategyProps, VerifiedIconStrategyType } from "@/types/func/stragery";
import { avatarStore } from "@/store/avatar-store";
import { bankQueries, donateQueries, profileQueries } from "@/lib/queries";
import { addAtPrefix } from "@/lib/utils";
import { NormalChat, VerifiedChat } from "@/components/pages/obs-overlay/ChatType";
import AvatarVertifed from "@/components/pages/obs-overlay/AvatarVertifed";

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
  }
}

export const loaderStrategy: LoaderPropsStrategy = {
  getUserData: async (profileID, ctx) =>
    await ctx.queryClient.ensureQueryData(profileQueries.user(addAtPrefix(profileID))),

  getDonateList: async (profileID, ctx) =>
    await ctx.queryClient.ensureQueryData(donateQueries.donate(addAtPrefix(profileID))),

  getBanksData: async (profileID, ctx) =>
    await ctx.queryClient.ensureQueryData(bankQueries.bankQueries(addAtPrefix(profileID)))
};

export const ChatTypeStrategy: ChatTypeStrategyType = {
  "Kiểm Duyệt": VerifiedChat,
  "Bình Thường": NormalChat,
  "Superchat": null,
  "Thành Viên": null,
  "Đã Xác Minh": VerifiedChat,
  "Ủng Hộ": null
}

export const VerifiedIconStrategy: VerifiedIconStrategyType = {
  default: AvatarVertifed
}