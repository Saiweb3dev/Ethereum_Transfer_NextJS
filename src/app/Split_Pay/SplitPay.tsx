"use client"
import React, { useState, useEffect } from 'react';
import WalletConnection from '@/components/WalletConnection'; // Component for connecting wallets
import { useWallet } from '@/context/WalletContext'; // Context hook for wallet-related data
import { SimpleABI, SimpleContractAddress } from '../../../constants'; // Smart contract ABI and address constants

// Type definition for contract function parameters
type ContractFunctionParams = {
  functionName: string;
  params: any[]; // Variable number of parameters
  msgValue: number; // Value in Ether to be sent
};

function SplitPay() {
  const { web3, connected, walletAddress, networkId, userBalance } = useWallet(); // Destructuring wallet context

  // State hooks for managing UI state
  const [formattedAmount, setFormattedAmount] = useState<string>("$0.00"); // Formatted amount for display
  const [amount, setAmount] = useState<number>(0); // Numeric representation of the amount
  const [numRecipients, setNumRecipients] = useState<number>(2); // Number of recipients
  const [addresses, setAddresses] = useState<string[]>(['', '']); // Array to hold recipient addresses
  const [error, setError] = useState<string>(""); // Error message
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "success" | "error" | undefined>(undefined); // Transaction status
  const [contract, setContract] = useState<any | null>(null); // Smart contract instance

  // Initialize the contract when web3 and networkId are available
  useEffect(() => {
    if (web3 && networkId) {
      const SimpleContractAddressTyped = SimpleContractAddress as Record<string, string>; // Cast to expected type
      const contractInstance = new web3.eth.Contract(SimpleABI, SimpleContractAddressTyped[networkId.toString()]); // Create contract instance
      setContract(contractInstance);
    }
  }, [web3, networkId]);

  // Handle changes to the amount input field
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/^\$/, ""); // Remove leading dollar sign
    const numericValue = parseFloat(inputValue);

    if (!isNaN(numericValue)) {
      setAmount(numericValue);
      setFormattedAmount(e.target.value);
    } else {
      setFormattedAmount("$"); // Reset formatting if input is not a number
    }
  };

  // Update formatted amount on blur to ensure correct formatting
  const handleAmountBlur = () => {
    setFormattedAmount(`$${amount.toFixed(2)}`);
  };

  // Update the number of recipient inputs based on the selected number
  const handleNumRecipientsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    setNumRecipients(num);
    const newAddresses = [...Array(num)].map((_, index) => addresses[index] || ''); // Preserve existing addresses, fill rest with empty strings
    setAddresses(newAddresses);
  };

  // Update a specific address in the addresses array
  const handleAddressChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddresses = [...addresses];
    newAddresses[index] = e.target.value;
    setAddresses(newAddresses);
  };

  // Function to call a contract function, handling both read-only calls and transactions
  const callContractFunction = async ({ functionName, params, msgValue }: ContractFunctionParams) => {
    if (!web3 ||!contract) {
      console.log("Web3 or contract is not initialized");
      return;
    }
    try {
      console.log("Sending transaction...");
      setTransactionStatus("pending");
      // Call the batchTransferFund function with the addresses array and total amount to be sent
      const result = await contract.methods[functionName](...params).send({
        from: window.ethereum.selectedAddress,
        value: web3.utils.toWei(msgValue.toString(), "ether"), // Convert Ether to Wei
        gas: 41000, // Set gas limit
      });
      setTransactionStatus("success");
      console.log("Transaction result:", result);
      setError(""); // Clear any existing errors
    } catch (error) {
      console.log("Error calling contract function:", error);
      setTransactionStatus("error");
      setError("An error occurred while calling the contract function."); // Set error message
    }
  };

  // Render the component UI
  return (
    <div className='bg-black text-neon h-full w-full p-6'>
      {/* Main content container */}
      <div className="flex flex-col justify-center items-center space-y-6 max-w-4xl mx-auto p-6 border-2 border-neon">
        {/* Inner content container */}
        <div className="flex flex-col justify-center items-center space-y-6 border-4 border-fade_green p-6 rounded-lg">
          {/* Amount input section */}
          <div className="flex flex-col justify-center items-start px-2 py-6 bg-gray_green rounded-lg w-full">
            <label htmlFor="amount" className="ml-3 text-fade_green">
              You're sending
            </label>
            <input
              type="text"
              placeholder="$0.00"
              className="input text-6xl text-center flex-grow max-w-md py-6"
              value={formattedAmount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
            />
            <hr />
            {/* Display balance */}
            <div className="flex flex-col justify-center items-center space-x-6 text-center mx-auto">
              <p className="font-bold text-xl">ETH</p>
              {connected && <p>Balance:{userBalance}</p>}
            </div>
          </div>
          {/* Dropdown for selecting the number of recipients */}
          <div className="flex flex-col justify-center items-start px-2 py-3 bg-gray_green rounded-lg w-full">
            <label htmlFor="numRecipients" className="ml-3 text-fade_green">
              Number of Recipients:
            </label>
            <select id="numRecipients" value={numRecipients} onChange={handleNumRecipientsChange} className="input text-left flex-grow max-w-md">
              {[2, 3, 4].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          {/* Dynamically generated recipient address inputs */}
          {addresses.map((address, index) => (
            <div key={index} className="flex flex-col justify-center items-start px-2 py-3 bg-gray_green rounded-lg w-full">
              <label htmlFor={`address-${index}`} className="ml-3 text-fade_green">
                Recipient {index + 1}:
              </label>
              <input
                type="text"
                id={`address-${index}`}
                placeholder="Wallet Address"
                className="input text-left flex-grow max-w-md"
                value={address}
                onChange={handleAddressChange(index)}
              />
            </div>
          ))}

          {/* Conditional rendering based on connection status */}
          {connected? (
            <button
              className="button"
              onClick={() =>
                callContractFunction({
                  functionName: "batchTransferFund", // Correct function name for the contract
                  params: [addresses], // Pass the addresses array directly
                  msgValue: amount, // Total amount to be sent, which will be divided among recipients
                })
              }
            >
              Send
            </button>
          ) : (
            <WalletConnection /> // Display WalletConnection component if not connected
          )}
        </div>
      </div>
    </div>
  );
}

export default SplitPay;
