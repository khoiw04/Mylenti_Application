import { useAppForm } from "../../hooks/useFormHook"
import { createMutation } from "../../hooks/createMutations"
import { discordSocialSchema } from "@/schema"
import { updateUser } from "@/func/auth.UpdateInfo"
import { useDiscordCommunityUser } from "@/lib/queries"

export default function useCommunityProfileForm() {
  const { meta } = useDiscordCommunityUser().data
  const mutation = createMutation(updateUser, {successMessage: 'Đã cập nhật!'})

  const form = useAppForm({
    defaultValues: {
      full_name: meta.global_name,
      youtube: '' as string | null,
      facebook: '' as string | null,
      x: '' as string | null,
    },
    onSubmit: ({ value }) => {

    },
    validators: { 
      onSubmit: discordSocialSchema 
    }
  })

  return { form, meta }
}