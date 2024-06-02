import React from 'react';
import QRCode from 'qrcode.react';

interface WalletQRCodeProps {
  walletAddress: string;
  onClose: () => void; // Add this line
  // other props...
}

const WalletQRCode: React.FC<WalletQRCodeProps> = ({ walletAddress }) => {
  const walletUrl = `https://example.com/wallet?address=${walletAddress}`;

  return (
    <div>
      <QRCode
        value={walletUrl}
        size={256}
        renderAs="svg"
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
};

export default WalletQRCode;