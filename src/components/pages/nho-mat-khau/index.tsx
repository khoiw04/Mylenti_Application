
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import useRemeberPassword from "@/components/containers/form.useRemeberPassword"

export function RememberForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form } = useRemeberPassword()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <form.AppField
                    name='password'
                    children={(field) => 
                      <field.TextField
                        type='password'
                        placeholder='Mật khẩu...'
                        showBug
                      />
                    }
                  />
                </div>
                <form.AppForm>
                  <form.ButtonSubmit>
                    Xác thực
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
