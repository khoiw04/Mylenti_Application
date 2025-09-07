import { useAuthenticatedUser } from "@/lib/queries";

export default function useAuthInfo() {
  const {
    isAuthenticated,
    user: {
      email,
      meta: { display_name, full_name, display_avatar, avatar_url: fallback_avatar, user_name: currentUser, facebook, x, youtube },
    },
  } = useAuthenticatedUser().data;

  const socialInfo = { facebook, x, youtube }

  return {
    isAuthenticated,
    email,
    currentUser,
    display_name: display_name ?? full_name,
    display_avatar: display_avatar ?? fallback_avatar ?? '',
    socialInfo
  };
}