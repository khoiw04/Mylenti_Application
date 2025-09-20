import { createMutation } from "@/hooks/createMutations";
import { useAppForm } from "@/hooks/useFormHook";
import { handleSupabaseBanks } from "@/func/db.SupabaseBank";
import { bankSchema } from "@/schema";
import { useDiscordCommunityUser } from "@/lib/queries";

export default function useBankForm() {
    const { meta } = useDiscordCommunityUser().data

    const mutation = createMutation(handleSupabaseBanks, {
        successMessage: 'Đã nhập thông tin'
    })

    const form = useAppForm({
        defaultValues: {
            api_key: '',
            number: '',
            full_name: '',
            bank: '',
            email: meta.email,
            user_name: meta.username
        },
        validators: { onSubmit: bankSchema },
        onSubmit({ value }) { mutation.mutate({ data: value }) }
    })

    return { form, meta }
}