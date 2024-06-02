"use client"
import React, { useState } from 'react'
import { useWallet } from '@/context/WalletContext'
import WalletQRCode from '@/components/QRCode/QRCodeGenerator';
function page() {
  const { connected, walletAddress, networkId, connectWallet } = useWallet();
  const [showQRCode,setShowQRCode] = useState(false)
  return (
    <div className='container bg-black w-full'>
      <div className='flex flex-col justify-center items-center space-y-6 max-w-5xl mx-auto p-6'>
      <h1 className='text-5xl font-bold text-neon'>Generate QR Code for your Wallet Address</h1>
      {connected ? (
        <button className="button" onClick={() => setShowQRCode(true)}>
        Generate QR Code
      </button>
      ):(
        <button className="button" onClick={connectWallet}>
        Connect Wallet
      </button>
      )}
      {showQRCode && (
        <WalletQRCode
          walletAddress={walletAddress}
          onClose={() => setShowQRCode(false)}
        />
      )}
      </div>
    </div>
  )
}


export default page