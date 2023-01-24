import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTokens } from "../api/idp";
import { PARENT_MESSAGE_TYPE, sendMessageToParent } from "../api/parentWindow";
import { getProfile } from "../api/wallet";
import { getLoginUri } from "../helpers/getLoginUri";
import { Tokens, Profile, ProfileWalletType } from "../types/profile";
import {
  isLoginIframeEvent,
  LoginIframeEvent,
  LOGIN_IFRAME_TYPES,
  Size,
} from "../types/loginIframe";
import {
  IDP_ERROR,
  isLoginResponseIframeEvent,
  ResponseIframeEvent,
  ResponseIframeResponseData,
  RESPONSE_IFRAME_TYPES,
} from "../types/responseIframe";
import { magicClient, MAGIC_PROVIDER_ID } from "../constants";
import { attachMagicWallet } from "../helpers/attachMagicWallet";
import styles from "./login.module.css";
import Spinner from "../components/Spinner/Spinner";
import { useSize } from "ahooks";
import loadingGif from "../assets/loading.gif";

const LoginPage = () => {
  const [isCreatingNCWallet, setIsCreatingNCWallet] = useState(false);
  const [iframeExists, setIframeExists] = useState(true);
  const [iframeVisible, setIframeVisible] = useState(false);
  const iframeContainerRef = useRef(null);
  const iframeContainerSize = useSize(iframeContainerRef);

  const loginUri = useMemo(getLoginUri, []);

  const onResponseError = async ({
    error,
    email,
  }: {
    error: string;
    email?: string;
  }) => {
    if (error === IDP_ERROR.NotFound) {
      if (email) {
        sendMessageToParent(PARENT_MESSAGE_TYPE.ACCOUNT_NOT_FOUND, {
          email: decodeURI(email),
        });
      } else {
        sendMessageToParent(
          PARENT_MESSAGE_TYPE.LOGIN_REJECTED,
          "Email not found in response"
        );
      }
    }
  };

  const onLoginFinish = (profile: Profile, tokens: Tokens) => {
    sendMessageToParent(PARENT_MESSAGE_TYPE.LOGIN_SUCCESS, {
      ...tokens,
      profile,
    });
    return;
    // if (isSameOrigin()) {
    //   sendSuccessMessageToParent(tokens);
    // } else {
    //   sendSuccessMessageToParent(profile);
    // }
  };

  const createMagicWalletAccount = async ({ accessToken, idToken }: Tokens) => {
    const profile = await getProfile(accessToken);

    const mwAccountExists = profile?.wallets.some(
      ({ type }) => type === ProfileWalletType.Web3Auth
    );

    if (mwAccountExists) {
      return profile;
    }
    setIsCreatingNCWallet(true);

    await magicClient.openid.loginWithOIDC({
      jwt: idToken,
      providerId: MAGIC_PROVIDER_ID,
    });

    const magicWallet = await attachMagicWallet(accessToken);

    const extendedProfile: Profile = {
      ...profile,
      wallets: [...(profile.wallets || []), magicWallet],
    };

    return extendedProfile;
  };

  const onResponseWithCode = async (code: string) => {
    const tokens = await fetchTokens(code);
    const profile = await createMagicWalletAccount({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
    });
    onLoginFinish(profile, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
    });
  };

  const onLoginResponse = async ({
    error,
    code,
    email,
  }: ResponseIframeResponseData["message"]) => {
    sendMessageToParent(PARENT_MESSAGE_TYPE.LOGIN_FORM_CLOSED);
    try {
      if (error) {
        await onResponseError({ error, email });
      } else if (code) {
        await onResponseWithCode(code);
      } else {
        throw new Error("Code not found");
      }
    } catch (err: any) {
      sendMessageToParent(PARENT_MESSAGE_TYPE.LOGIN_REJECTED, "Login failed");
      console.error(err.message);
    }
  };

  const handleResponseEvent = (event: ResponseIframeEvent) => {
    setIframeExists(false);
    const { data } = event;
    const { message, type } = data;

    switch (type) {
      case RESPONSE_IFRAME_TYPES.RESPONSE:
        onLoginResponse(message);
        break;
      default:
        console.error(`Event type ${type} not found`);
    }
  };

  const onLoginIframeReady = (isReady: boolean) => {
    console.log("Login Ready", isReady);
    setIframeVisible(true);
    sendMessageToParent(PARENT_MESSAGE_TYPE.READY);
  };

  const onLoginIframeSizeUpdate = (size: Size) => {
    sendMessageToParent(PARENT_MESSAGE_TYPE.SIZE_UPDATE, size);
  };

  const onLoginIframeActiveScreenUpdate = (activeScreen: string) => {
    sendMessageToParent(PARENT_MESSAGE_TYPE.ACTIVE_SCREEN_UPDATE, activeScreen);
  };

  const handleLoginIframeEvents = (event: LoginIframeEvent) => {
    const { data } = event;
    const { message, type } = data;

    switch (type) {
      case LOGIN_IFRAME_TYPES.READY:
        onLoginIframeReady(message);
        break;
      case LOGIN_IFRAME_TYPES.SIZE_UPDATE:
        onLoginIframeSizeUpdate(message);
        break;
      case LOGIN_IFRAME_TYPES.ACTIVE_SCREEN_UPDATE:
        onLoginIframeActiveScreenUpdate(message);
        break;
      default:
        console.error(`Event type ${type} not found`);
    }
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (isLoginResponseIframeEvent(event)) {
        handleResponseEvent(event);
      } else if (isLoginIframeEvent(event)) {
        handleLoginIframeEvents(event);
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [handleResponseEvent]);

  return (
    <div className={styles.container} ref={iframeContainerRef}>
      {iframeExists && iframeContainerSize && (
        <iframe
          title="login"
          src={loginUri}
          width={iframeContainerSize.width}
          height={iframeContainerSize.height}
          // height={iframeContainerSize?.height || 100}
          style={{ border: "none" }}
          className={!iframeVisible ? styles.hidden : ""}
        />
      )}
      {(!iframeVisible || !iframeExists) && (
        <div className={styles.centerBox}>
          <div className={styles.loadingBox}>
            {isCreatingNCWallet && (
              <p>
                Please wait a moment, we're creating <br />
                something special for you
              </p>
            )}
            <img src={loadingGif} width={100} height={100} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
