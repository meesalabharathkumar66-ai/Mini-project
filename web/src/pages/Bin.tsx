import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { motion } from 'framer-motion'
import { Trash, RefreshCcw, HardDrive, ShieldAlert, Folder, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const Bin = () => {
  const queryClient = useQueryClient()

  const { data: assets, isLoading } = useQuery({
    queryKey: ['bin'],
    queryFn: async () => {
      const res = await api.get('/assets/bin')
      return res.data
    }
  })

  const restoreMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/assets/${id}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin'] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset restored to vault')
    }
  })

  const permanentDeleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/assets/${id}/permanent`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bin'] })
      toast.success('Asset permanently erased')
    }
  })

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">
             <span>VAULT</span>
             <ChevronDown size={10} className="-rotate-90" />
             <span className="text-red-500">SECURE DISPOSAL BIN</span>
        </div>
        <h1 className="text-5xl font-black font-sans tracking-tight text-white mb-4">
          RECYCLE <span className="text-red-500">BIN.</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl">
          Purgatory for your encrypted assets. Restore them to the primary vault or initiate permanent data shredding.
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
           {[1,2,3,4,5].map(i => <div key={i} className="aspect-square glass-card rounded-[32px] animate-pulse bg-white/5" />)}
        </div>
      ) : assets?.length === 0 ? (
        <div className="py-40 glass-card rounded-[48px] border-white/5 text-center">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
              <Trash size={40} className="text-slate-800" />
           </div>
           <h3 className="text-2xl font-black text-white mb-2">BIN IS EMPTY</h3>
           <p className="text-slate-500 font-medium tracking-wide">No assets currently pending disposal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
           {assets?.map((asset: any) => (
             <motion.div 
               key={asset._id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card rounded-[32px] p-4 group relative overflow-hidden bg-black/60 border-red-500/10 hover:border-red-500/40 transition-all"
             >
                <div className="aspect-square bg-red-500/5 rounded-[24px] mb-4 flex items-center justify-center relative">
                   <div className="text-6xl text-red-500/5 font-black uppercase tracking-widest -rotate-6">{asset.category[0]}</div>
                   
                   <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 p-6 backdrop-blur-sm">
                      <button 
                        onClick={() => restoreMutation.mutate(asset._id)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#CCFF00] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                      >
                         <RefreshCcw size={14} /> Restore
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('IRREVERSIBLE ACTION: Permanently erase this asset?')) {
                            permanentDeleteMutation.mutate(asset._id)
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                      >
                         <ShieldAlert size={14} /> Shred
                      </button>
                   </div>
                </div>
                <div className="px-2">
                   <div className="text-[11px] font-black text-white truncate uppercase tracking-widest">{asset.name}</div>
                   <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Pending Disposal</div>
                </div>
             </motion.div>
           ))}
        </div>
      )}

      <div className="mt-12 p-8 rounded-[40px] bg-red-500/5 border border-red-500/10 flex items-start gap-6 max-w-3xl">
         <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
            <HardDrive size={28} />
         </div>
         <div>
            <h4 className="text-lg font-black text-white mb-2 uppercase italic tracking-tighter">Secure Shredding Protocol</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Assets in the bin are still encrypted but prioritized for pruning. Shredding an asset performs a multi-pass overwrite 
              of the database entry and erases the recovery key. This action cannot be undone.
            </p>
         </div>
      </div>
    </div>
  )
}

export default Bin
