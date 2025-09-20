import type useResetForm from "@/components/containers/form.useReset";
import type { useResetMutation } from "@/components/containers/mutation.useReset";
import type useAuthInfo from "@/hooks/useAuthSupabaseInfo";
import type useLogOut from "@/components/containers/db.useLogOut";
import type { getProfile } from "@/func/db.SupabaseProfile";
import type { getBankDatabase, getDonateDatabase } from "@/func/db.SupabaseInfo";
import type useBankForm from "@/components/containers/form.useBank";
import type { useRankDonates } from "@/components/containers/page.useDonate";

export type useResetMutationType = ReturnType<typeof useResetMutation>
export type useResetFormType = ReturnType<typeof useResetForm>
export type useAuthInfoType = ReturnType<typeof useAuthInfo>
export type ProfileDataType = ReturnType<typeof getProfile>
export type DonateDataType = NonNullable<Awaited<ReturnType<typeof getDonateDatabase>>>[number]
export type BankDataType = Awaited<ReturnType<typeof getBankDatabase>>
export type useLogOutType = ReturnType<typeof useLogOut>
export type useBankFormType = ReturnType<typeof useBankForm>
export type useRankDonatesType = ReturnType<typeof useRankDonates>