import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo } from "react";
import { useAppForm } from "../../hooks/useFormHook";
import useAuthInfo from "../../hooks/useAuthInfo";
import { useResetMutation } from "./mutation.useReset";
import { avatarStore } from "@/store/avatar-store";
import { updateUserNameSchema } from "@/schema/user.schema";
import { useResetPropsStore } from "@/store/reset-store";
import { publishImage } from "@/lib/publishImage";

export default function useResetForm() {
  const info = useAuthInfo()
  const mutation = useResetMutation()
  const croppedImage = useStore(avatarStore, state => state.croppedImage)
  const checkImages = croppedImage ?? info.display_avatar

  const form = useAppForm({
    defaultValues: {
      image: croppedImage ?? info.display_avatar,
      full_name: info.display_name,
      user_name: info.currentUser,
      requireUserName: true,
      ...info.socialInfo,
    },
    validators: { onSubmit: updateUserNameSchema },
    onSubmit: ({ value }) => {
      const { user_name, full_name, image } = value

      croppedImage ?
        publishImage({
          config: {
            user_name,
            isAvatar: false,
            title: full_name
          },
          images: image,
          from: "Avatar's User",
          onSuccess: (imageUrls) => {
              const finalData = { ...value, image: imageUrls[0] };
              mutation.mutate({ data: {
                ...finalData, 
                requireUserName: true
              } 
            });
          },
        })
      :
        mutation.mutate({ data: value });
    },
  })

  useEffect(() => {
    form.setFieldValue("image", croppedImage ?? info.display_avatar);
  }, [croppedImage, info.display_avatar]);

  const ResetProps = useMemo(() => ({ form, checkImages }), [])
  useResetPropsStore.setState(prev => ({ ...prev, ...ResetProps }))

  return { form, checkImages }
}