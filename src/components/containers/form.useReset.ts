import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo } from "react";
import { useAppForm } from "../../hooks/useFormHook";
import { useResetMutation } from "./mutation.useReset";
import { avatarStore, useResetPropsStore } from "@/store";
import { updateUserNameSchema } from "@/schema";
import { publishImage } from "@/components/containers/db.usePublishImage";
import { useAuthInfoExternalStore } from "@/hooks/useAuthSupabaseInfo";

export default function useResetForm() {
  const authInfo = useAuthInfoExternalStore()
  const mutation = useResetMutation()
  const croppedImage = useStore(avatarStore, state => state.croppedImage)
  const checkImages = croppedImage ?? authInfo.display_avatar

  const form = useAppForm({
    defaultValues: {
      image: croppedImage ?? authInfo.display_avatar,
      full_name: authInfo.display_name,
      user_name: authInfo.currentUser,
      requireUserName: true,
      ...authInfo.socialInfo,
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
    form.setFieldValue("image", croppedImage ?? authInfo.display_avatar);
  }, [croppedImage, authInfo.display_avatar]);

  const ResetProps = useMemo(() => ({ form, checkImages }), [])
  useResetPropsStore.setState(prev => ({ ...prev, ...ResetProps }))

  return { form, checkImages }
}