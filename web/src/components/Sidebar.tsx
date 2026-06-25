import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Folder, Archive, Lock, Shield, HardDrive, Zap, Star, Clock, Trash } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import React from 'react'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  const { currentTheme, setTheme } = useTheme()
  
  const menuItems = [
    { name: 'DASHBOARD', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'SECURE EXPLORER', icon: <Folder size={18} />, path: '/explorer' },
    { name: 'ARCHIVE VAULT', icon: <Archive size={18} />, path: '/archives' },
    { name: 'LOCKED GATE', icon: <Lock size={18} />, path: '/locked-setup' },
    { name: 'TRASH BIN', icon: <Trash size={18} />, path: '/bin' },
    { name: 'INTEL HUB', icon: <Shield size={18} />, path: '/security' },
  ]

  const storagePercentage = Math.min(((user?.storageUsed || 0) / (user?.storageLimit || 1)) * 100, 100)

  const themeColors = [
    { name: 'CYPHEIR', hex: '#CCFF00' },
    { name: 'LIGHT', hex: '#6D6D5C' }, 
    { name: 'GOLDEN', hex: '#FFA500' },
  ]

  return (
    <aside 
      className="w-80 h-screen border-r pt-10 px-8 hidden lg:flex flex-col sticky top-0 transition-colors duration-500"
      style={{ 
        backgroundColor: currentTheme.bg,
        borderRightColor: currentTheme.name === 'CYPHEIR' ? `${currentTheme.primary}40` : 'rgba(255,255,255,0.05)'
      }}
    >
      <div className="flex items-center gap-4 mb-16 px-4">
         <div 
           className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)] transition-all duration-300"
           style={{ backgroundColor: currentTheme.primary }}
         >
            <Shield size={24} className="text-black" />
         </div>
         <div className="flex flex-col">
           <span className="text-2xl font-black tracking-tighter text-white uppercase italic">S.A.M</span>
           <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: currentTheme.primary }}>CYPHER ENGINE.02</span>
         </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 px-4 ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'}`}>Navigation</div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group ${
                isActive 
                  ? 'text-black shadow-[0_10px_20px_var(--primary-glow)]' 
                  : `font-black text-[11px] tracking-widest ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'} hover:text-white`
              }`}
              style={{ backgroundColor: isActive ? currentTheme.primary : 'transparent' }}
            >
              <div className={`${isActive ? 'text-black' : `${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-600'} group-hover:text-[var(--primary-color)] transition-colors`}`}>
                {item.icon}
              </div>
              <span className="font-black text-[11px] tracking-widest">{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="mb-8 pt-8 border-t border-white/5 space-y-8">
        <div className="px-4 space-y-4">
           <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'}`}>Color Scheme</div>
           <div className="flex items-center gap-3">
              {themeColors.map(t => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 ${currentTheme.name === t.name ? 'border-white scale-110 shadow-[0_0_10px_white]' : 'border-transparent'}`}
                  style={{ backgroundColor: t.hex }}
                  title={t.name}
                />
              ))}
           </div>
        </div>

        <div 
          className="p-6 rounded-[32px] bg-white/5 border relative overflow-hidden group"
          style={{ borderColor: currentTheme.name === 'CYPHEIR' ? `${currentTheme.primary}20` : 'rgba(255,255,255,0.05)' }}
        >
          <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'}`}>Storage Matrix</div>
          
          <div className="w-full bg-black h-1.5 rounded-full overflow-hidden mb-4 border border-white/5 text-primary">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${storagePercentage}%` }}
              className="h-full rounded-full transition-all duration-700"
              style={{ backgroundColor: currentTheme.primary, boxShadow: `0 0 10px ${currentTheme.primary}` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-white">{storagePercentage.toFixed(1)}%</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'}`}>10 GB SECURE</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
