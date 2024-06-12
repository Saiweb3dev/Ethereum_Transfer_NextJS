"use client"
import React from 'react'
import { useWallet } from '@/context/WalletContext'
import QRCodeReader from '@/components/QRCode/QRCodeScanner';
import WalletConnection from '@/components/WalletConnection';
function page() {
  const {connected,walletAddress} = useWallet();
  return (
    <div className='bg-neon min-h-screen flex flex-col items-center justify-center'>
     <div className='max-w-5xl my-6 mx-auto p-36 bg-black rounded-lg shadow-md'>
     <h1 className="text-5xl font-bold text-center mb-6 text-neon">Scan N Pay to the Address</h1>
     <div className='flex flex-col items-center space-y-6'>
      <p className='text-gray-600 text-center'>
       Scan the QR code with a compatible app to quickly and accurately copy your address.
      </p>
      {connected ? (
        <QRCodeReader/>
      ) : (
        <WalletConnection/>
      )}
     </div>
     </div>
    </div>
  )
}

export default page