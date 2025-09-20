import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import useCommunityBankForm from "@/components/containers/form.useCommunityBank"
import { AvatarProfile } from "@/components/presenters/user"
import { BankDisplayInfo } from "@/data/bank"

export function BankForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const { form, meta } = useCommunityBankForm()

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
                        <AvatarProfile url={meta.avatar} />
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <form.AppField
                                    name='api_key'
                                    children={(field) => 
                                    <field.TextField
                                        type='text'
                                        placeholder="API KEY"
                                    />
                                    }
                                />
                            </div>
                            <div className="grid gap-3">
                                <form.AppField
                                    name='number'
                                    children={(field) => 
                                    <field.TextField
                                        type='text'
                                        placeholder="Số Tài Khoản"
                                    />
                                    }
                                />
                            </div>
                            <div className="grid gap-3">
                                <form.AppField
                                    name='full_name'
                                    children={(field) => 
                                    <field.TextField
                                        type='text'
                                        placeholder='Tên Tài Khoản'
                                    />
                                    }
                                />
                            </div>
                            <div className="grid gap-3">
                                <form.AppField
                                    name='bank'
                                    children={(field) => 
                                    <field.ComboBox
                                        checkboxData={BankDisplayInfo.map(b => b.name)}
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
