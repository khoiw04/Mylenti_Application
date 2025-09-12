import { useAppForm } from "../../hooks/useFormHook";
import { createMutation } from "../../hooks/createMutations";
import { LogUpSchema } from "@/schema";
import { signupFn } from "@/func/auth.Log";

export default function useLogUpForm() {
  const mutation = createMutation(signupFn, {
    onSuccess() {
      return 'Kiểm tra Email để Hoàn Tất đăng ký!'
    },
  })

  return {
    form: useAppForm({
      defaultValues: {
        email: '',
        password: '',
        full_name: '',
        user_name: '',
      },
      onSubmit({ value }) {mutation.mutate({ data: value })},
      validators: { onSubmit: LogUpSchema }
    }),
    isSuccess: mutation.isSuccess
  }
}