import type { DonateEventSchemaType } from "@/types"

export const DiscordDonationsFallBack: Array<DonateEventSchemaType> = [
  {
    code: "",
    email: null,
    display_name: "",
    display_avatar: "",
    user_name: "",
    message: "",
    receiver: "",
    id_transaction: 0,
    gateway: "",
    transaction_date: "",
    account_number: "",
    content: "",
    transfer_type: "in",
    transfer_amount: 0,
    accumulated: 0,
    sub_account: "",
    reference_code: "",
    description: "",
    notified: false,
    status: "pending",
    created_at: ""
  }
]

export const initialDonateFiles = [
  {
    id: 'omori',
    size: 3232,
    name: "OMORI",
    type: "image/*",
    url: "/assets/images/emoji/woven_spaces.webp",
  },
]

export const fallbackEmoji = [{
  name: 'OMORI',
  path: initialDonateFiles[0].url,
  preview: initialDonateFiles[0].url,
  type: 'image/jpeg',
  size: 3434,
  binary: new Uint8Array(10)
}];

export const fallbackSound = [{
  name: 'OMORI',
  path: initialDonateFiles[0].url,
  preview: initialDonateFiles[0].url,
  type: 'image/jpeg',
  size: 3434,
  binary: new Uint8Array(10)
}];