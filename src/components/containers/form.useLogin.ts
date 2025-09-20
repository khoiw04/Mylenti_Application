import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { cancel, onUrl, start } from '@fabianlars/tauri-plugin-oauth';
import { toast } from "sonner";
import { useAppForm } from "@/hooks/useFormHook";
import { createMutation } from "@/hooks/createMutations";
import { LogInSchema } from "@/schema";
import { loginFn } from "@/func/auth.Log";
import { logInWithOauth } from "@/func/fn.logInWithOauth";
import { useDimension } from "@/hooks/useDimension";
import { exchangeCodeForSession } from "@/func/auth.Oauth";

function useListenGoogleLoginOauth() {
  const router = useRouter()
  useEffect(() => {
    let portRef: number | null = null
    try {
      (async () => {
        const port = await start({
          ports: [3001],
          response: "Qua trinh dang nhap hoan tat! Vui long dong cua so nay."
        });
        portRef = port

        await onUrl(async (redirectUrl) => {
          const urlObj = new URL(redirectUrl)
          const code = urlObj.searchParams.get('code')
          if (code) {
            await exchangeCodeForSession({ data: { code } })

            await Promise.all([
              cancel(port),
              router.navigate({ to: '/', reloadDocument: true })
            ])
          }
        })
      })()
    } catch (error) {
      toast.error(`Lỗi khởi tạo OAuth server:, ${error}`);
    }
    return () => {
        if (portRef !== null) {
            cancel(portRef)
        }
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