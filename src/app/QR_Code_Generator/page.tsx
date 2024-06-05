"use client"
import React, { useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import WalletQRCode from '@/components/QRCode/QRCodeGenerator';
import WalletConnection from '@/components/WalletConnection';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

function page() {
  const { connected, walletAddress, networkId, connectWallet } = useWallet();
  const [showQRCode, setShowQRCode] = useState(false)

  return (
    <div className="bg-neon min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-5xl my-6 mx-auto p-36 bg-black rounded-lg shadow-md">
        <h1 className="text-5xl font-bold text-center mb-6 text-neon">Generate QR Code for your Wallet Address</h1>
        <div className="flex flex-col items-center space-y-6">
          <p className="text-gray-600 text-center">
            QR codes are a convenient way to share your wallet address with others. Simply scan the QR code with a compatible app to quickly and accurately copy your address.
          </p>
          {connected ? (
            <button
              className="bg-neon hover:bg-fade_green text-black font-bold py-2 px-4 rounded duration-200"
              onClick={() => setShowQRCode(true)}
            >
              Generate QR Code
            </button>
          ) : (
            <WalletConnection />
          )}
          {showQRCode && (
            <WalletQRCode
              walletAddress={walletAddress}
              onClose={() => setShowQRCode(false)}
            />
          )}
          <div className="flex space-x-4">
            <a
              href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20wallet%20address:%20${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fade_green hover:text-neon"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`My wallet address: ${walletAddress}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fade_green hover:text-neon"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`My wallet address: ${walletAddress}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fade_green hover:text-neon"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page