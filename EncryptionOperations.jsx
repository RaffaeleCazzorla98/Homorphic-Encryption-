// src/components/EncryptionOperations.jsx
import React from 'react';
import { useCrypto } from '../context/CryptoContext';

function EncryptionOperations() {
  const { 
    selectedFile,
    encryptFile,
    decryptFile,
    evaluateData,
    isProcessing,
    keysGenerated,
    encryptedData,
    downloadEncryptedFile
  } = useCrypto();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Encryption Operations</h2>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={encryptFile}
          disabled={!selectedFile || !keysGenerated || isProcessing}
          className={`px-4 py-2 rounded-md text-white font-medium
            ${(!selectedFile || !keysGenerated || isProcessing)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isProcessing ? 'Encrypting...' : 'Encrypt File'}
        </button>

        {encryptedData && (
          <button
            onClick={downloadEncryptedFile}
            className="px-4 py-2 rounded-md text-white font-medium bg-blue-500 hover:bg-blue-600"
          >
            Download Encrypted File
          </button>
        )}

        <div className="flex gap-4">
          <button
            onClick={decryptFile}
            disabled={!selectedFile || !keysGenerated || isProcessing}
            className={`px-4 py-2 rounded-md text-white font-medium
              ${(!selectedFile || !keysGenerated || isProcessing)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'}`}
          >
            Decrypt File
          </button>

          <button
            onClick={evaluateData}
            disabled={!selectedFile || !keysGenerated || isProcessing}
            className={`px-4 py-2 rounded-md text-white font-medium
              ${(!selectedFile || !keysGenerated || isProcessing)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            Evaluate Data
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="text-gray-600">
          Processing... Please wait
        </div>
      )}
    </div>
  );
}

export default EncryptionOperations;