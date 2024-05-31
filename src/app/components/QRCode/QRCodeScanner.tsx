import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRCodeReader = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState('');
  const [scanMode, setScanMode] = useState('camera');
  const [photoFile, setPhotoFile] = useState(null);

  const handleScan = (data:any) => {
    if (data) {
      setResult(data);
      setScanning(false);
    }
  };

  const handleError = (error:any) => {
    console.error(error);
  };

  const startScanning = () => {
    setScanning(true);
    setResult('');
  };

  const closeScanner = () => {
    setScanning(false);
    setResult('');
    setPhotoFile(null);
  };

  const handleScanModeChange = (event:any) => {
    setScanMode(event.target.value);
    setPhotoFile(null);
  };

  const handlePhotoUpload = (event:any) => {
    const file = event.target.files[0];
    setPhotoFile(file);
  };

  return (
    <div>
      {!scanning && (
        <div>
          <div className="mb-4">
            <label className="mr-2">Scan Mode:</label>
            <label className="mr-2">
              <input
                type="radio"
                name="scanMode"
                value="camera"
                checked={scanMode === 'camera'}
                onChange={handleScanModeChange}
              />
              Camera
            </label>
            <label>
              <input
                type="radio"
                name="scanMode"
                value="photo"
                checked={scanMode === 'photo'}
                onChange={handleScanModeChange}
              />
              Photo
            </label>
          </div>
          {scanMode === 'photo' && (
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>
          )}
          <button
            onClick={startScanning}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={scanMode === 'photo' && !photoFile}
          >
            Scan QR Code
          </button>
        </div>
      )}
      {scanning && (
        <div>
          <QrScanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
          <p>{result}</p>
          <button
            onClick={closeScanner}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Close Scanner
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeReader;