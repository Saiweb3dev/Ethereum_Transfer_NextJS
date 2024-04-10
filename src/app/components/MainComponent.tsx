import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { abi, contractAddressVar } from '../../../constants/index';
import WalletConnection from './WalletConnection';
import ContractInteraction from './ContractInteraction';
import InputField from './InputField';
import ButtonComponent from './ButtonComponent';
import ErrorDisplay from './ErrorDisplay';

// Define the type for the contract function parameters
type ContractFunctionParams = {
 functionName: string;
 params: any[];
 msgValue: number;
};

export default function Home() {
 const [connected, setConnected] = useState<boolean>(false);
 const [walletAddress, setWalletAddress] = useState<string>("");
 const [web3, setWeb3] = useState<Web3 | null>(null);
 const [contract, setContract] = useState<Web3.Contract | null>(null);
 const [receiverAddress, setReceiverAddress] = useState<string>("");
 const [ethAmount, setEthAmount] = useState<string>(""); // State for ETH amount
 const [error, setError] = useState<string>("");
 // Extract the contract address from contractAddressVar
 const contractAddress = contractAddressVar[31337];

 useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.enable().then(() => {
        // Use the extracted contract address here
        const contractInstance = new web3Instance.eth.Contract(
          abi,
          contractAddress
        );
        console.log("Contract ABI:", abi);
        console.log("Contract Address:", contractAddress);
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

 function isValidEthereumAddress(address: string): boolean {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      // Check if it has the basic requirements of an address
      return false;
    }
    return true;
 }

 return (
    <main className="container bg-gradient-to-br h-screen from-pink-800 w-full to-black p-36">
      <div className="flex flex-col items-center justify-center space-y-12 p-12 max-w-5xl mx-auto">
        <h1 className="text-7xl font-bold text-white">Transfer Ethereum</h1>
        {connected && (
          <p className="text-2xl text-pink-800 bg-black px-4 py-2 rounded-xl">
            Wallet: {walletAddress}
          </p>
        )}
        <WalletConnection
          connected={connected}
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
        />
        <ContractInteraction
          web3={web3}
          contract={contract}
          receiverAddress={receiverAddress}
          ethAmount={ethAmount}
          callContractFunction={callContractFunction}
        />
        <InputField
          label="Enter the Amount of ETH to Send"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          className="text-black bg-pink-600 w-auto"
        />
        <ButtonComponent
          text="Send ETH"
          onClick={() => callContractFunction({ functionName: "transferFund", params: [], msgValue: parseFloat(ethAmount) })}
          disabled={!web3 || !contract || ethAmount === ""}
          className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
        />
        <div className="flex flex-col space-y-6">
          <ButtonComponent
            text="Get the Receiver Address"
            onClick={() => callContractFunction({ functionName: "getReceiver", params: [], msgValue: 0 })}
            className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          />
          <ButtonComponent
            text="Get the Owner Address"
            onClick={() => callContractFunction({ functionName: "getOwner", params: [], msgValue: 0 })}
            className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          />
        </div>
        <ErrorDisplay error={error} />
      </div>
    </main>
 );
}
