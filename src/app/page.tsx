"use client";
import Image from "next/image";
import { useState } from "react";
declare global {
  interface Window {
    ethereum: any; // or specify the type of ethereum property if known
  }
}
import Web3 from "web3";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No Ethereum provider found");
    }
  };

  const handleDisconnectWallet = () => {
    setConnected(false);
    setWalletAddress("");
  };

  return (
    <main className="container bg-gradient-to-br h-screen from-pink-800 w-full to-black  p-36">
      <div className="flex  flex-col items-center justify-center space-y-12  p-12 max-w-5xl mx-auto">
        <h1 className="text-7xl font-bold text-white">Transfer Ethereum</h1>
        {connected && (
          <p className="text-2xl text-pink-800 bg-black px-4 py-2 rounded-xl">
            Wallet: {walletAddress}
          </p>
        )}
        {connected ? (
          <button
            onClick={handleDisconnectWallet}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </main>
  );
}
