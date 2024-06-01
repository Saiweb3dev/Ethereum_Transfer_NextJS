// src/context/WalletContext.tsx

import React, { createContext, useContext, useState } from 'react';
import Web3 from 'web3';

interface WalletContextProps {
  connected: boolean;
  walletAddress: string;
  networkId: BigInt | null;
  userBalance: string;
  web3: Web3 | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

// Custom hook to use the WalletContext
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// WalletProvider component that manages wallet connection state
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [userBalance, setUserBalance] = useState<string>('');
  const [networkId, setNetworkId] = useState<BigInt | null>(null);

  // Function to connect to the wallet using MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3Instance.eth.getAccounts();
        const currentNetworkId = await web3Instance.eth.net.getId();
        const balance = await web3Instance.eth.getBalance(accounts[0]);
        const formattedBalance = parseFloat(web3Instance.utils.fromWei(balance, 'ether')).toFixed(2);
        setWeb3(web3Instance);
        setUserBalance(formattedBalance);
        setNetworkId(BigInt(currentNetworkId));
        setConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('No Ethereum provider found');
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
    setWeb3(null);
    setUserBalance('');
    setNetworkId(null);
  };

  // Function to refresh the user balance
  const refreshBalance = async () => {
    if (web3 && walletAddress) {
      try {
        const balance = await web3.eth.getBalance(walletAddress);
        const formattedBalance = parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(2);
        setUserBalance(formattedBalance);
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{ connected, walletAddress, networkId, userBalance, web3, connectWallet, disconnectWallet, refreshBalance }}
    >
      {children}
    </WalletContext.Provider>
  );
};
