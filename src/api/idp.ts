import { IDP_CLIENT, IDP_CLIENT_SECRET, IDP_URL, loginResponsePath } from "../constants";

type FetchTokensResponse = {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
};

export const fetchTokens = async (
  code: string
): Promise<FetchTokensResponse> => {
  const body = {
    client_id: IDP_CLIENT,
    client_secret: IDP_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: window.location.origin.replace(/\/$/, "") + loginResponsePath,
    scope: "openid profile offline_access",
    code,
  };
  const response = await fetch(`${IDP_URL}/connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;",
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response.json();
};
