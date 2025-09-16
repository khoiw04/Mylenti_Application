import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import useLogOut from "./db.useLogOut";
import type { NavigationHrefType } from "@/types";
import { HeaderStrategy } from "@/store";
import useAuthInfo from "@/hooks/useAuthInfo";

function useHeaderLinkSync() {
  const router = useRouter()
  const { setCurrentPath } = useStore(HeaderStrategy)
  const currentPath = router.state.location.pathname as NavigationHrefType
  
  useEffect(() => {
    setCurrentPath(currentPath)
  }, [currentPath])
}

function useHeaderLogOut() {
  const { handleLogOut } = useLogOut()
  
  const finalProps = useMemo(() => ({ handleLogOut }), [])
  HeaderStrategy.setState((prev) => ({...prev, finalProps}))
}

export default function useHeader() {
  // Auth
  useAuthInfo()
  useHeaderLogOut()
  useHeaderLinkSync()
}