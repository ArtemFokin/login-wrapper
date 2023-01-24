import { OpenIdExtension } from "@magic-ext/oidc";
import { Magic } from "magic-sdk";

export const MAGIC_API_KEY = "pk_live_A9B073AE1E178C41";
export const MAGIC_PROVIDER_ID = "YyvLNmR2W9GPlfW-Lam6_aYAGMUyOdwccjauq1pxdy0=";
export const WALLET_API = "https://ncwallet-api-dev.niftybridge.io";
export const IDP_URL = "https://identity-dev.niftybridge.io";
export const IDP_CLIENT = "NiftyBridgeWalletDev";
export const IDP_CLIENT_SECRET = "511536EF-F270-4058-80CA-1C89C192F691";
export const LOGIN_URL = "https://login.identity-dev.niftybridge.io";

export const magicClient = new Magic(MAGIC_API_KEY, {
  extensions: [new OpenIdExtension()],
});
