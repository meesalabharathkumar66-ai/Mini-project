import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface VaultContextType {
  isUnlocked: boolean;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  vaultKey: string | null;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultKey, setVaultKey] = useState<string | null>(null);

  // Auto-lock vault on visibility change or navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Optional: lockVault(); // Might be too aggressive for general usage, but good for high security
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const unlockVault = async (password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/vault/unlock', { password });
      if (response.data.success) {
        setIsUnlocked(true);
        setVaultKey(response.data.vaultKey);
        toast.success('Vault unlocked');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unlock vault');
      return false;
    }
  };

  const lockVault = () => {
    setIsUnlocked(false);
    setVaultKey(null);
    toast.dismiss();
    toast('Vault locked', { icon: '🔒' });
  };

  return (
    <VaultContext.Provider value={{ isUnlocked, unlockVault, lockVault, vaultKey }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
