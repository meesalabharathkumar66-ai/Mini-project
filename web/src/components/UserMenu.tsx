import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Database, ChevronDown, PenLine } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export const UserMenu = () => {
  const { currentTheme } = useTheme();
  const { user, logout: localLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localLogout();
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/auth/rename-account', { name: newName });
      toast.success('Account name updated');
      setIsRenaming(false);
      window.location.reload(); // Refresh to get updated user state
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const storageUsedGB = ((user?.storageUsed || 0) / (1024 * 1024 * 1024)).toFixed(2);
  const storageLimitGB = ((user?.storageLimit || 0) / (1024 * 1024 * 1024)).toFixed(0);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 glass-card p-2 rounded-2xl transition-all"
        style={{ borderColor: `${currentTheme.primary}33` }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black" style={{ backgroundColor: currentTheme.primary }}>
          {user?.name?.[0].toUpperCase()}
        </div>
        <div className="hidden sm:block text-left mr-2">
          <div className="text-sm font-black text-white leading-tight">{user?.name}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest leading-tight" style={{ color: currentTheme.primary }}>Secure User</div>
        </div>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-72 rounded-[32px] p-4 z-[200] border shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            style={{ backgroundColor: currentTheme.bg, borderColor: `${currentTheme.primary}1A` }}
          >
            <div className="p-4 border-b border-white/5 space-y-4">
              {isRenaming ? (
                <form onSubmit={handleRename} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">New System Name</label>
                    <input 
                      type="text" 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="glass-input w-full text-xs py-3"
                      placeholder="Enter new name"
                      autoFocus
                    />
                  </div>
                  <p className="text-[9px] font-bold text-orange-400/80 leading-tight bg-orange-400/5 p-2 rounded-lg border border-orange-400/10 uppercase tracking-wider">
                    ⚠️ Warning: Name cannot be changed until 7 days after update
                  </p>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 py-2 text-black text-[9px] font-black uppercase rounded-lg" style={{ backgroundColor: currentTheme.primary }}>Apply Changes</button>
                    <button type="button" onClick={() => setIsRenaming(false)} className="px-4 py-2 bg-white/5 text-slate-500 text-[9px] font-black uppercase rounded-lg">Abort</button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-200 uppercase tracking-widest">Account ID</div>
                  <button onClick={() => setIsRenaming(true)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-[var(--primary-color)] transition-all">
                    <PenLine size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Storage Utilization</span>
                  <span>{storageUsedGB} / {storageLimitGB} GB</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(Number(user?.storageUsed) / Number(user?.storageLimit)) * 100}%` }}
                    className="h-full"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 border rounded-xl mb-4" style={{ backgroundColor: `${currentTheme.primary}0D`, borderColor: `${currentTheme.primary}1A` }}>
                  <button 
                    onClick={() => {
                        window.location.href = '/locked-setup';
                    }}
                    className="w-full text-left group"
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1 group-hover:underline" style={{ color: currentTheme.primary }}>
                      {user?.vaultPassword ? 'Manage Locked Gate Key' : 'Create Locked Gate Password'}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      Requirement: Primary Auth Verification
                    </div>
                  </button>
                </div>

                <MenuButton icon={<User size={16} />} label="Security Settings" onClick={() => (window.location.href = '/security')} themeColor={currentTheme.primary} />
                <MenuButton icon={<Database size={16} />} label="Data Management" onClick={() => (window.location.href = '/explorer')} themeColor={currentTheme.primary} />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all group mt-2"
                >
                  <LogOut size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Logout System</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick, themeColor }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group"
  >
    <div className="text-slate-500 group-hover:transition-colors" style={{ color: 'inherit' }}>
       <div className="group-hover:text-[var(--primary-color)]" style={{ color: 'inherit' }}>{icon}</div>
    </div>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);
