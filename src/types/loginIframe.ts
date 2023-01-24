import { LOGIN_URL } from "../constants";

export enum LOGIN_IFRAME_TYPES {
  READY = "READY",
  SIZE_UPDATE = "SIZE_UPDATE",
  ACTIVE_SCREEN_UPDATE = "ACTIVE_SCREEN_UPDATE",
}

export type Size = {
  width: string;
  height: string;
};

export type LoginIframeSizeUpdate = {
  type: LOGIN_IFRAME_TYPES.SIZE_UPDATE;
  message: Size;
};

export type LoginIframeReady = {
  type: LOGIN_IFRAME_TYPES.READY;
  message: boolean;
};

export type LoginIframeActiveScreenUpdate = {
  type: LOGIN_IFRAME_TYPES.ACTIVE_SCREEN_UPDATE;
  message: string;
};

export type LoginIframeEventData =
  | LoginIframeSizeUpdate
  | LoginIframeReady
  | LoginIframeActiveScreenUpdate;

export type LoginIframeEvent = Omit<MessageEvent, "data"> & {
  data: LoginIframeEventData;
};

export const isLoginIframeEvent = (
  event: MessageEvent
): event is LoginIframeEvent => {
  return (
    event.origin === LOGIN_URL &&
    Object.keys(LOGIN_IFRAME_TYPES).includes(event.data?.type)
  );
};
