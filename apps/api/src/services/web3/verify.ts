import { verifyMessage } from "ethers";

export const verifyWalletSignature = (message: string, signature: string, address: string) => {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Wallet signature verification failed", error);
    return false;
  }
};
