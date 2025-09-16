import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useStore } from "@tanstack/react-store";
import useLogOut from "./db.useLogOut";
import useReceiveWebSocket from "./db.useReceiveWebSocketOBS";
import useWebsocketOBSOverlaySend from "./db.useWebsocketOBSOverlaySend";
import type { NavigationHrefType } from "@/types";
import { HeaderStrategy } from "@/store";
import useAuthInfo from "@/hooks/useAuthInfo";
import useWebSocketSepayAlertSend from "@/components/containers/db.useWebSocketSepayAlertSend";
import useRustOBSSettingSync, { useInitOBSOverlaySettings } from "@/hooks/useRustOBSSettingsSync";

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

  // Websocket - INIT
  useRustOBSSettingSync()
  useInitOBSOverlaySettings()
  
  // Websocket - SEND
  useWebSocketSepayAlertSend()
  useWebsocketOBSOverlaySend()

  // Websocket - RECEIVE
  useReceiveWebSocket()
}