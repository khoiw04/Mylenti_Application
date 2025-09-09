import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import useLogOut from "./useLogOut";
import type { NavigationHrefType } from "@/types/data/header";
import { HeaderStrategy } from "@/store/header-store";
import useAuthInfo from "@/hooks/useAuthInfo";

function useHeaderSync() {
  const router = useRouter()
  const currentPath = router.state.location.pathname as NavigationHrefType
  const { setCurrentPath } = useStore(HeaderStrategy)

  useEffect(() => {
    setCurrentPath(currentPath)
  }, [currentPath])
}

export default function useHeader() {
  useAuthInfo()
  const { handleLogOut } = useLogOut()
  
  const finalProps = useMemo(() => ({ handleLogOut }), [])
  HeaderStrategy.setState((prev) => ({...prev, finalProps}))

  useHeaderSync()
}