import { createServerFn } from '@tanstack/react-start'
import type { SupabaseType } from '@/lib/supabase';
import type { updateUserNameSchemaType } from '@/types';
import { getSupabaseServerClient } from '@/lib/supabase'

async function checkUserName(supabase: SupabaseType, user_name: string, requireUserName: boolean) {
    if (requireUserName) {
      const { data: existingUser, error: checkError } = await supabase
        .from('user_index')
        .select('id')
        .eq('user_name', user_name)
        .maybeSingle();
  
      if (checkError) {
        throw new Error("Không thể kiểm tra username");
      }
  
      if (existingUser) {
        throw new Error("Tên người dùng đã tồn tại");
      }
    }
}

export const updateUser = createServerFn()
  .validator((d: updateUserNameSchemaType) => d)
  .handler(async ({ data: { full_name, user_name, youtube, image, facebook, x, requireUserName } }) => {
    const supabase = getSupabaseServerClient()
    await checkUserName(supabase, user_name, requireUserName)

    const updateData: Record<string, any> = {
      name: full_name,
      full_name: full_name,
      avatar_url: image,
      x: x,
      youtube: youtube,
      facebook: facebook,
      display_name: full_name,
      display_avatar: image,
    };

    if (requireUserName) {
      updateData.user_name = user_name;
    }

    const { error } = await supabase.auth.updateUser({
      data: updateData,
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }

    return { success: true }
})