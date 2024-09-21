import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

let sdk: CoinbaseWalletSDK | null = null;
let coinbaseWallet: any = null;

// client-side only
if (typeof window !== "undefined") {
  sdk = new CoinbaseWalletSDK({
    appName: "Athens",
    appLogoUrl:
      "https://bwyl.nyc3.digitaloceanspaces.com/radio/chat_images/athens.gif",
    appChainIds: [84532], // Base Sepolia chain ID
  });

  coinbaseWallet = sdk.makeWeb3Provider();
}

export { sdk, coinbaseWallet };
