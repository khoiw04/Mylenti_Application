import { useRouter } from "@tanstack/react-router"
import { createMutation } from "../../hooks/createMutations"
import { useAppForm } from "../../hooks/useFormHook"
import { forgetPassFn } from "@/func/auth.ForgetPasword"
import { exchangeCodeInClient } from "@/func/auth.Oauth"
import { ResetPassSchema } from "@/schema/logIn.schema"

export default function useRemeberPassword() {
  const router = useRouter()

  const mutation = createMutation(forgetPassFn, {
      onSuccess() {router.navigate({ to: '/' })}
  })

  const form = useAppForm({
      defaultValues: { password: '' },
      onSubmit: async ({ value }) => {
          await exchangeCodeInClient()

          mutation.mutate(({ data: value }))
      },
      validators: { onSubmit: ResetPassSchema } 
  })

  return { form, mutation }
}