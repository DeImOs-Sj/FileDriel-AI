import axios from "axios";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

const signAuthMessage = async (
  privateKey: string,
  verificationMessage: string
) => {
  const signer = new ethers.Wallet(privateKey);
  const signedMessage = await signer.signMessage(verificationMessage);
  return signedMessage;
};

export const getApiKey = async (): Promise<string | null> => {
  try {
    const wallet = {
      publicKey: process.env.NEXT_PUBLIC_YOUR_PUBLIC_KEY as string,
      privateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY as string,
    };
    console.log(wallet);
    const verificationMessageResponse = await axios.get(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${wallet.publicKey}`
    );

    const verificationMessage = verificationMessageResponse.data;
    const signedMessage = await signAuthMessage(
      wallet.privateKey,
      verificationMessage
    );

    const response = await lighthouse.getApiKey(
      wallet.publicKey,
      signedMessage
    );
    return response.data.apiKey;
  } catch (error) {
    console.error("Error getting API key:", error);
    return null;
  }
};
