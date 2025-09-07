import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import useLogOut from "./useLogOut";
import type { NavigationHrefType } from "@/types/data/header";
import useAuthInfo from "@/hooks/useAuthInfo";
import { HeaderProps, HeaderStrategy } from "@/store/header-store";

function useHeaderSync() {
  const router = useRouter()
  const currentPath = router.state.location.pathname as NavigationHrefType
  const setCurrentPath = useStore(HeaderStrategy, (s) => s.setCurrentPath)

  useEffect(() => {
    setCurrentPath(currentPath)
  }, [currentPath])
}

export default function useHeader() {
  const authInfo = useAuthInfo()
  const { handleLogOut } = useLogOut()
  
  const finalProps = useMemo(() => ({ ...authInfo, handleLogOut }), [])
  HeaderProps.setState(finalProps)


  useHeaderSync()
}