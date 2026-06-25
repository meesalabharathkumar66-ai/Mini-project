import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Maximize2, Shield, Loader2, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface PreviewModalProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  unlockVault: () => void;
  vaultPassword?: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ asset, isOpen, onClose, isUnlocked, unlockVault, vaultPassword }) => {
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && asset && (!asset.isLocked || isUnlocked)) {
      loadPreview();
    }
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [isOpen, asset, isUnlocked]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/assets/${asset._id}/stream`, {
        params: { password: vaultPassword },
        responseType: 'blob'
      });
      const url = URL.createObjectURL(res.data);
      setBlobUrl(url);
    } catch (err: any) {
      console.error('Preview error:', err);
      setError('Failed to decrypt and load asset preview.');
    } finally {
      setLoading(false);
    }
  };

  if (!asset) return null;

  const getPreviewContent = () => {
    if (!isUnlocked && asset.isLocked) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
          <div className="w-24 h-24 bg-[var(--primary-color)]/10 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_var(--primary-glow)]">
            <LockIcon size={48} color="var(--primary-color)" />
          </div>
          <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">SECURE PROTOCOL</h3>
          <p className="text-slate-500 font-medium max-w-sm">This asset is protected by secondary vault encryption. Submit master key to initialize decryption.</p>
          <button 
            onClick={unlockVault}
            className="btn-primary"
          >
            Authorize Decryption
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-[var(--primary-color)]" size={48} />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Decrypting Stream...</span>
        </div>
      );
    }

    if (error || !blobUrl) {
      return (
        <div className="text-center p-12 bg-red-500/5 rounded-3xl border border-red-500/10">
           <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
           <p className="text-red-500 font-black uppercase text-xs tracking-widest">{error || 'Unknown Error'}</p>
        </div>
      );
    }

    if (asset.mimeType.startsWith('image/')) {
      return <img src={blobUrl} alt={asset.name} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />;
    }

    if (asset.mimeType.startsWith('video/')) {
      return <video src={blobUrl} controls className="max-w-full max-h-full rounded-2xl shadow-2xl" autoPlay />;
    }

    if (asset.mimeType === 'application/pdf') {
      return <iframe src={blobUrl} className="w-full h-full rounded-2xl border-0 bg-white" title={asset.name} />;
    }

    return (
      <div className="text-center p-16 glass-card rounded-[48px] border-white/5 max-w-md w-full">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
           <FileText size={40} className="text-slate-500" />
        </div>
        <h3 className="text-xl font-black text-white mb-2 uppercase">{asset.name}</h3>
        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">Format visualization not supported. Raw payload accessible via direct extraction.</p>
        <button 
          onClick={() => {
            const a = document.createElement('a');
            a.href = blobUrl!;
            a.download = asset.originalName;
            a.click();
          }}
          className="btn-secondary w-full"
        >
          <Download size={18} /> Extract Local Copy
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full h-full glass-card rounded-[60px] flex flex-col relative z-10 border border-white/5 overflow-hidden"
          >
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white truncate max-w-md uppercase tracking-tight italic">{asset.name}</h2>
                  <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    <span className="text-[var(--primary-color)]">{asset.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                    <span>{(asset.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  className="p-4 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
                  onClick={onClose}
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-12 flex items-center justify-center bg-black/40">
              {getPreviewContent()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const LockIcon = ({ size, color }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
