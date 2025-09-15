export const defaultVariants = { currentPreset: "default" }
export const presetUserVariants = ['Mori Seikai', 'Siini', 'default'] as const
export const overlayFieldConfigs = [
  { key: 'commenter_avatar', label: 'Avatar' },
  { key: 'commenter_name', label: 'Tên' }
] as const;

export const commenter_name_test = 'Test'
export const commentParagraphTest = 'Lorem ipsum dolor sit amet consectetur.'
export const commentParagraphSuperchatTest = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil porro rem asperiores repellendus architecto aspernatur quas blanditiis vitae reprehenderit magni!'

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