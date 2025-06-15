"use client";

import * as React from "react";

export default function WagmiLoginButton(): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [address, setAddress] = React.useState<string | null>(null);

  const handleConnect = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      const provider = window.ethereum;
      if (!provider || typeof provider.request !== 'function') {
        throw new Error("Please install MetaMask to connect your wallet");
      }

      // Request account access
      const accounts = await provider.request({ 
        method: "eth_requestAccounts" 
      });

      if (Array.isArray(accounts) && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      } else {
        throw new Error("No accounts found");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setError(err instanceof Error ? err.message : "Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleConnect}
        disabled={isLoading || isConnected}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 p-0.5 text-white transition-all hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative flex items-center gap-2 rounded-md px-6 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
          {isLoading ? (
            <>
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
              <span>Connecting...</span>
            </>
          ) : isConnected ? (
            <>
              <svg 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </>
          ) : (
            <>
              <svg 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </span>
      </button>
      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
