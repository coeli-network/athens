import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { ProviderInterface } from "@coinbase/wallet-sdk/dist/core/provider/interface";

let SUPPORTED_CHAINS = [
  // 1,     // Ethereum Mainnet
  // 8453,  // Base Mainnet
  84532, // Base Sepolia
];

let sdk: CoinbaseWalletSDK;
let coinbaseWallet: ProviderInterface;

// client-side only
if (typeof window !== "undefined") {
  sdk = new CoinbaseWalletSDK({
    appName: "Athens",
    appLogoUrl:
      "https://bwyl.nyc3.digitaloceanspaces.com/radio/chat_images/athens.gif",
    appChainIds: SUPPORTED_CHAINS,
  });

  coinbaseWallet = sdk.makeWeb3Provider();
}

export { sdk, coinbaseWallet };
