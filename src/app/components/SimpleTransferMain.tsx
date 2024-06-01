// src/components/Main.tsx

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import WalletConnection from './WalletConnection';
import TransactionStatus from './TransactionStatus';
import WalletQRCode from '././QRCode/QRCodeGenerator';
import Web3 from 'web3';
import { SimpleABI, SimpleContractAddress } from '../../../constants/index';
import QRCodeScanner from './QRCode/QRCodeScanner';


type ContractFunctionParams = {
  functionName: string;
  params: any[];
  msgValue: number;
};

const Main: React.FC = () => {
  const { web3, connected, walletAddress, networkId, userBalance } = useWallet();
  const [contract, setContract] = useState<any | null>(null);
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error' | undefined>(undefined);
  const [error, setError] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (transactionStatus === 'success' || transactionStatus === 'error') {
      timer = setTimeout(() => {
        setTransactionStatus(undefined);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [transactionStatus]);

  useEffect(() => {
    if (web3 && networkId) {
      const SimpleContractAddressTyped = SimpleContractAddress as Record<string, string>;
      const contractInstance = new web3.eth.Contract(SimpleABI, SimpleContractAddressTyped[networkId.toString()]);
      setContract(contractInstance);
    }
  }, [web3, networkId]);

  const callContractFunction = async ({ functionName, params, msgValue }: ContractFunctionParams) => {
    if (!web3 || !contract) {
      console.log('Web3 or contract is not initialized');
      return;
    }
    try {
      const isReadOnly = msgValue === 0;
      let result;
      if (isReadOnly) {
        result = await contract.methods[functionName](...params).call();
      } else {
        console.log('Sending transaction...');
        setTransactionStatus('pending');
        result = await contract.methods[functionName](...params).send({
          from: window.ethereum.selectedAddress,
          value: web3.utils.toWei(msgValue.toString(), 'ether'),
          gas: 41000,
        });
        setTransactionStatus('success');
      }
      console.log('Transaction result:', result);
      setError('');
    } catch (error) {
      console.log('Error calling contract function:', error);
      setTransactionStatus('error');
      setError('An error occurred while calling the contract function.');
    }
  };

  return (
    <div className=" bg-black text-neon h-full w-full p-6">
      <div className='flex flex-col justify-center items-center space-y-6 max-w-4xl mx-auto p-6 border-2 border-neon'>
  <h1 className="text-6xl font-bold transition-all duration-500 transform hover:scale-105">Transfer Token</h1>
  {connected && (
    <p className="text-2xl text-fade_green font-semibold bg-black border border-neon p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
      Wallet: {walletAddress}
    </p>
  )}
  {networkId && (
    <p className="text-xl  text-fade_green font-semibold bg-black border border-neon p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
      Network ID: {networkId.toString()}
    </p>
  )}
  <div className="text-fade_green font-semibold bg-black border border-neon p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
    Balance: {userBalance} ETH
  </div>


<div className='flex flex-col justify-center items-center space-y-6 border-4 border-fade_green p-6 rounded-lg'>


  <input
    type="text"
    placeholder="Enter Address"
    onChange={(e) => setAddress(e.target.value)}
    className="input"
  />
  <input
    type="number"
    placeholder="Enter Amount"
    className="input"
    onChange={(e) => setAmount(Number(e.target.value))}
  />
  {connected ? (<button
    className="button"
    onClick={() => callContractFunction({ functionName: 'transferFund', params: [address], msgValue: amount })}
  >
    Send
  </button>):(<WalletConnection />)
  }
  
  
  </div>
  <button
    className="button"
    onClick={() => setShowQRCode(true)}
  >
    Generate QR Code
  </button>

  {showQRCode && (
    <WalletQRCode
      walletAddress={walletAddress}
      onClose={() => setShowQRCode(false)}
    />
  )}
  <TransactionStatus status={transactionStatus}/>
  <div className="animate-fade-in-left">
    <QRCodeScanner />
  </div>
  </div>
</div>
  );
};

export default Main;
