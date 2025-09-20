import { createServerFn } from "@tanstack/react-start"
import type { bankSchemaType } from "@/types"
import { getSupabaseServerClient } from "@/lib/supabaseServer"

export const handleSupabaseBanks = createServerFn()
  .validator((d: bankSchemaType) => d)
  .handler(async ({ data: { full_name, api_key, user_name, email, bank, number } }) => {
    const supabase = getSupabaseServerClient()
    const { data: { user }, error: errorUser }  = await supabase.auth.getUser()

    if (errorUser) { throw new Error(errorUser.message, { cause: errorUser.cause ?? 500 }) }
    if (!user) { throw new Error('Không thấy UUID của người dùng') }

    const { error } = await supabase
      .from('bank_accounts')
      .upsert({
        id: user.id,
        full_name,
        user_name,
        api_key,
        number,
        email,
        bank,
      })

    if (error) { throw new Error(error.message, { cause: error.cause ?? 500 }) }

    return { success: true }
})