import { useStore } from "@tanstack/react-store"
import { useEffect } from "react"
import { useAppForm } from "../../hooks/useFormHook"
import { createMutation } from "../../hooks/createMutations"
import { updateUserSchema } from "@/schema/user.schema"
import { avatarStore } from "@/store/avatar-store"
import { publishImage } from "@/lib/publishImage"
import { updateUser } from "@/func/auth.UpdateInfo"
import { authInfoStore } from "@/store/auth-info-store"
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo"

export default function useProfileForm() {
  const mutation = createMutation(updateUser, {
    successMessage: 'Đã cập nhật!'
  })
  const authInfo = useAuthInfoExternalStore()
  const croppedImage = useStore(avatarStore, state => state.croppedImage)
  const checkImages = croppedImage ?? authInfo.display_avatar

  const form = useAppForm({
    defaultValues: {
      full_name: authInfo.display_name,
      image: checkImages,
      requireUserName: false,
      ...authInfo.socialInfo,
    },
    onSubmit: ({ value }) => {
        const { image, full_name, facebook, x, youtube } = value

        croppedImage ?
            publishImage({
            config: {
                isAvatar: true,
                title: full_name,
                user_name: authInfo.currentUser
            },
            images: image,
            from: "Avatar's User",
            onSuccess: (imageUrls) => {
                const finalData = { ...value, image: imageUrls[0], };
                mutation.mutate({ data: {
                        ...finalData,
                        user_name: authInfo.currentUser,
                        requireUserName: false
                    }
                })
            }})
        : mutation.mutate({ data: {...value, user_name: authInfo.currentUser }})

        authInfoStore.setState(prev => ({
          ...prev,
          display_avatar: croppedImage ?? prev.display_avatar,
          display_name: full_name,
          socialInfo: {
            ...prev.socialInfo,
            facebook,
            x,
            youtube
          }
        }))
    },
    validators: { onSubmit: updateUserSchema }
  })

  useEffect(() => {
    form.setFieldValue("image", croppedImage ?? authInfo.display_avatar)
  }, [croppedImage, authInfo.display_avatar])

  return { form, checkImages }
}