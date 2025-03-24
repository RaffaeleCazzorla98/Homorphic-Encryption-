// src/utils/storage.js

// Function to convert Uint8Array to binary string
function arrayToString(array) {
  return String.fromCharCode.apply(null, array);
}

// Function to convert binary string to Uint8Array
function stringToArray(str) {
  const array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}

export function saveKeyToBinary(key, filename) {
  try {
    // Convert key to binary string and then to base64
    const keyString = arrayToString(key);
    const base64Key = btoa(keyString);
    
    // Save to localStorage (in a real app, this would be saved to a file)
    localStorage.setItem(filename, base64Key);
    return true;
  } catch (error) {
    console.error('Error saving key:', error);
    return false;
  }
}

export function loadKeyFromBinary(filename) {
  try {
    // Load from localStorage and convert back to Uint8Array
    const base64Key = localStorage.getItem(filename);
    if (!base64Key) return null;
    
    const keyString = atob(base64Key);
    return stringToArray(keyString);
  } catch (error) {
    console.error('Error loading key:', error);
    return null;
  }
}