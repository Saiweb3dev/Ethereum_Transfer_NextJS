// src/components/WalletQRCode.tsx

import React from 'react';
import  QRCode  from 'qrcode.react';

interface WalletQRCodeProps {
  walletAddress: string;
  onClose: () => void;
}

const WalletQRCode: React.FC<WalletQRCodeProps> = ({ walletAddress, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Scan the QR Code to access the wallet</h2>
        <QRCode value={walletAddress} size={256} />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WalletQRCode;
