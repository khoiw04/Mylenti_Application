import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import useLogOut from "./db.useLogOut";
import useReceiveWebSocket from "./db.useReceiveWebSocketOBS";
import { useOBSOverlaySync } from "./db.useOBSOverlaySync";
import type { NavigationHrefType } from "@/types";
import { HeaderStrategy } from "@/store";
import useAuthInfo from "@/hooks/useAuthInfo";
import useListenSepayAlert from "@/components/containers/db.ListenSepayAlert";
import useRustOBSSettingSync, { initOBSOverlaySettings } from "@/hooks/useRustOBSSettingsSync";

function useHeaderSync() {
  const router = useRouter()
  const currentPath = router.state.location.pathname as NavigationHrefType
  const { setCurrentPath } = useStore(HeaderStrategy)

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
  useAuthInfo()
  useHeaderSync()
  useHeaderLogOut()
  useOBSOverlaySync()
  useListenSepayAlert()
  useReceiveWebSocket()
  initOBSOverlaySettings()
  useRustOBSSettingSync()
}