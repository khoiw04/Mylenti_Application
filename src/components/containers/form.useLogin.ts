import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/hooks/useFormHook";
import { createMutation } from "@/hooks/createMutations";
import { LogInSchema } from "@/schema";
import { loginFn } from "@/func/auth.SupabaseLog";
import { logInWithOauth } from "@/func/fn.logInWithOauth";
import { useDimension } from "@/hooks/useDimension";
import { exchangeCodeForSession } from "@/func/auth.SupabaseOauth";
import OAuthServerManager from "@/class/OAuthServerManager";

function useListenGoogleLoginOauth() {
  const router = useRouter()
  useEffect(() => {
    const oauth = new OAuthServerManager()
    oauth.init({
      ports: [3001],
      response: "Qua trình đăng nhập hoàn tất! Vui lòng đóng cửa sổ này.",
      onCodeReceived: async (code) => {
        await exchangeCodeForSession({ data: { code } })
        await router.navigate({ to: '/', reloadDocument: true })
      }
    }).catch((err) => {
      toast.error(`Lỗi khởi tạo OAuth server: ${err}`)
    })

    return () => {
      oauth.cleanup()
    }
  }, [])
}

export default function useLogInForm() {
  const router = useRouter()
  const { dimension } = useDimension()
  const mutation = createMutation(loginFn, {
    onSuccess() {
      router.navigate({ to: '/', reloadDocument: true })
      return 'Đã thắng Đăng nhập!'
    },
  })

  useListenGoogleLoginOauth()

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