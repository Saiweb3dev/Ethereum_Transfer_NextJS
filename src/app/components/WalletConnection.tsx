import React from 'react';

interface WalletConnectionProps {
 connected: boolean;
 handleConnectWallet: () => void;
 handleDisconnectWallet: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ connected, handleConnectWallet, handleDisconnectWallet }) => {
 return (
    <div>
      {connected ? (
        <button onClick={handleDisconnectWallet} className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Disconnect
        </button>
      ) : (
        <button onClick={handleConnectWallet} className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded">
          Connect Wallet
        </button>
      )}
    </div>
 );
};

export default WalletConnection;
