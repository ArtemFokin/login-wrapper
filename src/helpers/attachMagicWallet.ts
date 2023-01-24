import { magicClient, WALLET_API } from "../constants";
import EthereumRpc from "../helpers/ethersRpc";
import { ProfileWallet, ProfileWalletType } from "../types/profile";

type VerificationManifest = {
  walletAddress: string;
  nonce: string;
};

const requestManifestToSign = async (
  accessToken: string,
  walletAddress: string
): Promise<VerificationManifest> => {
  const response = await fetch(
    `${WALLET_API}/profile/walletRequestVerificationManifest`,
    {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        type: ProfileWalletType.Web3Auth,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response.json();
};

const verifyManifest = async (
  accessToken: string,
  walletAddress: string,
  signature: string
): Promise<ProfileWallet> => {
  const response = await fetch(
    `${WALLET_API}/profile/walletRequestVerification`,
    {
      method: "POST",
      body: JSON.stringify({
        walletAddress,
        signature,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response.json();
};

export const attachMagicWallet = async (accessToken: string) => {
  const isLoggedIn = await magicClient.user.isLoggedIn();

  if (!isLoggedIn) {
    throw new Error("Wallet not logged in");
  }

  const provider = new EthereumRpc(magicClient.rpcProvider);

  const walletAddress = await provider.getAccount();

  const manifest = await requestManifestToSign(accessToken, walletAddress);

  const signature = await provider.signMessage(manifest.nonce);

  return await verifyManifest(accessToken, walletAddress, signature);
};
