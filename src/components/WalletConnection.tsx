// src/components/WalletConnection.tsx
"use client";
import React,{useState} from 'react';
import { useWallet } from '@/context/WalletContext';
import Spinner from './Spinner';
const WalletConnection: React.FC = () => {
  const { connected, walletAddress, connectWallet, disconnectWallet } = useWallet();

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

  return (
    <div className=''>
      {connected ? (
        <div className='flex flex-col justify-center items-center'>
          <p>Connected: {walletAddress}</p>
          <button className='button' onClick={disconnectWallet}>Disconnect</button>
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
  );
};

export default WalletConnection;