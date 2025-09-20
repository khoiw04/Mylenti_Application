import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import useCommunityProfileForm from "@/components/containers/form.useCommunityProfile"
import { AvatarProfile } from "@/components/presenters/user"

export function ProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, avatar } = useCommunityProfileForm()

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
              <AvatarProfile url={avatar} />
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
                <div className="w-full flex flex-row flex-wrap gap-2 relative">
                  <form.AppForm>
                    <form.ButtonSubmit className="w-full">
                      Cập nhật
                    </form.ButtonSubmit>
                  </form.AppForm>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
