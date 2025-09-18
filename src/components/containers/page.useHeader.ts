import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@tanstack/react-store";
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

export default function useHeader() {
  useAuthInfo()
  useHeaderLinkSync()
}