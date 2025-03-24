// src/App.jsx
import React from 'react';
import { CryptoProvider } from './context/CryptoContext.jsx';
import FileUpload from './components/FileUpload';
import KeyManagement from './components/KeyManagement';
import EncryptionOperations from './components/EncryptionOperations';

function App() {
  return (
    <CryptoProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Homomorphic Encryption Interface
          </h1>
        </header>
        
        <main className="space-y-8">
          <section className="bg-white rounded-lg shadow p-6">
            <KeyManagement />
          </section>
          
          <section className="bg-white rounded-lg shadow p-6">
            <FileUpload />
          </section>
          
          <section className="bg-white rounded-lg shadow p-6">
            <EncryptionOperations />
          </section>
        </main>
      </div>
    </CryptoProvider>
  );
}

export default App;