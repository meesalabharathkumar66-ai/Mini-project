import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { motion } from 'framer-motion'
import { FileText, Image as ImageIcon, Video, File, Share2, Eye, Clock, ShieldCheck, Activity, Database, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { currentTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/assets/analytics')
      return res.data
    }
  })

  const handleCategoryClick = (category: string) => {
    const filterMap: Record<string, string> = {
      'MEDIA ASSETS': 'images',
      'VISUAL RECORDS': 'videos',
      'ENCRYPTED DOCS': 'documents',
      'BINARY BLOB': 'zip'
    }
    navigate(`/explorer?filter=${filterMap[category] || ''}`)
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
      <header>
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border mb-6" style={{ backgroundColor: `${currentTheme.primary}1A`, borderColor: `${currentTheme.primary}33` }}>
           <Activity size={14} style={{ color: currentTheme.primary }} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: currentTheme.primary }}>System Health: Optimal</span>
        </div>
        <h1 className="text-5xl font-black font-sans tracking-tight text-white mb-4">
          COMMAND <span style={{ color: currentTheme.primary }}>CENTER.</span>
        </h1>
        <p className={`font-medium max-w-2xl ${currentTheme.name === 'LIGHT' ? 'text-black' : 'text-slate-500'}`}>
          Welcome back, Agent {user?.name.split(' ')[0]}. Your secure vault is monitored by AES-256 protocols.
        </p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="CONTROLLED ASSETS" value={isLoading ? '...' : analytics?.totalAssets} icon={<FileText size={20} />} themeColor={currentTheme.primary} />
        <StatCard 
          title="DATA FOOTPRINT" 
          value={isLoading ? '...' : `${(analytics?.totalStorage / (1024 * 1024)).toFixed(1)} MB`} 
          icon={<ShieldCheck size={20} />} 
          themeColor={currentTheme.primary}
        />
        <StatCard title="INTEGRITY SCORE" value={isLoading ? '...' : `${analytics?.healthScore}%`} icon={<Activity size={20} />} themeColor={currentTheme.primary} />
        <StatCard title="SECURITY PROTOCOL" value="CYPHEIR-V2" icon={<Eye size={20} />} themeColor={currentTheme.primary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-10 rounded-[48px] relative overflow-hidden group" style={{ borderColor: `${currentTheme.primary}1A` }}>
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={120} style={{ color: currentTheme.primary }} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-8 tracking-widest text-white">VAULT CAPACITY</h3>
                
                <div className="space-y-6">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest" style={{ color: currentTheme.primary }}>
                      <span>SECURE CLOUD UTILIZATION</span>
                      <span>{Math.min((analytics?.totalStorage / (10 * 1024 * 1024 * 1024)) * 100, 100).toFixed(1)}%</span>
                   </div>
                   <div className="w-full bg-black h-3 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((analytics?.totalStorage / (10 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
                        className="h-full" 
                        style={{ backgroundColor: currentTheme.primary, boxShadow: `0 0 20px ${currentTheme.glow}` }}
                      />
                   </div>
                </div>

                <div className="mt-12 p-6 rounded-3xl border flex items-start gap-4" style={{ backgroundColor: `${currentTheme.primary}0D`, borderColor: `${currentTheme.primary}1A` }}>
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center text-black" style={{ backgroundColor: currentTheme.primary }}>
                      <Zap size={20} />
                   </div>
                   <div>
                      <div className="text-xs font-black uppercase tracking-widest text-white mb-2">PROTOCOL INSIGHT</div>
                      <p className={`text-sm font-medium leading-relaxed ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'}`}>
                        Redundant storage architecture active. All data packets are sharded across the MongoDB GridFS cluster.
                      </p>
                   </div>
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <h3 className={`text-xs font-black uppercase tracking-[0.4em] px-4 ${currentTheme.name === 'LIGHT' ? 'text-slate-900' : 'text-slate-500'}`}>DATA CLASSIFICATION</h3>
           <div className="space-y-4">
              <CategoryItem icon={<ImageIcon size={18} />} name="MEDIA ASSETS" count={analytics?.categoriesCount?.images || 0} onClick={() => handleCategoryClick('MEDIA ASSETS')} themeColor={currentTheme.primary} />
              <CategoryItem icon={<Video size={18} />} name="VISUAL RECORDS" count={analytics?.categoriesCount?.videos || 0} onClick={() => handleCategoryClick('VISUAL RECORDS')} themeColor={currentTheme.primary} />
              <CategoryItem icon={<FileText size={18} />} name="ENCRYPTED DOCS" count={analytics?.categoriesCount?.documents || 0} onClick={() => handleCategoryClick('ENCRYPTED DOCS')} themeColor={currentTheme.primary} />
              <CategoryItem icon={<File size={18} />} name="BINARY BLOB" count={analytics?.categoriesCount?.zip || 0} onClick={() => handleCategoryClick('BINARY BLOB')} themeColor={currentTheme.primary} />
           </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, themeColor }: { title: string, value: string, icon: any, themeColor: string }) => (
  <div className="glass-card p-8 rounded-[32px] border-white/5 transition-all group">
    <div className="flex items-center justify-between mb-6">
      <span className={`text-[10px] font-black uppercase tracking-widest ${themeColor === '#1A1A1A' ? 'text-slate-900' : 'text-slate-500'}`}>{title}</span>
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:transition-colors" style={{ color: 'inherit' }}>
        <div className="group-hover:text-[var(--primary-color)] transition-colors" style={{ color: 'inherit' }}>{icon}</div>
      </div>
    </div>
    <div className="text-3xl font-black font-sans tracking-tight text-white">{value}</div>
  </div>
)

const CategoryItem = ({ icon, name, count, onClick, themeColor }: { icon: any, name: string, count: number, onClick: () => void, themeColor: string }) => (
  <div onClick={onClick} className="glass-card p-6 rounded-2xl flex items-center justify-between hover:transition-all group cursor-pointer">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:transition-colors" style={{ color: 'inherit' }}>
          <div className="group-hover:text-[var(--primary-color)] transition-colors" style={{ color: 'inherit' }}>{icon}</div>
        </div>
        <span className="font-black text-[10px] tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{name}</span>
     </div>
     <div className="font-black text-xs px-3 py-1 rounded-lg" style={{ color: themeColor, backgroundColor: `${themeColor}1A` }}>{count}</div>
  </div>
)

export default Dashboard
