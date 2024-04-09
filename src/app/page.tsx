"use client";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { abi, contractAddressVar } from "../../constants/index";
declare global {
 interface Window {
    ethereum: any; // or specify the type of ethereum property if known
 }
}

export default function Home() {
 const [connected, setConnected] = useState(false);
 const [walletAddress, setWalletAddress] = useState("");
 const [web3, setWeb3] = useState(null);
 const [contract, setContract] = useState(null);
 const [receiverAddress, setReceiverAddress] = useState("");
 const [ethAmount, setEthAmount] = useState(""); // State for ETH amount
 const [error, setError] = useState("");
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

 const callContractFunction = async (
    functionName: any,
    params: any[] = [],
    msgValue:number
 ) => {
    // console.log("Contract Instance:", contract);
    // console.log("ABI:", abi);
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

 const handleSetReceiver = async (receiverAddress: string) => {
    console.log("setReceiver Function called with address:", receiverAddress);
    if (!isValidEthereumAddress(receiverAddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
    await callContractFunction("setReceiver", [receiverAddress]);
 };

 const handleDisconnectWallet = () => {
    setConnected(false);
    setWalletAddress("");
 };

 function isValidEthereumAddress(address: string) {
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
        {connected ? (
          <button
            onClick={handleDisconnectWallet}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )}
        <div className="flex flex-row justify-center items-center space-x-6">
          <div>
            <h2>Enter the Address of the Receiver</h2>
            <input
              type="text"
              className="text-black bg-pink-600 w-auto"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleSetReceiver(receiverAddress)}
            className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
            disabled={!web3 || !contract}
          >
            Transfer
          </button>
        </div>
        <div>
          <h2>Enter the Amount of ETH to Send</h2>
          <input
            type="text"
            className="text-black bg-pink-600 w-auto"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
          />
        </div>
        <button
          onClick={() => callContractFunction("transferFund", [], ethAmount)}
          className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          disabled={!web3 || !contract || ethAmount === ""}
        >
          Send ETH
        </button>
        <div className="flex flex-col space-y-6">
          <button className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          onClick={() => callContractFunction("getReceiver")}>Get the Receiver Address</button>
          <button className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
          onClick={() => callContractFunction("getOwner")}>Get the Owner Address</button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </main>
 );
}
