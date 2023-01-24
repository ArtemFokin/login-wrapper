export enum PARENT_MESSAGE_TYPE {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_REJECTED = "LOGIN_REJECTED",
  ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
  LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
  LOGOUT_REJECTED = "LOGOUT_REJECTED",
  READY = "READY",
  SIZE_UPDATE = "SIZE_UPDATE",
  ACTIVE_SCREEN_UPDATE = "ACTIVE_SCREEN_UPDATE",
  LOGIN_FORM_CLOSED = "LOGIN_FORM_CLOSED",
}

export const sendMessageToParent = (
  type: PARENT_MESSAGE_TYPE,
  message?: any
) => {
  window.parent.postMessage(
    {
      type,
      message,
    },
    "*"
  );
};
