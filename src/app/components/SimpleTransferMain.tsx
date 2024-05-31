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
    <div className="flex flex-col justify-center items-center space-y-6 bg-violet-700 h-screen w-full">
      <h1 className="text-6xl font-bold">Transfer ETH</h1>
      {connected && <p className="text-2xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">Wallet: {walletAddress}</p>}
      {networkId && <p className="text-xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">Network ID: {networkId.toString()}</p>}
      <div className="text-green-600 font-semibold bg-white p-4 rounded-lg">Balance: {userBalance} ETH</div>

      <WalletConnection />

      <input
        type="text"
        placeholder="Enter Address"
        onChange={(e) => setAddress(e.target.value)}
        className="placeholder:text-violet-700 text-violet-700 bg-white w-auto px-4 py-2 rounded-xl"
      />
      <input
        type="number"
        placeholder="Enter Amount"
        className="placeholder:text-violet-700 text-violet-700 bg-white w-auto px-4 py-2 rounded-xl"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button
        className="bg-gradient-to-r from-violet-600 to-violet-900 hover:bg-gradient-to-r text-white border-2 border-white font-bold py-2 px-4 rounded"
        onClick={() => callContractFunction({ functionName: 'transferFund', params: [address], msgValue: amount })}
      >
        Send
      </button>
      <button
        className="bg-gradient-to-r from-violet-600 to-violet-900 hover:bg-gradient-to-r text-white border-2 border-white font-bold py-2 px-4 rounded"
        onClick={() => setShowQRCode(true)}
      >
        Generate QR Code
      </button>

      {showQRCode && <WalletQRCode walletAddress={walletAddress} onClose={() => setShowQRCode(false)} />}
      <TransactionStatus status={transactionStatus} />
      <div>
        <QRCodeScanner />
      </div>
    </div>
  );
};

export default Main;
