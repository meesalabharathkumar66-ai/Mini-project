import CryptoJS from 'crypto-js';

export const encryptFile = async (file: File, password: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return reject(new Error('Failed to read file'));

      // Use SHA-256 to derive a 256-bit key from the password
      const key = CryptoJS.SHA256(password).toString();
      
      // Convert ArrayBuffer to CryptoJS word array
      const wordArray = CryptoJS.lib.WordArray.create(data as ArrayBuffer);
      
      // Encrypt
      const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
      
      // Convert to Blob (we'll store it as a .enc file or just raw text)
      const blob = new Blob([encrypted], { type: 'application/octet-stream' });
      resolve(blob);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const decryptData = (encryptedData: string, password: string): string => {
  const key = CryptoJS.SHA256(password).toString();
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
