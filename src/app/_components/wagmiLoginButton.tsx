"use client";

import * as React from "react";
import { wagmiAdapter } from "~/app/lib/wagmiConfig";
import { mainnet } from "@reown/appkit/networks";

export default function WagmiLoginButton(): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleWagmiLogin = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await wagmiAdapter.connect({
        id: mainnet.id.toString(),
        type: "eip155"
      });
    } catch (err) {
      console.error("Wagmi login failed:", err);
      setError(err instanceof Error ? err.message : "Wagmi login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleWagmiLogin}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60"
        aria-label="Login with your wallet"
      >
        {isLoading ? (
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
