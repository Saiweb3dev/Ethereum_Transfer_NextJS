// src/context/WalletContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

interface WalletContextProps {
  connected: boolean;
  walletAddress: string;
  networkId: BigInt | null;
  userBalance: string;
  web3: Web3 | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [userBalance, setUserBalance] = useState<string>('');
  const [networkId, setNetworkId] = useState<BigInt | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          await window.ethereum.enable();
          const currentNetworkId = await web3Instance.eth.net.getId();
          const accounts = await web3Instance.eth.getAccounts();
          const balance = await web3Instance.eth.getBalance(accounts[0]);
          const formattedBalance = parseFloat(web3Instance.utils.fromWei(balance, 'ether')).toFixed(2);
          setUserBalance(formattedBalance);
          setNetworkId(BigInt(currentNetworkId));
        } catch (error) {
          console.error('Error initializing web3:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };
    initialize();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('No Ethereum provider found');
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
  };

  return (
    <WalletContext.Provider
      value={{ connected, walletAddress, networkId, userBalance, web3, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
