import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Key, AlertTriangle, ShieldCheck, Activity, Smartphone } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { format } from 'date-fns'

const SecurityDashboard = () => {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/assets/analytics')
      return res.data
    }
  })

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-primary-500" /> Security Dashboard
        </h1>
        <p className="text-slate-400">Monitoring high-level encryption and access logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <SecurityCard 
          icon={<ShieldCheck className="text-teal-400" />} 
          title="Protection Status" 
          status="Active" 
          desc="AES-256-GCM Military Grade" 
        />
        <SecurityCard 
          icon={<Lock className="text-primary-400" />} 
          title="Vault Security" 
          status={analytics?.healthScore > 80 ? 'Optimal' : 'Standard'} 
          desc={`Health Score: ${analytics?.healthScore || 0}%`} 
        />
        <SecurityCard 
          icon={<Smartphone className="text-orange-400" />} 
          title="Cross-Device Sync" 
          status="Verified" 
          desc="Mobile & Web Handshake Active" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
           <h2 className="text-xl font-bold">Access Logs (Last 24h)</h2>
           <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
              <table className="w-full text-left text-sm">
                 <thead className="bg-white/5 text-[10px] text-slate-500 uppercase tracking-widest">
                    <tr>
                       <th className="px-6 py-4">Event</th>
                       <th className="px-6 py-4">IP Address</th>
                       <th className="px-6 py-4">Time</th>
                    </tr>
                 </thead>
                 <tbody>
                    <LogEntry event="Vault Unlock" ip="192.168.1.1" time="2m ago" />
                    <LogEntry event="File Decryption" ip="192.168.1.1" time="15m ago" />
                    <LogEntry event="New Login" ip="104.28.45.1" time="1h ago" />
                 </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold">Security Checklist</h2>
           <div className="space-y-4">
              <CheckItem label="End-to-End Encryption" checked />
              <CheckItem label="Zero-Knowledge Architecture" checked />
              <CheckItem label="Database Storage Allotment (10GB)" checked />
              <CheckItem label="Biometric/Password Challenge" checked />
           </div>
        </div>
      </div>
    </div>
  )
}

const SecurityCard = ({ icon, title, status, desc }: any) => (
  <div className="glass-card p-6 rounded-3xl border border-white/5">
    <div className="flex items-center gap-4 mb-4">
       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">{icon}</div>
       <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="text-xs text-slate-500">{desc}</div>
       </div>
    </div>
    <div className="flex items-center gap-2">
       <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
       <span className="text-sm font-bold text-teal-500">{status}</span>
    </div>
  </div>
)

const LogEntry = ({ event, ip, time }: any) => (
  <tr className="border-t border-white/5 text-slate-300">
    <td className="px-6 py-4 font-medium">{event}</td>
    <td className="px-6 py-4 font-mono text-xs text-slate-500">{ip}</td>
    <td className="px-6 py-4 text-xs text-slate-500">{time}</td>
  </tr>
)

const CheckItem = ({ label, checked }: any) => (
  <div className="glass-card p-4 rounded-xl flex items-center justify-between">
    <span className="text-sm font-medium">{label}</span>
    {checked ? <ShieldCheck className="text-teal-400" size={20} /> : <AlertTriangle className="text-orange-400" size={20} />}
  </div>
)

export default SecurityDashboard
