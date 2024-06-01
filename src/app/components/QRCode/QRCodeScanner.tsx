import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { CopyToClipboard } from "react-copy-to-clipboard";

const QRCodeReader = () => {
  // State variables to manage scanning status, scan result, and copied status
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  // Handle the scanned data
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

  // Handle errors during scanning
  const handleError = (error:any) => {
    console.error(error);
  };

  // Start the scanning process
  const startScanning = () => {
    setScanning(true);
    // No need to reset result here
  };

  // Stop the scanning process and reset the result
  const closeScanner = () => {
    setScanning(false);
    setResult(''); // Reset the result when stopping the scan
  };

  // Handle the copy action and display a temporary confirmation
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Log the updated result whenever it changes
  useEffect(() => {
    console.log("Result updated:", result);
  }, [result]);

  return (
    <div className="max-w-md container mx-auto px-4 py-8">
      {!scanning ? (
        // Display the start scanning button if not currently scanning
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <button
            onClick={startScanning}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Start Scanning
          </button>
        </div>
      ) : (
        // Display the QR scanner and result if currently scanning
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="relative w-full">
            <QrScanner
              onScan={handleScan}
              onError={handleError}
              className="w-full max-h-72"
            />
            <div className="mt-4 text-center">
              <p className="text-black">{result}</p>
              <CopyToClipboard text={result} onCopy={handleCopy}>
                <button
                  className={`bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded mt-2 transition duration-300 ${
                    copied ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <button
            onClick={closeScanner}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
          >
            Stop Scanning
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeReader;
