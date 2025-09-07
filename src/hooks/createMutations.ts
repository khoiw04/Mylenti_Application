import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ExternalToast} from "sonner";

export function createMutation<TData, TError, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onMutate?: () => void;
    successMessage?: string;
    errorMessage?: string;
    toastOptions?: ExternalToast
  }
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onMutate: () => {
      document.body.style.cursor = 'wait';
      options?.onMutate?.()
    },
    onSuccess: (data) => {
      document.body.style.cursor = 'default';
      toast.success(options?.successMessage || 'Thành công!', {
        ...options?.toastOptions,
      })
      options?.onSuccess?.(data)
    },
    onError: (error: any) => {
      document.body.style.cursor = 'default';
      toast.error(`${options?.errorMessage || 'Lỗi Server'}: ${error.message}`)
    },
  })
}