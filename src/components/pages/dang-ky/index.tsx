
import Navigate from "./navigate"
import CheckEmail from "./check-email"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import useLogUpForm from "@/components/containers/form.useLogUp"

export function LogupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {form, isSuccess} = useLogUpForm()

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {
        isSuccess ? <CheckEmail /> :
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
                      name='full_name'
                      children={(field) => 
                        <field.TextField
                          type="text"
                          placeholder='Ha Van Ten...'
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
                          type="text"
                          placeholder='@example...'
                          showBug
                        />
                      }
                    />
                  </div>
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
                  <div className="grid gap-3">
                    <form.AppField
                      name="password"
                      children={(field) => 
                        <field.TextField
                          type='password'
                          placeholder="Mật khẩu..."
                          showBug
                        />
                      }
                    />
                  </div>
                  <form.AppForm>
                    <form.ButtonSubmit>
                      Đăng ký
                    </form.ButtonSubmit>
                  </form.AppForm>
                </div>
                <Navigate />
              </div>
            </form>
          </CardContent>
        </Card>
      }
    </div>
  )
}
