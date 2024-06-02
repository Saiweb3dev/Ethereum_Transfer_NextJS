"use client"
import React, { useState, useEffect } from 'react';

interface NetworkDropdownProps {
  initialNetworkId: string;
  onNetworkChange: (networkId: number) => void;
}

const NetworkDropdown: React.FC<NetworkDropdownProps> = ({ initialNetworkId, onNetworkChange }) => {
  const [selectedNetworkId, setSelectedNetworkId] = useState(initialNetworkId);

  useEffect(() => {
    setSelectedNetworkId(initialNetworkId);
  }, [initialNetworkId]);

  // Mapping network IDs to their names
  const networkNames = {
    1: 'Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    42: 'Kovan',
    11155111: 'Sepolia',
    // Add more networks as needed
  };

  // Generate options dynamically based on the networkNames object
  const networkOptions = Object.entries(networkNames).map(([id, name]) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetworkId = parseInt(event.target.value, 10);
    setSelectedNetworkId(event.target.value);
    onNetworkChange(newNetworkId);
  };

  return (
    <select className='bg-neon text-black p-2 rounded-lg' value={selectedNetworkId} onChange={handleChange}>
      {networkOptions}
    </select>
  );
};

export default NetworkDropdown;
