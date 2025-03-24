// src/context/CryptoContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { generateKeyPair, encryptData, decryptData, evaluateData as evaluateEncryptedData } from '../utils/crypto';
import { saveKeyToBinary, loadKeyFromBinary } from '../utils/storage';

const CryptoContext = createContext(null);

export function CryptoProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [evaluationKey, setEvaluationKey] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [encryptedData, setEncryptedData] = useState(null);

  const generateKeys = useCallback(async () => {
    try {
      setIsGeneratingKeys(true);
      const keys = await generateKeyPair();
      
      // Store keys in state
      setPublicKey(keys.publicKey);
      setPrivateKey(keys.privateKey);
      setEvaluationKey(keys.evaluationKey);
      
      // Save keys to storage
      if (keys.privateKey) {
        saveKeyToBinary(keys.privateKey, 'private_key.bin');
      }
      if (keys.evaluationKey) {
        saveKeyToBinary(keys.evaluationKey, 'evaluation_key.bin');
      }
    } catch (error) {
      console.error('Error generating keys:', error);
    } finally {
      setIsGeneratingKeys(false);
    }
  }, []);

  const uploadFile = useCallback((file) => {
    setSelectedFile(file);
    setEncryptedData(null); // Reset encrypted data when new file is uploaded
  }, []);

  const downloadEncryptedFile = useCallback((data, fileName) => {
    try {
      // Create blob and trigger download
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }, []);

  const encryptFile = useCallback(async () => {
    if (!selectedFile || !publicKey) {
      console.log('Missing file or public key');
      return;
    }
    
    try {
      setIsProcessing(true);
      const fileContent = await selectedFile.text();
      const encrypted = await encryptData(fileContent, publicKey);
      setEncryptedData(encrypted);
      
      // Automatically trigger download of encrypted file
      downloadEncryptedFile(encrypted, `${selectedFile.name}.encrypted`);
    } catch (error) {
      console.error('Error encrypting file:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, publicKey, downloadEncryptedFile]);

  const decryptFile = useCallback(async () => {
    if (!selectedFile || !privateKey) {
      console.log('Missing file or private key');
      return;
    }
    
    try {
      setIsProcessing(true);
      const fileContent = await selectedFile.text();
      const decrypted = await decryptData(fileContent, privateKey);
      
      // Download decrypted file
      downloadEncryptedFile(decrypted, selectedFile.name.replace('.encrypted', '.decrypted'));
    } catch (error) {
      console.error('Error decrypting file:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, privateKey, downloadEncryptedFile]);

  const evaluateData = useCallback(async () => {
    if (!selectedFile || !evaluationKey) {
      console.log('Missing file or evaluation key');
      return;
    }
    
    try {
      setIsProcessing(true);
      const fileContent = await selectedFile.text();
      const evaluated = await evaluateEncryptedData(fileContent, evaluationKey);
      
      // Download evaluated file
      downloadEncryptedFile(evaluated, `${selectedFile.name}.evaluated`);
    } catch (error) {
      console.error('Error evaluating data:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, evaluationKey, downloadEncryptedFile]);

  return (
    <CryptoContext.Provider value={{
        publicKey,
        keysGenerated: !!publicKey,
        selectedFile,
        isProcessing,
        isGeneratingKeys,
        encryptedData,
        generateKeys,
        uploadFile,
        encryptFile,
        decryptFile,
        evaluateData,
        downloadEncryptedFile
      }}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}