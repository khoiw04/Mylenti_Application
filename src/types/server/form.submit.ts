import type { updateUserNameSchemaType, updateUserSchemaType } from "../schema"
import type { useResetMutationType } from "../hooks/returnType"

export type handleResetProps = {
  croppedImage: string | null | undefined
  value: updateUserNameSchemaType
  mutation: useResetMutationType
}

export type handleSettingProps = {
  croppedImage: string | null | undefined
  // mutation: useSettingMutationType
  value: updateUserSchemaType
  currentUser: string
}