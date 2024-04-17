"use client";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { SimpleABI, SimpleContractAddress } from "../../../../constants/index";
import WalletConnection from "../WalletConnection";

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
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [networkId, setNetworkId] = useState<BigInt | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "error"
  >("");
  const [userBalance, setUserBalance] = useState<string>("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (transactionStatus === "success" || transactionStatus === "error") {
      timer = setTimeout(() => {
        setTransactionStatus("");
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [transactionStatus]);
  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum !== "undefined" && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          await window.ethereum.enable();
          const currentNetworkId = await web3Instance.eth.net.getId();
          const accounts = await web3Instance.eth.getAccounts();
          const balance = await web3Instance.eth.getBalance(accounts[0]);
          const formattedBalance = parseFloat(
            web3Instance.utils.fromWei(balance, "ether")
          ).toFixed(2);
          setUserBalance(formattedBalance);

          console.log("Current Network ID:", currentNetworkId);
          const networkId = BigInt(11155111); // Convert 31337 to BigInt
          setNetworkId(networkId); // Update the network ID state
          if (currentNetworkId === networkId) {
            const contractInstance = new web3Instance.eth.Contract(
              SimpleABI,
              SimpleContractAddress[networkId.toString()] // Assuming SimpleContractAddress can handle BigInt keys
            );
            console.log("Contract ABI:", SimpleABI);
            console.log(
              "Contract Address:",
              SimpleContractAddress[networkId.toString()]
            );
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

  const callContractFunction = async ({
    functionName,
    params = [],
    msgValue,
  }: ContractFunctionParams) => {
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
        setTransactionStatus("pending");
        result = await contract.methods[functionName](...params).send({
          from: window.ethereum.selectedAddress,
          value: web3.utils.toWei(msgValue.toString(), "ether"),
          gas: 41000,
        });
        setTransactionStatus("success");
      }
      console.log("Transaction result:", result);
      setError(""); // Clear error state on successful call
    } catch (error) {
      console.log("Error calling contract function:", error);
      setTransactionStatus("error");
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
      <div className="flex flex-col justify-center items-center space-y-6 bg-violet-700 h-screen w-full">
        <h1 className="text-6xl font-bold ">Transfer ETH</h1>
        {connected && (
          <p className="text-2xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">
            Wallet: {walletAddress}
          </p>
        )}
        {networkId && (
          <p className="text-xl font-semibold text-violet-700 bg-white px-4 py-2 rounded-xl">
            Network ID: {networkId.toString()}
          </p>
        )}
        <div className="text-green-600 font-semibold bg-white p-4 rounded-lg">
          Balance: {userBalance} ETH
        </div>

        <WalletConnection
          connected={connected}
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
        />
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
      </div>
      {transactionStatus === "pending" && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-black p-6 rounded-lg shadow-md">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-700"></div>
                <p className="ml-4">Transaction in progress...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {transactionStatus === "success" && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-black p-6 rounded-lg shadow-md">
              <div className="flex justify-center items-center">
                <svg
                  className="h-8 w-8 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="ml-4">Transaction successful!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {transactionStatus === "error" && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-black p-6 rounded-lg shadow-md">
              <div className="flex justify-center items-center">
                <svg
                  className="h-8 w-8 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="ml-4">Transaction failed.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Main;
