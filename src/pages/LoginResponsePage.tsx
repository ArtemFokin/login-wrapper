import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  IDP_ERROR,
  ResponseIframeData,
  RESPONSE_IFRAME_TYPES,
} from "../types/responseIframe";

const LoginResponsePage = () => {
  const [searchParams] = useSearchParams();
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    const message: ResponseIframeData = {
      type: RESPONSE_IFRAME_TYPES.RESPONSE,
      message: {
        code: searchParams.get("code") || "",
        error: (searchParams.get("error") as IDP_ERROR) || "",
        email: searchParams.get("email") || "",
      },
    };
    window.parent.postMessage(message, window.location.origin);
  }, [searchParams]);

  return null;
};

export default LoginResponsePage;
