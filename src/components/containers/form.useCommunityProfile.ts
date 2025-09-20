import { useAppForm } from "../../hooks/useFormHook"
import type { DiscordSocialSchemaType } from "@/types"
import { discordSocialSchema } from "@/schema"
import { upsertDiscordUser } from "@/data/discord.sqlite"
import useSQLiteDiscordInfo from "@/hooks/useSQLiteDiscordInfo"
import { createMutation } from "@/hooks/createMutations"

export default function useCommunityProfileForm() {
  const { data: meta, avatar } = useSQLiteDiscordInfo()

  const form = useAppForm({
    defaultValues: {
      full_name: meta.name,
      youtube: '' as string | null,
      facebook: '' as string | null,
      x: '' as string | null,
    },
    onSubmit: async ({ value }) => await mutation.mutateAsync(value),
    validators: { 
      onSubmit: discordSocialSchema 
    }
  })

  const mutation = createMutation(async (value: DiscordSocialSchemaType) => {
    await upsertDiscordUser({
      id: meta.id,
      email: meta.email,
      name: value.full_name,
      user_name: meta.user_name,
      youtube: value.full_name,
      facebook: value.facebook,
      x: value.x,
    })
  }, {
    successMessage: 'Đã Cập Nhật'
  })

  return { form, meta, avatar }
}