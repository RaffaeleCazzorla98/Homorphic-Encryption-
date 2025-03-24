# app.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from base64 import b64encode, b64decode
import numpy as np
from crypto_ops import (
    generate_keys,
    encrypt_data,
    decrypt_data,
    evaluate_data,
    save_key,
    load_key
)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-keys")
async def generate_keys_endpoint():
    try:
        public_key, private_key, evaluation_key = generate_keys()
        
        # Save keys to binary files
        save_key(private_key, "private_key.bin")
        save_key(evaluation_key, "evaluation_key.bin")
        
        # Only return the public key
        return {
            "publicKey": b64encode(public_key.tobytes()).decode('utf-8'),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/encrypt")
async def encrypt_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        data = np.frombuffer(content, dtype=np.uint8)
        
        # Load public key
        public_key = load_key("public_key.bin")
        
        # Encrypt data
        encrypted_data = encrypt_data(data, public_key)
        
        # Convert encrypted data to base64
        encrypted_base64 = b64encode(encrypted_data.tobytes()).decode('utf-8')
        
        return JSONResponse(content={"encryptedData": encrypted_base64})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/decrypt")
async def decrypt_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        encrypted_data = np.frombuffer(content, dtype=np.uint8)
        
        # Load private key
        private_key = load_key("private_key.bin")
        
        # Decrypt data
        decrypted_data = decrypt_data(encrypted_data, private_key)
        
        return JSONResponse(content={
            "decryptedData": b64encode(decrypted_data.tobytes()).decode('utf-8')
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        encrypted_data = np.frombuffer(content, dtype=np.uint8)
        
        # Load evaluation key
        evaluation_key = load_key("evaluation_key.bin")
        
        # Perform homomorphic operation
        evaluated_data = evaluate_data(encrypted_data, evaluation_key)
        
        return JSONResponse(content={
            "evaluatedData": b64encode(evaluated_data.tobytes()).decode('utf-8')
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)