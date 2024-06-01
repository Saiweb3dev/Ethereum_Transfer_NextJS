// src/components/WalletConnection.tsx
import React from 'react';
import { useWallet } from '@/context/WalletContext';

const WalletConnection: React.FC = () => {
  const { connected, walletAddress, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className=''>
      {connected ? (
        <div className='flex flex-col justify-center items-center'>
          <p>Connected: {walletAddress}</p>
          <button className='button' onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button className='button' onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnection;