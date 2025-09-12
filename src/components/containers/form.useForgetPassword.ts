import { createMutation } from "../../hooks/createMutations"
import { useAppForm } from "../../hooks/useFormHook"
import { fillInEmailFn } from "@/func/auth.ForgetPasword"
import { ForgetEmailSchema } from "@/schema"

export function useForgetPassword() {
  const mutation = createMutation(fillInEmailFn)

  const form = useAppForm({
      defaultValues: { email: '' },
      onSubmit: ({ value }) => mutation.mutate(({ data: value })),
      validators: { onSubmit: ForgetEmailSchema }
  })

  return { form, isSucess: mutation.isSuccess }
}