import { useAppForm } from "@/hooks/useFormHook";
import { bankDiscordSchema } from "@/schema";
import useSQLiteDiscordInfo from "@/hooks/useSQLiteDiscordInfo";
import { upsertDiscordUser } from "@/data/discord.sqlite";
import { createMutation } from "@/hooks/createMutations";

export default function useBankForm() {
    const { data: meta, avatar } = useSQLiteDiscordInfo()

    const mutation = createMutation(async (value: {
        full_name: string,
        api_key: string,
        number: string,
        bank: string,
    }) => {
        await upsertDiscordUser({
            id: meta.id,
            name: meta.name,
            email: meta.email,
            full_name: value.full_name,
            user_name: meta.user_name,
            x: meta.x,
            youtube: meta.youtube,
            facebook: meta.facebook,
            api_key: value.api_key,
            number: value.number,
            bank: value.bank,
            avatar: avatar
        })
    }, {
        successMessage: 'Đã Cập Nhật'
    })

    const form = useAppForm({
        defaultValues: {
            api_key: meta.api_key ?? '',
            number: meta.number ?? '',
            full_name: meta.full_name ?? '',
            bank: meta.bank ?? '',
        },
        validators: { onSubmit: bankDiscordSchema },
        onSubmit: async ({ value }) => await mutation.mutateAsync(value)
    })

    return { form, meta, avatar }
}