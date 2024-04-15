"use client";
import Web3 from 'web3';
import {SimpleABI,SimpleContractAddress} from "../../../../constants/index";
import WalletConnection from '../WalletConnection';
import { useState,useEffect } from 'react';

type ContractFunctionParams = {
  functionName: string;
  params: any[];
  msgValue: number;
 };
const Main = () => {
  const [connected, setConnected] = useState<boolean>(false);
 const [walletAddress, setWalletAddress] = useState<string>("");
 const [web3, setWeb3] = useState<Web3 | null>(null);
 const [error, setError] = useState<string>("");
 const [contract, setContract] = useState<Web3.Contract | null>(null);
 const [address,setAddress] = useState<string>("");
 
 useEffect(() => {
  if (window.ethereum) {
    const web3Instance = new Web3(window.ethereum);
    setWeb3(web3Instance);
    window.ethereum.enable().then(() => {
      // Use the extracted contract address here
      const contractInstance = new web3Instance.eth.Contract(
        SimpleABI,
        SimpleContractAddress
      );
      console.log("Contract ABI:", SimpleABI);
      console.log("Contract Address:", SimpleContractAddress);
      setContract(contractInstance);
    });
  } else {
    console.log("Please Install MetaMask!");
  }
}, []);
 const callContractFunction = async ({ functionName, params = [], msgValue }: ContractFunctionParams) => {
  console.log("Contract name -> ", functionName);

  if (!web3 || !contract) {
    console.log("Web3 or contract is not initialized");
    return;
  }
  try {
    const isReadOnly = msgValue === 0;
    let result;
    if (isReadOnly) {
      result = await contract.methods[functionName](...params).call();
    } else {
      result = await contract.methods[functionName](...params).send({
        from: window.ethereum.selectedAddress,
        value: web3.utils.toWei(msgValue.toString(), "ether"),
        gas:41000,
      });
    }
    console.log(result);
    setError(""); // Clear error state on successful call
  } catch (error) {
    console.log("Error calling contract function:", error);
    setError("An error occurred while calling the contract function.");
  }
};
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("No Ethereum provider found");
    }
 };
 const handleDisconnectWallet = () => {
  setConnected(false);
  setWalletAddress("");
};
  return (
    <>
    <div className='flex flex-col justify-center items-center space-y-6 bg-violet-700 h-screen w-full'>
    {connected && (
          <p className="text-2xl text-pink-800 bg-black px-4 py-2 rounded-xl">
            Wallet: {walletAddress}
          </p>
        )}
      <WalletConnection connected={connected}
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}/>
           <input 
      type="text"
      placeholder="Enter Address"
      onChange={(e) => setAddress(e.target.value)}
      className='placeholder:text-black bg-pink-600 w-auto px-4 py-2 rounded-xl'
      />
      <button className='bg-gradient-to-r from-green-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded' onClick={() => callContractFunction({ functionName: "transferFund", params: [address], msgValue: 1 })}>Send</button>
      </div>
    </>
   
  )
}
export default Main;