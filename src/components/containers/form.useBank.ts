import { useMemo } from "react";
import { Route } from "@/routes/ngan-hang"
import { createMutation } from "@/hooks/createMutations";
import { useAppForm } from "@/hooks/useFormHook";
import { handleBanks } from "@/func/db.Bank";
import { bankSchema } from "@/schema";
import { BankDisplayInfo } from "@/data/bank";
import { bankPropsStore } from "@/store";
import { useAuthInfoExternalStore } from "@/hooks/useAuthInfo";

const useBankInfo = () => Route.useLoaderData()

export default function useBankForm() {
    const data = useBankInfo()
    const authInfo = useAuthInfoExternalStore()

    const mutation = createMutation(handleBanks, {
        successMessage: 'Đã nhập thông tin'
    })

    const form = useAppForm({
        defaultValues: {
            api_key: data?.api_key,
            number: data?.number,
            full_name: data?.full_name,
            bank: data?.bank,
            email: authInfo.email,
            user_name: authInfo.currentUser
        },
        validators: { onSubmit: bankSchema },
        onSubmit({ value }) { mutation.mutate({ data: value }) }
    })

    const bankProps = useMemo(() => ({
       form,
       checkboxData: BankDisplayInfo.map(b => b.name),
       avatar: authInfo.display_avatar
    }), [])
    bankPropsStore.setState(bankProps)

    return form
}