import { useStore } from "@tanstack/react-store"
import { useEffect } from "react"
import useAuthInfo from "../../hooks/useAuthInfo"
import { useAppForm } from "../../hooks/useFormHook"
import { createMutation } from "../../hooks/createMutations"
import { updateUserSchema } from "@/schema/user.schema"
import { avatarStore } from "@/store/avatar-store"
import { publishImage } from "@/lib/publishImage"
import { updateUser } from "@/func/auth.UpdateInfo"

export default function useProfileForm() {
  const info = useAuthInfo()
  const mutation = createMutation(updateUser, {
    successMessage: 'Đã cập nhật!'
  })
  const croppedImage = useStore(avatarStore, state => state.croppedImage)
  const checkImages = croppedImage ?? info.display_avatar

  const form = useAppForm({
    defaultValues: {
      full_name: info.display_name,
      image: checkImages,
      requireUserName: false,
      ...info.socialInfo,
    },
    onSubmit: ({ value }) => {
        const { image, full_name } = value

        croppedImage ?
            publishImage({
            config: {
                isAvatar: true,
                title: full_name,
                user_name: info.currentUser
            },
            images: image,
            from: "Avatar's User",
            onSuccess: (imageUrls) => {
                const finalData = { ...value, image: imageUrls[0], };
                mutation.mutate({ data: {
                        ...finalData,
                        user_name: info.currentUser,
                        requireUserName: false
                    }
                })
            }})
        : mutation.mutate({ data: {...value, user_name: info.currentUser }})
    },
    validators: { onSubmit: updateUserSchema }
  })

  useEffect(() => {
    form.setFieldValue("image", croppedImage ?? info.display_avatar)
  }, [croppedImage, info.display_avatar])

  return { form, checkImages }
}