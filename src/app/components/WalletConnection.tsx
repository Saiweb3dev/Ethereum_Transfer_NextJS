// src/components/WalletConnection.tsx

import React from 'react';
import { useWallet } from '@/context/WalletContext';

const WalletConnection: React.FC = () => {
  const { connected, walletAddress, connectWallet, disconnectWallet } = useWallet();

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected: {walletAddress}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnection;
