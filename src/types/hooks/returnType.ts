import type useResetForm from "@/components/containers/form.useReset";
import type { useResetMutation } from "@/components/containers/mutation.useReset";
import type useAuthInfo from "@/hooks/useAuthInfo";
import type useLogOut from "@/components/containers/useLogOut";
import type { getProfile } from "@/func/auth.Profile";
import type { getBank, getDonate } from "@/func/auth.Info";
import type useBankForm from "@/components/containers/form.useBank";
import type { useRankDonates } from "@/components/containers/useDonate";

export type useResetMutationType = ReturnType<typeof useResetMutation>
export type useResetFormType = ReturnType<typeof useResetForm>
export type useAuthInfoType = ReturnType<typeof useAuthInfo>
export type ProfileDataType = ReturnType<typeof getProfile>
export type DonateDataType = Awaited<ReturnType<typeof getDonate>>[number]
export type BankDataType = Awaited<ReturnType<typeof getBank>>
export type useLogOutType = ReturnType<typeof useLogOut>
export type useBankFormType = ReturnType<typeof useBankForm>
export type useRankDonatesType = ReturnType<typeof useRankDonates>