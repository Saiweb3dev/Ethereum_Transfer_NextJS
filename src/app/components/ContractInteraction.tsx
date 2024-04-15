"use client";
import React,{useState} from 'react';

interface ContractInteractionProps {
  web3: any; // Replace 'any' with a more specific type if possible
  contract: any; // Replace 'any' with a more specific type if 
 }
 type ContractFunctionParams = {
  functionName: string;
  params: any[];
  msgValue: number;
 };

const ContractInteraction: React.FC<ContractInteractionProps> = ({ web3, contract }) => {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [error, setError] = useState("");
  function isValidEthereumAddress(address: string) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      // Check if it has the basic requirements of an address
      return false;
    }
    return true;
 }
 const handleSetReceiver = async (receiverAddress: string) => {
  console.log("setReceiver Function called with address:", receiverAddress);
  if (!isValidEthereumAddress(receiverAddress)) {
     setError("Please enter a valid Ethereum address.");
     return;
  }
  // Adjusted to match the new signature
  callContractFunction({ functionName: "setReceiver", params: [receiverAddress], msgValue: 0 });
 };
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
 return (
    <div className="flex flex-col space-y-6 justify-center items-center bg-black p-4 rounded-lg">
      <div className='flex flex-col justify-center items-center'>
        <h2 className='text-xl'>Enter the Address of the Receiver</h2>
        <input
          type="text"
          className="text-black bg-pink-600 w-auto rounded-lg"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
      </div>

      <button
        onClick={() => handleSetReceiver(receiverAddress)}
        className="bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded"
        disabled={!web3 || !contract}
      >
        Set Address
      </button>
    </div>
 );
};

export default ContractInteraction;
