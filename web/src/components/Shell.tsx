import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { UserMenu } from './UserMenu'
import { ShieldCheck, Menu, X, LayoutDashboard, Folder, Archive, Lock, Trash, Shield, Star, Clock } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const Shell = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentTheme } = useTheme();

  const menuItems = [
    { name: 'DASHBOARD', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'SECURE EXPLORER', icon: <Folder size={18} />, path: '/explorer' },
    { name: 'ARCHIVE VAULT', icon: <Archive size={18} />, path: '/archives' },
    { name: 'LOCKED GATE', icon: <Lock size={18} />, path: '/locked-setup' },
    { name: 'TRASH BIN', icon: <Trash size={18} />, path: '/bin' },
    { name: 'INTEL HUB', icon: <Shield size={18} />, path: '/security' },
  ];

  return (
    <div className="min-h-screen flex overflow-x-hidden transition-colors duration-500" style={{ backgroundColor: currentTheme.bg }}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-1000 opacity-20" 
          style={{ backgroundColor: currentTheme.primary }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px] transition-all duration-1000 opacity-10" 
          style={{ backgroundColor: currentTheme.primary }}
        />
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 px-8 flex items-center justify-between border-b border-white/5 backdrop-blur-xl sticky top-0 z-[100]" style={{ backgroundColor: `${currentTheme.bg}66` }}>
          <div className="flex items-center gap-4 lg:hidden">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="p-2 hover:bg-white/5 rounded-xl transition-all"
               style={{ color: currentTheme.primary }}
             >
                <Menu size={28} />
             </button>
             <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_var(--primary-glow)]"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                   <ShieldCheck className="text-black" size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">S.A.M</span>
             </div>
          </div>
          
          <div className="hidden lg:block">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Vault Command Interface</h2>
          </div>

          <UserMenu />
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[150] lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 w-[300px] h-screen border-r border-white/5 z-[160] p-8 lg:hidden flex flex-col overflow-y-auto custom-scrollbar"
                style={{ backgroundColor: currentTheme.bg }}
              >
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black"
                        style={{ backgroundColor: currentTheme.primary }}
                      >C</div>
                      <span className="text-xl font-black tracking-tighter text-white">CYPHER.</span>
                   </div>
                   <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: currentTheme.primary }}><X size={28} /></button>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 px-4">Navigation</div>
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                          isActive 
                            ? 'text-black font-black' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                        style={{ backgroundColor: isActive ? currentTheme.primary : 'transparent', boxShadow: isActive ? `0 10px 20px ${currentTheme.glow}` : 'none' }}
                      >
                        <div className={`${isActive ? 'text-black' : 'text-slate-600 group-hover:text-[var(--primary-color)] transition-colors'}`}>
                          {item.icon}
                        </div>
                        <span className="font-black text-[11px] tracking-widest">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                   <div className="flex items-center gap-3 text-slate-600 px-4">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse" 
                        style={{ backgroundColor: currentTheme.primary, boxShadow: `0 0 10px ${currentTheme.primary}` }}
                      />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Active</span>
                   </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
