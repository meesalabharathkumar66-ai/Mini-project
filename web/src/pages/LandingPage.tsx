import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Lock, Search, Smartphone, Globe, Cloud, Zap, ShieldCheck, Activity, Terminal, Menu, X, Upload, Trash, Eye, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleAction = (path: string) => {
    setIsMenuOpen(false)
    navigate(path)
  }

  const triggerUpload = () => {
    toast.success('Initializing Secure Upload Protocol...')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-[#CCFF00]/30 selection:text-black font-sans">
      {/* High-Tech Grid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-20">
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CCFF00 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
         <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl border-b border-[#CCFF00]/10 bg-black/80">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <motion.div 
               whileHover={{ rotate: 180 }}
               transition={{ duration: 0.5 }}
               className="w-12 h-12 bg-[#CCFF00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)]"
             >
                <ShieldCheck className="text-black" size={28} />
             </motion.div>
             <div className="flex flex-col">
               <span className="text-2xl font-black tracking-tighter text-white">S.A.M</span>
               <span className="text-[10px] font-bold text-[#CCFF00] tracking-[0.3em] uppercase">Security Engine</span>
             </div>
          </div>

          <div className="hidden lg:flex-1 lg:flex items-center justify-end mr-12">
            <div className="flex flex-col items-end gap-1">
               <span className="text-[12px] font-black text-[#CCFF00] tracking-[0.3em] uppercase">Protect Every Asset.</span>
               <span className="text-[10px] font-black text-slate-500 tracking-[0.5em] uppercase">Access Without Limits.</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden sm:flex btn-primary py-3 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Vault Login
            </Link>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-white/5 rounded-xl text-[#CCFF00] border border-[#CCFF00]/20 hover:bg-[#CCFF00]/10 transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hamburger Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[90]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-[#0A0A0A] border-l border-[#CCFF00]/10 z-[100] p-12 flex flex-col overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Main Menu</div>
                <button onClick={() => setIsMenuOpen(false)} className="text-[#CCFF00] hover:scale-110 transition-all"><X size={32} /></button>
              </div>

              <div className="flex flex-col gap-8">
                <MenuOption 
                  icon={<Upload size={24} />} 
                  label="Upload Secure Assets" 
                  desc="AES-256-GCM instant encryption"
                  onClick={() => handleAction('/login')}
                />
                <MenuOption 
                  icon={<Eye size={24} />} 
                  label="View Vault" 
                  desc="Access your encrypted storage"
                  onClick={() => handleAction('/dashboard')}
                />
                <MenuOption 
                  icon={<Trash size={24} />} 
                  label="Secure Disposal" 
                  desc="Irreversible file shredding"
                  onClick={() => handleAction('/dashboard')}
                />
                <MenuOption 
                  icon={<Settings size={24} />} 
                  label="Vault Settings" 
                  desc="Configure security handshake"
                  onClick={() => handleAction('/login')}
                />
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex flex-col gap-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#CCFF00]/5 border border-[#CCFF00]/10">
                   <Activity className="text-[#CCFF00]" size={20} />
                   <div>
                     <div className="text-[10px] font-black uppercase text-slate-400">System Health</div>
                     <div className="text-sm font-bold text-[#CCFF00]">ALL PROTOCOLS OPTIMAL</div>
                   </div>
                </div>
                <button 
                  onClick={() => handleAction('/login')}
                  className="w-full py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                >
                  Enter Command Center
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-10">
                 <Zap size={16} className="text-[#CCFF00]" />
                 <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#CCFF00]">S.A.M v2.0 PRODUCTION</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black font-sans tracking-tighter leading-[0.85] mb-10 text-white uppercase italic">
                CYPHER <br />
                <span className="text-[#CCFF00]">STORY.</span>
              </h1>
              
              <p className="max-w-xl text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                Secure your folders digitally with S.A.M
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={triggerUpload}
                  className="btn-primary flex items-center justify-center gap-4 text-[14px] font-black uppercase tracking-widest px-12 py-6 rounded-2xl w-full sm:w-auto hover:translate-y-[-4px] transition-all"
                >
                  <Upload size={20} /> Upload Asset
                </button>
                <Link to="/login" className="btn-secondary flex items-center justify-center text-[14px] font-black uppercase tracking-widest px-12 py-6 rounded-2xl w-full sm:w-auto">
                  View Database
                </Link>
              </div>
            </motion.div>

            {/* High-Tech Box Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative aspect-square"
            >
               <div className="absolute inset-0 bg-[#CCFF00]/10 rounded-full blur-[150px] animate-pulse" />
               <div className="glass-card w-full h-full rounded-[60px] p-1 flex flex-col overflow-hidden relative border border-[#CCFF00]/20 group">
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#CCFF00] rounded-tl-[60px]" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#CCFF00] rounded-br-[60px]" />
                  
                  <div className="flex-1 flex items-center justify-center bg-black/40 rounded-[58px] border border-white/5 relative overflow-hidden">
                     <div className="text-[200px] font-black text-[#CCFF00] opacity-10 select-none group-hover:scale-110 transition-transform duration-700">*</div>
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                     
                     <div className="text-center z-10 px-8">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-40 h-40 bg-[#CCFF00] rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-[0_0_80px_rgba(204,255,0,0.4)]"
                        >
                           <Shield size={80} className="text-black" />
                        </motion.div>
                        <h3 className="text-4xl font-black tracking-tight mb-4">COMMAND CENTER</h3>
                        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Biometric Handshake Active</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Protocol Dashboard Section */}
      <section className="py-40 bg-[#050505] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             <FeatureCard 
               title="FEATURES" 
               desc="Explore the suite of modules including encrypted messaging, vault sharing, and AI classification."
             />
             <FeatureCard 
               title="PROTOCOLS" 
               desc="Read about our AES-256-GCM, Zero-Knowledge proofs, and Quantum-resistant storage standards."
             />
             <FeatureCard 
               id="docs"
               title="INFRASTRUCTURE" 
               desc="A decentralized MongoDB backbone ensuring extreme availability and high-performance throughput."
             />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-black border-t border-[#CCFF00]/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
           <div>
              <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                 <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center font-black text-black">C</div>
                 <span className="text-2xl font-black tracking-tighter">CYPHER.</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Developing secure world-ready software for daily usage.</p>
           </div>
           <div className="text-[10px] font-black tracking-[0.3em] text-slate-700 uppercase">
             © 2026 CYPHER SYSTEM CORP.
           </div>
        </div>
      </footer>
    </div>
  )
}

const MenuOption = ({ icon, label, desc, onClick }: { icon: any, label: string, desc: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-6 p-6 rounded-[32px] bg-white/5 border border-white/5 hover:border-[#CCFF00]/40 transition-all text-left group"
  >
    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-[#CCFF00] group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <div className="text-lg font-black text-white mb-1">{label}</div>
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{desc}</div>
    </div>
  </button>
)

const FeatureCard = ({ title, desc, id }: { title: string, desc: string, id?: string }) => (
  <div id={id} className="p-12 glass-card rounded-[48px] relative overflow-hidden group border-white/5 hover:border-[#CCFF00]/20 transition-all">
    <div className="text-[80px] font-black text-[#CCFF00]/5 absolute -bottom-10 -right-10 select-none group-hover:scale-110 transition-transform">{title[0]}</div>
    <h3 className="text-2xl font-black mb-6 tracking-widest text-[#CCFF00]">{title}</h3>
    <p className="text-slate-400 font-medium leading-relaxed relative z-10">{desc}</p>
    <div className="mt-10 flex h-1 w-20 bg-white/5 rounded-full overflow-hidden">
       <div className="h-full w-0 bg-[#CCFF00] group-hover:w-full transition-all duration-700" />
    </div>
  </div>
)

export default LandingPage
