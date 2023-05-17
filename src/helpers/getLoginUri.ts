import { IDP_CLIENT, IDP_URL, loginResponsePath } from "../constants";

export const getLoginUri = () => {
  //TODO restrict creation only for specific domains
  const winSearchParams = new URLSearchParams(window.location.search);
  const createAllowed = winSearchParams.get("create") === "true";

  const queryString = new URLSearchParams({
    client_id: IDP_CLIENT,
    redirect_uri: window.location.origin.replace(/\/$/, "") + loginResponsePath,
    response_type: "code",
    scope: `openid profile offline_access ${
      createAllowed ? "createAllowed" : ""
    }`,
    nonce: new Date().getTime().toString(),
  }).toString();

  return `${IDP_URL}/connect/authorize?${queryString}`;
};
