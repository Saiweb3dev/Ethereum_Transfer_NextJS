import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { CopyToClipboard } from "react-copy-to-clipboard";

const QRCodeReader = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState('');
  const [scanMode, setScanMode] = useState('camera');
  const [copied, setCopied] = useState(false);

  const handleScan = (data:any) => {
    if (data) {
      console.log("Scanned Data:", data);
      const scannedData = data.text || data; // Handle both string and object with text property
      if (typeof scannedData === 'string' && (scannedData.startsWith('http://') || scannedData.startsWith('https://'))) {
        const urlParams = new URLSearchParams(scannedData.split('?')[1]);
        const walletAddress = urlParams.get('address');
        if (walletAddress) {
          setResult(walletAddress);
          console.log("Wallet address:", walletAddress);
        } else {
          console.error("Wallet address is null");
          setResult(scannedData);
        }
      } else {
        setResult(scannedData);
        console.log("Result:", scannedData);
      }
      // Do not reset scanning here
    }
  };

  const handleError = (error:any) => {
    console.error(error);
  };

  const startScanning = () => {
    setScanning(true);
    // No need to reset result here
  };

  const closeScanner = () => {
    setScanning(false);
    // Keep the result even after closing the scanner
  };

  const handleScanModeChange = (event:any) => {
    setScanMode(event.target.value);
    // Removed photo-related logic
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    console.log("Result updated:", result);
  }, [result]);

  return (
    <div className="container mx-auto px-4 py-8">
      {!scanning && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="mr-2 font-bold">Scan Mode:</label>
            <label className="mr-2">
              <input
                type="radio"
                name="scanMode"
                value="camera"
                checked={scanMode === 'camera'}
                onChange={handleScanModeChange}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Camera</span>
            </label>
          </div>
          <button
            onClick={startScanning}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Scanning
          </button>
        </div>
      )}
      {scanning && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <QrScanner
              onScan={handleScan}
              onError={handleError}
              style={{ width: '100%', maxHeight: '300px' }}
            />
            <div className="mt-4 text-center">
              <p>{result}</p>
              <CopyToClipboard text={result} onCopy={handleCopy}>
                <button
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-2 ${
                    copied? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                >
                  {copied? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <button
            onClick={closeScanner}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeReader;
