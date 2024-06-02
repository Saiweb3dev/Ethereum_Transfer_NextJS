import React from 'react';
import { useWallet } from '@/context/WalletContext';

const Navbar = () => {
  const { connected, walletAddress, networkId, connectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <nav className="bg-black py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-neon text-lg font-bold">E-Pay</div>
        <ul className="flex space-x-4">
          <li>
            <button className="text-white hover:text-gray-400">Generate QR</button>
          </li>
          <li>
            <button className="text-white hover:text-gray-400">Scan N Pay</button>
          </li>
          <li>
            <button className="text-white hover:text-gray-400">Split Pay</button>
          </li>
        </ul>
        {connected ? (
          <div className="flex items-center text-white">
            <span className="mr-2">{walletAddress}</span>
            <span>{networkId ? `(Network ID: ${networkId.toString()})` : ''}</span>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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