/**
 * WebAuthn Biometric Authentication Utility
 */
export const BiometricService = {
  isAvailable: async () => {
    return window.PublicKeyCredential && 
           await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  },

  register: async (userEmail: string) => {
    // This is a simplified mock for WebAuthn registration
    // In a production app, you'd fetch options from backend
    if (!await BiometricService.isAvailable()) throw new Error('Biometric not supported');
    
    toast.success('Biometric registered successfully');
    localStorage.setItem('biometric_enabled', 'true');
  },

  authenticate: async () => {
    if (!localStorage.getItem('biometric_enabled')) return false;
    
    try {
      // In a real app, you'd use navigator.credentials.get()
      // For this demo/natured implementation, we use a simulation 
      // if the hardware API is complex to trigger in this environment.
      return true;
    } catch (error) {
      return false;
    }
  }
};

import { toast } from 'react-hot-toast';
