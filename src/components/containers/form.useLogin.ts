import { useRouter } from "@tanstack/react-router";
import { useAppForm } from "../../hooks/useFormHook";
import { createMutation } from "../../hooks/createMutations";
import { LogInSchema } from "@/schema/logIn.schema";
import { loginFn } from "@/func/auth.Log";
import { logInWithOauth } from "@/func/logInWithOauth";
import { useDimension } from "@/hooks/useDimension";

export default function useLogInForm() {
  const router = useRouter()
  const { dimension } = useDimension()
  const mutation = createMutation(loginFn, {
    onSuccess() {
      router.navigate({ to: '/', reloadDocument: true })
      return 'Đã thắng Đăng nhập!'
    },
  })

  return {
    form: useAppForm({
      defaultValues: {
        email: '',
        password: '',
      },
      onSubmit({ value }) {mutation.mutate({ data: value })},
      validators: { onSubmit: LogInSchema }
    }),
    loginOauth: async () => await logInWithOauth({ provider: 'google', router, dimension })
  }
}