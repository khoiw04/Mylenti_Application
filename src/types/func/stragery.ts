import type { ChatTypeType } from "@/types/ui/chattype";
import type { OBSSuperchatChatKey } from "@/types/ui/obs-overlay-setting";
import type { presetUserVariantsValueType } from "@/types/data/obs-overlay";
import type { OBSOverlayChatKeyPropsType } from "@/types/store/obs-overlay";
import type { BankDataType, DonateDataType, ProfileDataType, WebSocketMessageType } from "@/types";
import type { Provider } from "@supabase/supabase-js";
import type { LoaderFnContext } from "@tanstack/react-router";
import type { JSX } from "react";
import type { websocketSendType } from "@/data/settings";

export type UploadStrategyProps = {
  get: (from: string, files: Array<File>) => FormData;
  send: (formData: FormData) => Promise<Response>
  validate: (response: Response) => Promise<any>
  check: (response: Response, result: any) => void
}

export type LoaderPropsStrategy = {
  getUserData: (profileID: string, ctx: LoaderFnContext['context']) => Promise<ProfileDataType | null>;
  getDonateDatabaseList: (profileID: string, ctx: LoaderFnContext['context']) => Promise<Array<DonateDataType> | null>;
  getBanksData: (profileID: string, ctx: LoaderFnContext['context']) => Promise<BankDataType | null>;
};

export type loginWthOauthPropsStrategy = {
  sessionFailed: (provider: Provider) => void
  popupFailed: () => void
};


export type ChatTypeStrategyType = Record<
  OBSOverlayChatKeyPropsType | 'Donate', 
  ((props: ChatTypeType) => JSX.Element) | null
>

export type VerifiedIconStrategyType = Record<
  presetUserVariantsValueType, 
  (({ srcAvatar }: {  srcAvatar: string }) => JSX.Element) | null
>

export type ModeratorIconStrategyType = Record<
  presetUserVariantsValueType, 
  (({ srcAvatar }: {  srcAvatar: string }) => JSX.Element) | null
>

export type MemberIconStrategyType = Record<
  presetUserVariantsValueType, 
  (({ srcAvatar, srcTypeMember }: { srcAvatar: string, srcTypeMember?: string }) => JSX.Element) | null
>

export type SuperchatIconStrategyType = Record<
  Exclude<OBSSuperchatChatKey, 'Normal'>,
  MemberIconStrategyType | ModeratorIconStrategyType | VerifiedIconStrategyType
>

export type DonateMessage = Extract<WebSocketMessageType, { type: typeof websocketSendType.DonateTranscation }>
export type YouTubeMessage = Extract<WebSocketMessageType, { type: typeof websocketSendType.YouTubeMessage }>
export type OBSSetting = Extract<WebSocketMessageType, { type: typeof websocketSendType.OBSSetting }>

export type WebSocketHandlerStrategyType = {
  [K in WebSocketMessageType['type']]: (data: Extract<WebSocketMessageType, { type: K }>['data']) => void;
};