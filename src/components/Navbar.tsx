"use client"
import React from 'react';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';
import { Address } from 'web3';

const Navbar = () => {
  const { connected, walletAddress, networkId, connectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  function shortenAddress(address:Address) {
    // Keep the first 4 characters, then add '...' and the last 4 characters
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  }
  

  return (
    <nav className="bg-black py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-neon text-lg font-bold">E-Pay</div>
        <ul className="flex space-x-4">
          <li>
            <Link href='/QR_Code_Generator' className="text-white hover:text-gray-400">Generate QR</Link>
          </li>
          <li>
            <Link href='/QR_Code_Generator' className="text-white hover:text-gray-400">Scan N Pay</Link>
          </li>
          <li>
            <button className="text-white hover:text-gray-400">Split Pay</button>
          </li>
        </ul>
        {connected ? (
          <div className="flex items-center text-white">
            <span className="mr-2">{shortenAddress(walletAddress)}</span>
            <span>{networkId ? `(Network ID: ${networkId.toString()})` : ''}</span>
          </div>
        ) : (
          <button
            className="button"
            onClick={handleConnect}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;