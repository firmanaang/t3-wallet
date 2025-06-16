"use client";

import { type ReactElement, useState } from "react";
import { siweConfig } from "~/app/lib/siweConfig";
import { signIn } from "next-auth/react";
import type { SIWECreateMessageArgs } from "@reown/appkit-siwe";

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export default function SIWELoginButton(): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleSIWELogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum || typeof window.ethereum.request !== "function") {
        throw new Error("Please install MetaMask to connect your wallet.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new Error("No accounts found");
      }
      const userAddress = accounts[0];
      setAddress(userAddress);
      setIsConnected(true);

      // Retrieve nonce and create SIWE message
      const nonce = await siweConfig.getNonce();
      const message = await siweConfig.createMessage({ 
        address: userAddress,
        nonce,
        domain: window.location.host,
        uri: window.location.origin,
      } as SIWECreateMessageArgs);

      // Request the wallet to sign the SIWE message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, userAddress],
      });

      // Verify the message using NextAuth signIn
      const result = await siweConfig.verifyMessage({ message, signature });
      
      if (!result) {
        throw new Error("SIWE verification failed.");
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      console.error("SIWE login error:", errorMessage);
      setIsConnected(false);
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
      <button
        type="button"
        onClick={handleSIWELogin}
        disabled={isLoading || isConnected}
        className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 p-0.5 text-white transition-all hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <span className="relative flex items-center gap-2 rounded-md px-6 py-2.5 bg-white text-purple-700 transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-white">
          {isLoading ? (
            <>
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Connecting...</span>
            </>
          ) : isConnected ? (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connect with SIWE</span>
            </>
          )}
        </span>
      </button>
      {error && (
        <div className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
