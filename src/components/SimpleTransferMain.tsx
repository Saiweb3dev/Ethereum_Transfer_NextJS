// src/components/Main.tsx

import { useWallet } from "@/context/WalletContext";
import React, { useEffect, useState } from "react";
import { SimpleABI, SimpleContractAddress } from "../../constants/index";
import WalletQRCode from "./QRCode/QRCodeGenerator";
import QRCodeScanner from "./QRCode/QRCodeScanner";
import TransactionStatus from "./TransactionStatus";
import WalletConnection from "./WalletConnection";

type ContractFunctionParams = {
  functionName: string;
  params: any[];
  msgValue: number;
};

const Main: React.FC = () => {
  const { web3, connected, walletAddress, networkId, userBalance } =
    useWallet();
  const [contract, setContract] = useState<any | null>(null);
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [formattedAmount, setFormattedAmount] = useState<string>("$0.00");
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "error" | undefined
  >(undefined);
  const [error, setError] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (transactionStatus === "success" || transactionStatus === "error") {
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
      const SimpleContractAddressTyped = SimpleContractAddress as Record<
        string,
        string
      >;
      const contractInstance = new web3.eth.Contract(
        SimpleABI,
        SimpleContractAddressTyped[networkId.toString()]
      );
      setContract(contractInstance);
    }
  }, [web3, networkId]);

  const callContractFunction = async ({
    functionName,
    params,
    msgValue,
  }: ContractFunctionParams) => {
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
        setTransactionStatus("pending");
        result = await contract.methods[functionName](...params).send({
          from: window.ethereum.selectedAddress,
          value: web3.utils.toWei(msgValue.toString(), "ether"),
          gas: 41000,
        });
        setTransactionStatus("success");
      }
      console.log("Transaction result:", result);
      setError("");
    } catch (error) {
      console.log("Error calling contract function:", error);
      setTransactionStatus("error");
      setError("An error occurred while calling the contract function.");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/^\$/, "");
    const numericValue = parseFloat(inputValue);

    if (!isNaN(numericValue)) {
      setAmount(numericValue);
      setFormattedAmount(e.target.value);
    } else {
      setFormattedAmount("$");
    }
  };

  const handleAmountBlur = () => {
    setFormattedAmount(`$${amount.toFixed(2)}`);
  };

  return (
    <div className="bg-black text-neon h-full w-full p-6">
      <div className="flex flex-col justify-center items-center space-y-6 max-w-4xl mx-auto p-6 border-2 border-neon">
        <h1 className="text-6xl font-bold transition-all duration-500 transform hover:scale-105">
          Transfer Token
        </h1>
        {connected && (
          <p className="text-2xl text-fade_green font-semibold bg-black border border-neon p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
            Wallet: {walletAddress}
          </p>
        )}
        {networkId && (
          <p className="text-xl text-fade_green font-semibold bg-black border border-neon p-4 rounded-lg transition-all duration-300 transform hover:scale-105">
            Network ID: {networkId.toString()}
          </p>
        )}

        <div className="flex flex-col justify-center items-center space-y-6 border-4 border-fade_green p-6 rounded-lg">
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
            <div className="flex flex-col justify-center items-center space-x-6 text-center mx-auto">
              <p className="font-bold text-xl">ETH</p>
              {connected && <p>Balance:{userBalance}</p>}
            </div>
          </div>
          <div className="flex flex-col justify-center items-start px-2 py-3 bg-gray_green rounded-lg w-full">
            <label htmlFor="address" className="ml-3 text-fade_green">
              To
            </label>
            <input
              type="text"
              placeholder="Wallet Address"
              className="input text-left flex-grow max-w-md"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>

          {connected ? (
            <button
              className="button"
              onClick={() =>
                callContractFunction({
                  functionName: "transferFund",
                  params: [address],
                  msgValue: amount,
                })
              }
            >
              Send
            </button>
          ) : (
            <WalletConnection />
          )}
        </div>
        <button className="button" onClick={() => setShowQRCode(true)}>
          Generate QR Code
        </button>

        {showQRCode && (
          <WalletQRCode
            walletAddress={walletAddress}
            onClose={() => setShowQRCode(false)}
          />
        )}
        <TransactionStatus status={transactionStatus} />
        <div className="animate-fade-in-left">
          <QRCodeScanner />
        </div>
      </div>
    </div>
  );
};

export default Main;
