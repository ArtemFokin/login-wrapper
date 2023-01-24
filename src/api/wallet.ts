import { WALLET_API } from "../constants";
import { Profile } from "../types/profile";

export const getProfile = async (accessToken: string): Promise<Profile> => {
  const response = await fetch(`${WALLET_API}/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response.json();
};
