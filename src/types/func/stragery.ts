import type { VerifiedTypeVariantProps } from "./returntype";
import type { OBSOverlayChatLabelPropsType } from "../store/obs-overlay";
import type { BankDataType, DonateDataType, ProfileDataType } from "@/types/hooks/returnType";
import type { Provider } from "@supabase/supabase-js";
import type { LoaderFnContext } from "@tanstack/react-router";
import type { JSX } from "react";

export type UploadStrategyProps = {
  get: (from: string, files: Array<File>) => FormData;
  send: (formData: FormData) => Promise<Response>
  validate: (response: Response) => Promise<any>
  check: (response: Response, result: any) => void
}

export type LoaderPropsStrategy = {
  getUserData: (profileID: string, ctx: LoaderFnContext['context']) => Promise<ProfileDataType>;
  getDonateList: (profileID: string, ctx: LoaderFnContext['context']) => Promise<Array<DonateDataType>>;
  getBanksData: (profileID: string, ctx: LoaderFnContext['context']) => Promise<BankDataType>;
};

export type loginWthOauthPropsStrategy = {
  sessionFailed: (provider: Provider) => void
  popupFailed: () => void
};


export type ChatTypeStrategyType = Record<
  OBSOverlayChatLabelPropsType, 
  (() => JSX.Element) | null
>

export type VerifiedIconStrategyKeyType = Exclude<VerifiedTypeVariantProps[keyof VerifiedTypeVariantProps], null | undefined>
export type VerifiedIconStrategyType = Record<VerifiedIconStrategyKeyType, () => JSX.Element>