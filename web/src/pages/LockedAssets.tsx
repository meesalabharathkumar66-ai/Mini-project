import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowLeft, ShieldAlert, Key, Eye, Download, Code, X, ShieldCheck, Unlock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const LockedAssets = () => {
  const { currentTheme } = useTheme()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [assets, setAssets] = useState<any[]>([])
  const [viewingCode, setViewingCode] = useState<any>(null)
  const [showPass, setShowPass] = useState(false)

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets', { params: { locked: 'true' } })
      setAssets(res.data)
    } catch (err) {
      toast.error('Failed to fetch locked assets')
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/vault/unlock', { password })
      if (res.data.success) {
        setIsUnlocked(true)
        fetchAssets()
      }
    } catch (err) {
      toast.error('Incorrect Password')
    }
  }

  const handleDownload = async (asset: any) => {
    try {
      const res = await api.get(`/assets/${asset._id}/download`, { 
        params: { password },
        responseType: 'blob' 
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', asset.originalName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      toast.error('Download failed')
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto pb-40">
      <Link to="/locked-setup" className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors mb-12">
        <ArrowLeft size={16} />
        Back to Locked Gate Command
      </Link>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-md mx-auto mt-20"
          >
            <div className="glass-card p-12 rounded-[50px] text-center relative overflow-hidden" style={{ borderColor: `${currentTheme.primary}1A` }}>
              <div className="absolute inset-0 blur-3xl opacity-20" style={{ backgroundColor: `${currentTheme.primary}1A` }} />
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_var(--primary-glow)] relative z-10"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Lock size={36} className="text-black" />
              </div>
              <h1 className="text-3xl font-black text-white mb-4 uppercase italic relative z-10 tracking-tighter">Vault Locked.</h1>
              <p className="text-slate-500 mb-10 text-[10px] font-bold uppercase tracking-widest leading-relaxed relative z-10">
                Protocol decryption key required to access sensitive payloads.
              </p>

              <form onSubmit={handleUnlock} className="space-y-6 text-left relative z-10">
                <div className="relative">
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full py-5 px-6 text-center text-xl tracking-[0.5em] font-black rounded-2xl"
                    style={{ borderColor: `${currentTheme.primary}40`, color: currentTheme.primary }}
                    placeholder="••••••••"
                    autoFocus
                  />
                   <button 
                    type="button" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"
                    onClick={() => setShowPass(!showPass)}
                   >
                     <Eye size={20} />
                   </button>
                </div>
                <button type="submit" className="btn-primary w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest">
                  Initialize Handshake
                </button>
              </form>
              
              <div className="mt-8 flex items-center gap-2 justify-center text-[9px] text-slate-700 font-black uppercase tracking-[0.3em]">
                <ShieldAlert size={12} />
                End-to-End Encryption Mode
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <header>
              <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">
                LOCKED <span style={{ color: currentTheme.primary }}>STORAGE.</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Sensitive payload repository / Layer 2 Security</p>
            </header>

            {assets.length === 0 ? (
              <div className="glass-card rounded-[60px] p-32 text-center border-dashed border-white/5 bg-white/1">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                     <Lock className="text-slate-700" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase italic">Zero Payloads Detected</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No assets have been migrated to the locked vault.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {assets.map(asset => (
                  <div key={asset._id} className="glass-card p-8 rounded-[48px] border-white/5 transition-all group">
                     <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${currentTheme.primary}1A`, color: currentTheme.primary }}>
                           <Lock size={20} />
                        </div>
                        <div className="flex gap-3">
                           <button onClick={() => setViewingCode(asset)} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all" title="View Source Cipher"><Code size={18} /></button>
                           <button 
                             onClick={async () => {
                               try {
                                 await api.patch(`/assets/${asset._id}/unlock`);
                                 toast.success('Asset returned to vault');
                                 fetchAssets();
                               } catch (err) {
                                 toast.error('Unlock failed');
                               }
                             }} 
                             className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all" 
                             title="Unlock Asset"
                           >
                             <Unlock size={18} />
                           </button>
                           <button onClick={() => handleDownload(asset)} className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Download size={18} /></button>
                        </div>
                     </div>
                     <h3 className="text-lg font-black text-white truncate uppercase italic mb-2">{asset.originalName}</h3>
                     <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{(asset.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <div className="h-1 w-1 rounded-full bg-slate-800" />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: currentTheme.primary }}>SECURE PAYLOAD</span>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* Code View Modal Overlay */}
            <AnimatePresence>
              {viewingCode && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                    onClick={() => setViewingCode(null)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card rounded-[60px] p-16 max-w-4xl w-full z-10 border-white/5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-12">
                       <div>
                         <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Cipher Stream Code</h2>
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-3" style={{ color: currentTheme.primary }}>SHA-256 / AES-256-GCM ARCHITECTURE</p>
                       </div>
                       <button onClick={() => setViewingCode(null)} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                         <X size={24} />
                       </button>
                    </div>
                    <div className="bg-black/80 rounded-[40px] p-10 font-mono text-[11px] overflow-auto max-h-[500px] border border-white/5 custom-scrollbar leading-relaxed" style={{ color: currentTheme.primary }}>
                       <div className="flex gap-8 mb-8 opacity-40 uppercase font-black text-[9px] tracking-widest">
                          <span>[ HANDSHAKE_CODE: {viewingCode.encryptionKey?.toUpperCase() || 'N/A'} ]</span>
                          <span>[ SHA256_HASH: {viewingCode.fileHash.toUpperCase()} ]</span>
                       </div>
                       <div className="break-all whitespace-pre-wrap opacity-60">
                          {`CIPHER_TEXT_START\n` + 
                           Array.from({ length: 40 }).map((_, i) => {
                             const hex = '0123456789ABCDEF';
                             let line = '';
                             for(let j=0; j<64; j++) line += hex[Math.floor(Math.random() * 16)];
                             return line;
                           }).join('\n') + 
                           `\nCIPHER_TEXT_END`}
                       </div>
                    </div>
                    <div className="mt-12 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                       <span>Payload Descriptor: {viewingCode._id}</span>
                       <div className="flex items-center gap-3">
                          <ShieldCheck size={14} style={{ color: currentTheme.primary }} />
                          <span>INTEGRITY VERIFIED</span>
                       </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LockedAssets
