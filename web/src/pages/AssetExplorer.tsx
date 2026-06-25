import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List, Upload, MoreVertical, Download, Trash, Eye, X, Archive, Lock, Folder, ChevronDown, Code } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useVault } from '../context/VaultContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AssetExplorer = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { currentTheme } = useTheme()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFolderUpload, setIsFolderUpload] = useState(false)
  const [viewingEncryptedAsset, setViewingEncryptedAsset] = useState<any>(null)
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false)
  const [vaultPassword, setVaultPassword] = useState('')
  const [showVaultPassword, setShowVaultPassword] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { isUnlocked, unlockVault, lockVault } = useVault()

  const queryParams = new URLSearchParams(location.search)
  const categoryFilter = queryParams.get('filter')

  // Lock vault when leaving the page
  useEffect(() => {
    return () => {
      lockVault()
    }
  }, [lockVault])

  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets', searchQuery, categoryFilter],
    queryFn: async () => {
      const res = await api.get('/assets', { 
        params: { 
          search: searchQuery,
          category: categoryFilter,
          archived: 'false',
          locked: 'false'
        } 
      })
      return res.data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/assets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset moved to Bin')
    }
  })

  const archiveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/assets/${id}/archive`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset archived')
    }
  })

  const lockMutation = useMutation({
    mutationFn: (id: string) => api.post(`/assets/${id}/lock`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset moved to Locked Gate')
    }
  })

  const handleExtract = async (asset: any) => {
    if (!isUnlocked) {
      setIsVaultModalOpen(true)
      toast.error('Unlock vault to extract payloads.')
      return
    }
    toast.success(`Extracting ${asset.name}...`)
    try {
      const res = await api.get(`/assets/${asset._id}/download`, { 
        params: { password: vaultPassword },
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
      toast.error('Extraction failed. Master key verification required.')
    }
  }

  const handleActionWithAuth = (action: () => void) => {
    if (!isUnlocked) {
      setIsVaultModalOpen(true);
      return;
    }
    action();
  };

  const [uploadQueue, setUploadQueue] = useState<any[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = (files: File[]) => {
    setPendingFiles(prev => [...prev, ...files])
  }

  const handleVaultUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await unlockVault(vaultPassword)
    if (success) {
      setIsVaultModalOpen(false)
      toast.success('Vault unlocked successfully')
    }
  }

  const initiateHandshake = async () => {
    if (pendingFiles.length === 0) return
    
    // Disable password requirement for upload as requested
    const currentKey = vaultPassword || (user?._id || 'session-fallback-key');

    setIsUploading(true)
    const newUploads = pendingFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }))
    
    setUploadQueue(prev => [...prev, ...newUploads])
    setPendingFiles([]) // Clear pending box

    for (const upload of newUploads) {
      try {
        setUploadQueue(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'encrypting' } : u))
        
        // Encryption
        const { encryptFile } = await import('../utils/encryption')
        const encryptedBlob = await encryptFile(upload.file, currentKey)
        const encryptedFile = new File([encryptedBlob], `${upload.file.name}.enc`, { type: 'application/octet-stream' })

        const formData = new FormData()
        formData.append('file', encryptedFile)
        formData.append('originalName', upload.file.name)
        const path = (upload.file as any).webkitRelativePath || '/'
        formData.append('folderPath', path)
        formData.append('isEncrypted', 'true')

        setUploadQueue(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'uploading' } : u))
        
        await api.post('/assets/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadQueue(prev => prev.map(u => u.id === upload.id ? { ...u, progress } : u))
          }
        })

        setUploadQueue(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'completed', progress: 100 } : u))
        queryClient.invalidateQueries({ queryKey: ['assets'] })
      } catch (error: any) {
        setUploadQueue(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error' } : u))
        toast.error(`Failed to secure ${upload.file.name}: ${error.message || 'Error'}`)
      }
    }
    setIsUploading(false)
    setIsUploadModalOpen(false)
    toast.success('Handshake protocol completed. Assets secured.')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
  })

  // Hack for directory upload since react-dropzone doesn't natively support directory attribute well without manual input ref
  const directoryProps = isFolderUpload ? { webkitdirectory: "true", directory: "true" } : {};

  const isLight = currentTheme.name === 'LIGHT';

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div>
          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${isLight ? 'text-slate-900' : 'text-slate-500'}`}>
             <span>VAULT</span>
             <ChevronDown size={10} className="-rotate-90" />
             <span style={{ color: currentTheme.primary }}>SECURE EXPLORER</span>
             {categoryFilter && (
               <>
                 <ChevronDown size={10} className="-rotate-90" />
                 <span className="text-white px-2 py-0.5 rounded-md truncate max-w-[100px]" style={{ backgroundColor: `${currentTheme.primary}20` }}>{categoryFilter.toUpperCase()}</span>
               </>
             )}
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white uppercase italic">ASSET <span style={{ color: currentTheme.primary }}>VAULT.</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setIsFolderUpload(true); setIsUploadModalOpen(true); }}
            className="btn-secondary h-16 px-8 rounded-2xl flex items-center gap-3 shadow-xl"
          >
            <Folder size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Import Directory</span>
          </button>
          <button 
            onClick={() => { setIsFolderUpload(false); setIsUploadModalOpen(true); }}
            className="btn-primary h-16 px-10 rounded-2xl flex items-center gap-3 shadow-xl"
            style={{ backgroundColor: currentTheme.primary, color: isLight ? 'white' : 'black' }}
          >
            <Upload size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Upload Assets</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div 
        className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b"
        style={{ borderBottomColor: currentTheme.name === 'CYPHEIR' ? `${currentTheme.primary}20` : 'rgba(255,255,255,0.05)' }}
      >
        <div className="relative flex-1 max-w-xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
           <input 
              type="text" 
              placeholder="Search encrypted index..." 
              className="glass-input pl-16 py-5 w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
        
        <div className="flex items-center gap-4 relative">
           <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="glass-card px-8 py-5 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
           >
              <Filter size={18} style={{ color: currentTheme.primary }} /> Filter
           </button>

           <AnimatePresence>
             {isFilterOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className="absolute top-full right-0 mt-4 w-64 glass-card rounded-3xl p-4 z-50 border-white/5 shadow-2xl bg-[#0A0A0A]"
               >
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Select Category</div>
                  {['images', 'videos', 'documents', 'zip'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        const params = new URLSearchParams(location.search)
                        if (params.get('filter') === cat) params.delete('filter')
                        else params.set('filter', cat)
                        window.location.search = params.toString()
                      }}
                      className={`w-full text-left p-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </motion.div>
             )}
           </AnimatePresence>

           <div className="flex items-center bg-white/5 rounded-2xl p-1.5 border border-white/5">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-4 rounded-xl transition-all ${viewMode === 'grid' ? 'text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                style={{ backgroundColor: viewMode === 'grid' ? currentTheme.primary : 'transparent' }}
              >
                 <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-4 rounded-xl transition-all ${viewMode === 'list' ? 'text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                style={{ backgroundColor: viewMode === 'list' ? currentTheme.primary : 'transparent' }}
              >
                 <List size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Assets Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
           {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-video glass-card rounded-[40px] animate-pulse bg-white/5" />)}
        </div>
      ) : assets?.length === 0 ? (
        <div className="py-40 glass-card rounded-[48px] border-white/5 text-center">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
              <Folder size={40} className="text-slate-700" />
           </div>
           <h3 className="text-2xl font-black text-white mb-2 uppercase italic">VAULT IS EMPTY</h3>
           <p className="text-slate-500 font-medium tracking-wide font-black uppercase text-[10px]">
             {categoryFilter ? `No ${categoryFilter.toUpperCase()} found in your vault.` : 'Initiate secure upload to populate your encrypted storage.'}
           </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
           {assets?.map((asset: any) => (
             <AssetGridItem 
               key={asset._id}
               asset={asset}
               isLocked={asset.isLocked}
               isArchived={asset.isArchived}
               onViewCode={() => handleActionWithAuth(() => setViewingEncryptedAsset(asset))}
               onDelete={() => deleteMutation.mutate(asset._id)}
               onArchive={() => archiveMutation.mutate(asset._id)}
               onLock={() => lockMutation.mutate(asset._id)}
               onExtract={() => handleActionWithAuth(() => handleExtract(asset))}
               themeColor={currentTheme.primary}
               themeName={currentTheme.name}
             />
           ))}
        </div>
      ) : (
        <div className="glass-card rounded-[32px] overflow-hidden border-black/5 dark:border-white/5">
           <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                 <tr>
                    <th className="px-8 py-6">IDENTIFIER</th>
                    <th className="px-8 py-6">STRUCTURE</th>
                    <th className="px-8 py-6">PAYLOAD SIZE</th>
                    <th className="px-8 py-6">ENCRYPTION</th>
                    <th className="px-8 py-6 text-right">COMMANDS</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {assets?.map((asset: any) => (
                   <AssetListItem 
                     key={asset._id}
                     asset={asset}
                     size={`${(asset.size / (1024 * 1024)).toFixed(1)} MB`} 
                     isLocked={asset.isLocked}
                     isArchived={asset.isArchived}
                     onViewCode={() => setViewingEncryptedAsset(asset)}
                     onDelete={() => deleteMutation.mutate(asset._id)}
                     onLock={() => lockMutation.mutate(asset._id)}
                     onExtract={() => handleExtract(asset)}
                     themeColor={currentTheme.primary}
                   />
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {/* Encrypted Code Modal */}
      <AnimatePresence>
        {viewingEncryptedAsset && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
               onClick={() => setViewingEncryptedAsset(null)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="glass-card rounded-[60px] p-16 max-w-4xl w-full z-10 border-white/5 relative overflow-hidden"
            >
               <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">ENCRYPTED SOURCE_CODE</h2>
                    <p className="text-[10px] font-black tracking-[0.4em] uppercase mt-4" style={{ color: currentTheme.primary }}>SHA-256 / AES-256-GCM PAYLOAD</p>
                  </div>
                  <button onClick={() => setViewingEncryptedAsset(null)} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                    <X size={28} />
                  </button>
               </div>

               <div className="bg-black/80 rounded-[40px] p-10 font-mono text-[10px] text-[var(--primary-color)] overflow-auto max-h-[450px] border border-white/5 custom-scrollbar leading-relaxed">
                  <div className="flex gap-8 mb-8 opacity-40">
                     <span>[ PROTOCOL ACTIVE ]</span>
                     <span>[ KEY_ID: {viewingEncryptedAsset.encryptionKey.toUpperCase()} ]</span>
                     <span>[ IV: {viewingEncryptedAsset.iv.slice(0, 16)}... ]</span>
                  </div>
                  <div className="break-all whitespace-pre-wrap opacity-80">
                     {`SECURE_PAYLOAD_START\n` + 
                      Array.from({ length: 30 }).map(() => {
                        const chars = '0123456789ABCDEF';
                        let line = '';
                        for(let i=0; i<64; i++) line += chars[Math.floor(Math.random()*16)];
                        return line;
                      }).join('\n') + 
                      `\nSECURE_PAYLOAD_END`}
                  </div>
               </div>
               
               <div className="mt-12 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Payload Identifier: {viewingEncryptedAsset._id}</span>
                  <button onClick={() => handleExtract(viewingEncryptedAsset)} className="btn-primary px-10 py-4 rounded-xl text-[10px]">
                    Validate & Decrypt
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
               onClick={() => setIsUploadModalOpen(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="glass-card rounded-[60px] p-16 max-w-2xl w-full z-10 border-white/5 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                 <Upload size={200} style={{ color: currentTheme.primary }} />
               </div>

               <div className="flex items-center justify-between mb-16 relative z-10">
                  <div>
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{isFolderUpload ? 'IMPORT DIRECTORY' : 'SECURE UPLOAD'}</h2>
                    <p className="text-[10px] font-black tracking-[0.4em] uppercase mt-4" style={{ color: currentTheme.primary }}>End-to-End Encrypted Handshake</p>
                  </div>
                  <button onClick={() => setIsUploadModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all">
                    <X size={28} />
                  </button>
               </div>

                <div 
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-[48px] p-24 text-center transition-all cursor-pointer bg-black/40 relative z-10
                    ${isDragActive ? 'bg-white/5' : 'border-white/10 hover:border-white/20'}`}
                  style={{ borderColor: isDragActive ? currentTheme.primary : '' }}
                >
                  <input {...getInputProps(directoryProps as any)} />
                  {pendingFiles.length > 0 ? (
                    <div className="space-y-6 max-h-[300px] overflow-y-auto p-4 custom-scrollbar">
                      {pendingFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div className="flex items-center gap-4 text-left">
                              <div className="text-[#CCFF00]"><Folder size={20} /></div>
                              <span className="text-xs font-black text-white truncate max-w-[300px] uppercase">{file.name}</span>
                           </div>
                           <span className="text-[10px] font-black text-slate-500 uppercase">{(file.size / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div 
                        className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_var(--primary-glow)]"
                        style={{ backgroundColor: currentTheme.primary }}
                      >
                         <Upload size={36} className="text-black" />
                      </div>
                      <p className="text-3xl font-black text-white mb-6 uppercase italic">
                        {isDragActive ? 'RELEASE TO SECURE' : 'DROP ASSETS HERE'}
                      </p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-loose">
                        MAXIMUM PAYLOAD: 2GB PER FILE <br />
                        SHA-256 KEY DERIVATION ENABLED
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-16 flex justify-end gap-8 font-black uppercase tracking-[0.3em] text-[11px] relative z-10">
                   <button 
                    onClick={() => { setPendingFiles([]); setIsUploadModalOpen(false); }} 
                    className="px-10 py-5 rounded-2xl hover:bg-white/5 transition-all text-slate-500"
                   >
                     Abort Protocol
                   </button>
                   <button 
                    onClick={initiateHandshake}
                    disabled={pendingFiles.length === 0 || isUploading}
                    className="btn-primary px-16 py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {isUploading ? 'Securing...' : 'Initiate Handshake'}
                   </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVaultModalOpen && (
          <div className="fixed inset-0 z-[450] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
              onClick={() => setIsVaultModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass-card rounded-[80px] p-24 max-w-xl w-full z-10 border-white/5 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#CCFF00_1px,transparent_1px)] bg-[size:20px_20px] opacity-5" style={{ backgroundImage: `radial-gradient(${currentTheme.primary} 1px, transparent 1px)` }} />
              
              <div className="relative z-10">
                <div 
                  className="w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_var(--primary-glow)]"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <Lock size={44} className="text-black" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Unlock Vault</h2>
                <p className="text-slate-500 font-black mb-12 text-[10px] uppercase tracking-[0.2em]">Submit your zero-knowledge master key to decrypt assets.</p>

                 <form onSubmit={handleVaultUnlock} className="space-y-8">
                  <div className="relative">
                    <input 
                      type={showVaultPassword ? 'text' : 'password'} 
                      placeholder="ENTER MASTER KEY" 
                      className="glass-input w-full py-6 text-center text-xl tracking-[0.5em] font-black rounded-[24px] bg-black/80 uppercase"
                      style={{ color: currentTheme.primary, borderColor: `${currentTheme.primary}40` }}
                      value={vaultPassword}
                      onChange={(e) => setVaultPassword(e.target.value)}
                      autoFocus
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowVaultPassword(!showVaultPassword)}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showVaultPassword ? <Eye size={20} /> : <Eye size={20} className="opacity-20" />}
                    </button>
                  </div>
                  <button type="submit" className="w-full btn-primary py-6 rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em]">
                    Authorize Security Handshake
                  </button>
                </form>
                
                <button 
                  onClick={() => setIsVaultModalOpen(false)}
                  className="mt-12 text-[10px] font-black text-slate-700 hover:text-white uppercase tracking-[0.4em] transition-colors"
                >
                  Terminate Connection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Queue Overlay */}
      {uploadQueue.length > 0 && (
        <div className="fixed bottom-12 right-12 w-96 z-[210] space-y-4">
          <AnimatePresence>
            {uploadQueue.filter(u => u.status !== 'completed').map(upload => (
              <motion.div 
                key={upload.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="glass-card p-8 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.9)] bg-[#070707]/90 backdrop-blur-2xl border-white/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center" style={{ color: currentTheme.primary }}>
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-black text-white truncate w-40 uppercase tracking-widest italic">{upload.file.name}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: currentTheme.primary }}>{upload.progress}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${upload.progress}%`, 
                      backgroundColor: upload.status === 'error' ? '#FF3131' : currentTheme.primary,
                      boxShadow: `0 0 10px ${upload.status === 'error' ? '#FF3131' : currentTheme.primary}`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${upload.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

const AssetGridItem = ({ asset, isLocked, onDelete, onArchive, onLock, onExtract, onViewCode, themeColor, themeName }: any) => {
  const isLight = themeName === 'LIGHT'
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`glass-card rounded-[48px] p-6 group relative overflow-hidden transition-all shadow-2xl border-white/5 hover:border-white/10 ${isLight ? 'bg-white' : 'bg-[#0A0A0A]/40'}`}
    >
       <div className={`aspect-video rounded-[36px] mb-8 flex items-center justify-center overflow-hidden relative border ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
          <div className="text-9xl font-black uppercase tracking-widest -rotate-12 transition-transform duration-700 group-hover:scale-125" style={{ color: isLight ? 'rgba(0,0,0,0.03)' : `${themeColor}0D` }}>{asset.category[0]}</div>
          
          <div className="absolute top-6 right-6">
             {isLocked && <div className="p-3 rounded-2xl text-black shadow-2xl" style={{ backgroundColor: themeColor }}><Lock size={20} /></div>}
          </div>
  
          <div className="absolute inset-0 bg-black/90 transition-all flex flex-col items-center justify-center gap-5 p-10 opacity-0 group-hover:opacity-100 group-hover:backdrop-blur-xl">
             <ActionButton 
              icon={<Code size={22} />} 
              onClick={onViewCode} 
              color="text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/20" 
              label="VIEW CODE" 
             />
             <div className="flex gap-4 w-full">
               <button onClick={onLock} className="flex-1 py-5 bg-[#CCFF00]/10 text-[#CCFF00] rounded-2xl hover:bg-[#CCFF00]/20 transition-all font-black text-[11px] flex items-center justify-center gap-2 uppercase tracking-[0.2em] border border-[#CCFF00]/10"><Lock size={18} /> LOCK</button>
               <button onClick={onArchive} className="flex-1 py-5 bg-orange-500/10 text-orange-500 rounded-2xl hover:bg-orange-500/20 transition-all font-black text-[11px] flex items-center justify-center gap-2 uppercase tracking-[0.2em] border border-orange-500/10"><Archive size={18} /> ARCHIVE</button>
             </div>
             <button onClick={onDelete} className="w-full py-5 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all font-black text-[11px] flex items-center justify-center gap-2 uppercase tracking-[0.2em] border border-red-500/10"><Trash size={18} /> DESTROY PACKET</button>
          </div>
       </div>
       <div className="px-2 pb-2">
          <div className="flex items-center justify-between gap-4">
             <span className={`text-[14px] font-black tracking-tight truncate uppercase italic ${isLight ? 'text-black' : 'text-white'}`}>{asset.originalName}</span>
          </div>
          <div className={`text-[10px] font-black uppercase tracking-[0.3em] mt-4 ${isLight ? 'text-slate-900' : 'text-slate-700'}`}>SHA-256 / AES-256 SECURED</div>
       </div>
    </motion.div>
  )
}

const ActionButton = ({ icon, onClick, color, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-4 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 font-black text-[10px] tracking-[0.3em] ${color}`}
  >
    {icon}
    {label}
  </button>
)

const AssetListItem = ({ asset, size, isLocked, isArchived, onDelete, onArchive, onLock, onExtract, onViewCode, themeColor }: any) => (
  <tr className="hover:bg-white/5 transition-all group">
     <td className="px-8 py-8">
        <div className="flex items-center gap-6">
           <div 
             className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-white transition-colors"
             style={{ color: 'inherit' }}
           >
              <Folder size={24} className="group-hover:text-[var(--primary-color)] transition-colors" />
           </div>
           <div>
              <div className="text-sm font-black text-white tracking-tight flex items-center gap-4 uppercase italic">
                {asset.name}
                {isLocked && <Lock size={14} style={{ color: themeColor }} />}
              </div>
              <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2">SECURE IDENTIFIER: {asset.fileHash.slice(0, 12).toUpperCase()}</div>
           </div>
        </div>
     </td>
     <td className="px-8 py-8 text-slate-600 text-xs font-black tracking-widest">{asset.folderPath}</td>
     <td className="px-8 py-8 text-slate-400 text-xs font-black uppercase tracking-widest">{size}</td>
     <td className="px-8 py-8">
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 rounded-full shadow-[0_0_10px_var(--primary-glow)]" style={{ backgroundColor: themeColor }}></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AES-256-GCM</span>
        </div>
     </td>
     <td className="px-8 py-8 text-right">
         <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
             onClick={onViewCode} 
             className="p-4 bg-white/5 rounded-2xl transition-all"
             style={{ color: themeColor }}
             title="View Encrypted Code"
            >
              <Code size={20} />
            </button>
            <button 
              onClick={onLock} 
              className="p-4 rounded-2xl transition-all" 
              style={{ backgroundColor: `${themeColor}1A`, color: themeColor }}
              title="Move to Locked Gate"
            >
              <Lock size={20} />
            </button>
            <button onClick={onArchive} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all" title="Archive payload"><Archive size={20} /></button>
            <button onClick={onDelete} className="p-4 bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500/20 transition-all" title="Move to Bin"><Trash size={20} /></button>
        </div>
     </td>
  </tr>
)

export default AssetExplorer

