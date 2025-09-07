import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './useFormContext'
import { ButtonSubmit, ComboBox, TextField } from '@/components/presenters/form'

export const { useAppForm } = createFormHook({
  fieldComponents: {TextField, ComboBox},
  formComponents: {ButtonSubmit},
  fieldContext,
  formContext,
})
