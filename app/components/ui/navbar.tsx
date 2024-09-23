import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { coinbaseWallet } from "~/utils/coinbaseWallet";

export function Navbar() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!coinbaseWallet) return;

    const checkConnection = async () => {
      try {
        const accounts = (await coinbaseWallet.request({
          method: "eth_accounts",
        })) as string[];
        setAddress(accounts[0] || null);
      } catch (error) {
        console.error("Failed to get accounts", error);
      }
    };

    checkConnection();
    coinbaseWallet.on("accountsChanged", (accounts: string[]) => {
      setAddress(accounts[0] || null);
    });

    return () => {
      coinbaseWallet.removeListener("accountsChanged", () => {});
    };
  }, []);

  const connectWallet = async () => {
    if (!coinbaseWallet) return;

    try {
      const accounts = (await coinbaseWallet.request({
        method: "eth_requestAccounts",
      })) as string[];
      setAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect", error);
    }
  };

  const disconnectWallet = () => {
    if (!coinbaseWallet) return;

    coinbaseWallet.disconnect();
    setAddress(null);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-lg font-semibold">
            <Link to="/">Athens</Link>
          </h1>
          <div className="flex space-x-4 text-sm">
            <Link to="/new">New</Link>
            <Link to="/threads">Threads</Link>
            <Link to="/comments">Comments</Link>
            <Link to="/ask">Ask</Link>
            {address ? (
              <>
                <span>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <Link to="#" onClick={disconnectWallet}>
                  Disconnect
                </Link>
              </>
            ) : (
              <Link to="#" onClick={connectWallet}>
                Connect
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
