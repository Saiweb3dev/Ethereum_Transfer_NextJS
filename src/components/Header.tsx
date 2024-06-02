// src/components/Header.tsx
import React from 'react';
import { useWallet } from '@/context/WalletContext';

const Header: React.FC = () => {
  const { connected, walletAddress, networkId, userBalance } = useWallet();

  return (
    <div className="flex flex-col justify-center items-center space-y-6 bg-violet-700 h-screen w-full">
      <h1 className="text-6xl font-bold ">Transfer ETH</h1>
      {connected && (
        <>
          <p className="text-2xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">Wallet: {walletAddress}</p>
          {networkId && <p className="text-xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">Network ID: {networkId.toString()}</p>}
          <div className="text-green-600 font-semibold bg-white p-4 rounded-lg">Balance: {userBalance} ETH</div>
        </>
      )}
    </div>
  );
};

export default Header;
