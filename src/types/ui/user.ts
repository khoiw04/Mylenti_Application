export type UserProps = { name: string, user: string, x: string, youtube: string, facebook: string, children?: React.ReactNode, isOwner: boolean | undefined, avatar_url?: string }
export type SocialProps = { x: string | null, youtube: string | null, facebook: string | null }
export type AvatarProps = { url?: string | null | undefined }