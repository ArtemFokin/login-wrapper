import { useSearchParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef } from "react";
import { IDP_URL } from "../constants";
import { PARENT_MESSAGE_TYPE, sendMessageToParent } from "../api/parentWindow";

const LogoutPage = () => {
  const isMountedRef = useRef(false);
  const [searchParams] = useSearchParams();
  const openId = searchParams.get("openId");
  const { hash } = useLocation();

  const onSuccessLogout = useCallback(() => {
    sendMessageToParent(PARENT_MESSAGE_TYPE.LOGOUT_SUCCESS);
    window.close();
  }, []);

  const onRejectedLogout = useCallback((message: string) => {
    sendMessageToParent(PARENT_MESSAGE_TYPE.LOGOUT_REJECTED);
    window.close();
  }, []);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    if (!openId) {
      //TODO refactor
      // console.log("OpenId not found in url");
      // onRejectedLogout("OpenId not found");
      onSuccessLogout();
      return;
    }

    const queryString = new URLSearchParams({
      id_token_hint: openId,
      post_logout_redirect_uri:
        window.location.origin.replace(/\/$/, "") + "/logout",
    }).toString();

    const redirect_uri = `${IDP_URL}/connect/endsessionwithredirect?${queryString}`;
    window.location.href = redirect_uri;
  }, [openId, hash, onSuccessLogout, onRejectedLogout]);
  return null
};

export default LogoutPage;
