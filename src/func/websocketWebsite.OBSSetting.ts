  import type { OBSSetting } from "@/types";
  import { OBSOverlaySettingsWebsiteStore } from "@/store";

  export default function WebSocketOBSSetting(
      data: OBSSetting['data']
  ) {
      const current = OBSOverlaySettingsWebsiteStore.state;

      const mergedDonateProps = {
        ...data.DonateProps,
        soundURL: Array.isArray(data.DonateProps.soundURL)
          ? data.DonateProps.soundURL
          : current.DonateProps.soundURL,
        emojiURL: Array.isArray(data.DonateProps.emojiURL)
          ? data.DonateProps.emojiURL
          : current.DonateProps.emojiURL
      };

      OBSOverlaySettingsWebsiteStore.setState({
        ...data,
        DonateProps: mergedDonateProps,
      })

      console.log(OBSOverlaySettingsWebsiteStore)
  }