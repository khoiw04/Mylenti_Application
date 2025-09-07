import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import useReset from "@/components/containers/form.useReset"
import { useCroppedAvatar } from "@/hooks/useCroppedAvatar"

export function ResetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, checkImages } = useReset()
  const UICropped = useCroppedAvatar(checkImages)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster expand richColors theme="light" />
      <Card>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <div className="grid gap-6">
              {UICropped}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <form.AppField
                    name='full_name'
                    children={(field) => 
                      <field.TextField
                        type='text'
                        placeholder='Ha Van An'
                        showBug
                      />
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name='user_name'
                    children={(field) => 
                      <field.TextField
                        type='text'
                        placeholder="@Example..."
                        showBug
                      />
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name='youtube'
                    children={(field) => 
                      <field.TextField
                        type='text'
                        placeholder="@YouTube"
                        showBug
                      />
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name='facebook'
                    children={(field) => 
                      <field.TextField
                        type='text'
                        placeholder="@Facebook"
                        showBug
                      />
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name='x'
                    children={(field) => 
                      <field.TextField
                        type='text'
                        placeholder="@X"
                        showBug
                      />
                    }
                  />
                </div>
                <form.AppForm>
                  <form.ButtonSubmit>
                    Cập nhật
                  </form.ButtonSubmit>
                </form.AppForm>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
