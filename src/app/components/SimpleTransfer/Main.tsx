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
 const [amount,setAmount] = useState<number>(0);
 
 useEffect(() => {
  const initialize = async () => {
     if (window.ethereum) {
       const web3Instance = new Web3(window.ethereum);
       setWeb3(web3Instance);
       try {
         await window.ethereum.enable();
         const currentNetworkId = await web3Instance.eth.net.getId();
         const networkId = BigInt(31337); // Convert 31337 to BigInt
         if (currentNetworkId === networkId) {
           const contractInstance = new web3Instance.eth.Contract(
             SimpleABI,
             SimpleContractAddress[networkId.toString()] // Assuming SimpleContractAddress can handle BigInt keys
           );
           console.log("Contract ABI:", SimpleABI);
           console.log("Contract Address:", SimpleContractAddress[networkId.toString()]);
           setContract(contractInstance);
         } else {
           console.log("Please connect to the correct network.");
           console.log("Current Network is -> ", currentNetworkId);
         }
       } catch (error) {
         console.error("Error initializing web3 or contract:", error);
       }
     } else {
       console.log("Please Install MetaMask!");
     }
  };
 
  initialize();
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
       console.log("Sending transaction...");
       result = await contract.methods[functionName](...params).send({
         from: window.ethereum.selectedAddress,
         value: web3.utils.toWei(msgValue.toString(), "ether"),
         gas:41000,
       });
     }
     console.log("Transaction result:", result);
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
      <h1 className='text-6xl font-bold '>Transfer ETH</h1>
    {connected && (
          <p className="text-2xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">
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
      className='placeholder:text-violet-700 text-violet-700 bg-white w-auto px-4 py-2 rounded-xl'
      />
      <input type="number" placeholder='Enter Amount' className='placeholder:text-violet-700 text-violet-700 bg-white w-auto px-4 py-2 rounded-xl'
      onChange={(e) => setAmount(Number(e.target.value))} />
      <button className='bg-gradient-to-r from-violet-600 to-violet-900 hover:bg-gradient-to-r text-white border-2 border-white font-bold py-2 px-4 rounded' onClick={() => callContractFunction({ functionName: "transferFund", params: [address], msgValue: amount })}>Send</button>
      </div>
    </>
   
  )
}
export default Main;