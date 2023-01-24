export enum IDP_ERROR {
  "NotFound" = "NotFound",
}

export enum RESPONSE_IFRAME_TYPES {
  RESPONSE = "RESPONSE",
}

export type ResponseIframeResponseData = {
  type: RESPONSE_IFRAME_TYPES.RESPONSE;
  message: {
    code?: string;
    error?: IDP_ERROR;
    email?: string;
  };
};

export type ResponseIframeData = ResponseIframeResponseData;

export type ResponseIframeEvent = Omit<MessageEvent, "data"> & {
  data: ResponseIframeData;
};

export const isLoginResponseIframeEvent = (
  event: MessageEvent
): event is ResponseIframeEvent => {
  return (
    event.origin === window.location.origin &&
    Object.keys(RESPONSE_IFRAME_TYPES).includes(event.data?.type)
  );
};
