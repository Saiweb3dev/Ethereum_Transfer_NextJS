import React from 'react';

interface ContractInteractionProps {
 web3: any; // Replace 'any' with a more specific type if possible
 contract: any; // Replace 'any' with a more specific type if possible
 receiverAddress: string;
 ethAmount: string;
 callContractFunction: (functionName: string, params: any[], msgValue: number) => void;
}

const ContractInteraction: React.FC<ContractInteractionProps> = ({ web3, contract, receiverAddress, ethAmount, callContractFunction }) => {
 return (
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
 );
};

export default ContractInteraction;
