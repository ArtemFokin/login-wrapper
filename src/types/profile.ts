export enum ProfileProviders {
  Email = "Email",
  Google = "Google",
}

export enum ProfileWalletType {
  Web3Auth = 0,
  LegacyNbWallet = 1,
  Metamask = 2,
}

export type ProfileWallet = {
  type: ProfileWalletType;
  walletAddress: string;
  isMain: boolean;
};

export type Profile = {
  email: string;
  isTempPassword: boolean;
  providers: ProfileProviders[];
  wallets: ProfileWallet[];
};

export type Tokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
};
