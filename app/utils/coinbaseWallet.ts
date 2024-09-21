import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

let sdk: CoinbaseWalletSDK | null = null;
let coinbaseWallet: any = null;

if (typeof window !== "undefined") {
  sdk = new CoinbaseWalletSDK({
    appName: "Athens",
    appLogoUrl: "https://example.com/logo.png", // Replace with your app's logo URL
    appChainIds: [84532], // Base Sepolia chain ID
  });

  coinbaseWallet = sdk.makeWeb3Provider();
}

export { sdk, coinbaseWallet };
