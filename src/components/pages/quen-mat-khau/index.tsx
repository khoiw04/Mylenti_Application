
import Navigate from "./navigate"
import CheckEmail from "./check-email"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useForgetPassword } from "@/components/containers/form.useForgetPassword"

export function ForgetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, isSucess } = useForgetPassword()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          {isSucess ? <CheckEmail /> :
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
                    name='email'
                    children={(field) => 
                      <field.TextField
                        type='email'
                        placeholder='Email...'
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
              <Navigate />
            </div>
          </form>
          }
        </CardContent>
      </Card>
    </div>
  )
}
