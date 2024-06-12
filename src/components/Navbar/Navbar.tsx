"use client"

import React,{useState} from 'react';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';
import { Address } from 'web3';
import NetworkDropdown from './NetworkDropdown';
import Spinner from '../Spinner';
const Navbar: React.FC = () => {
  const { connected, walletAddress, networkId, connectWallet, changeNetwork } = useWallet();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const handleConnect = async () => {
    try {
      setIsLoading(true)
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally{
      setIsLoading(false)
    }
  };

  const handleNetworkChange = async (newNetworkId: number) => {
    await changeNetwork(newNetworkId);
  };

  function shortenAddress(address: Address): string {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  }

  return (
    <nav className="bg-black py-4 px-8">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-neon text-lg font-bold">EzCryptoPay</Link>
        <ul className="flex space-x-4">
          <li>
            <Link href='/QR_Code_Generator' className="text-white hover:text-gray-400">Generate QR</Link>
          </li>
          <li>
            <Link href='/SCAN_N_PAY' className="text-white hover:text-gray-400">Scan N Pay</Link>
          </li>
          <li>
          <Link href='/Split_Pay' className="text-white hover:text-gray-400">Scan N Pay</Link>
          </li>
        </ul>
        {connected ? (
          <div className="flex items-center text-white space-x-2">
            <span>{networkId ? <NetworkDropdown initialNetworkId={String(networkId)} onNetworkChange={handleNetworkChange} /> : ''}</span>
            <span className="mr-2">{shortenAddress(walletAddress)}</span>
          </div>
        ) : (
          <button
            className="button"
            onClick={handleConnect}
          >
           {isLoading ?<Spinner/> : 'Connect' }
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;