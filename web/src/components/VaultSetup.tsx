import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface VaultSetupProps {
  onSuccess: (password: string) => void
  onCancel: () => void
}

export const VaultSetup = ({ onSuccess, onCancel }: VaultSetupProps) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const validateComplexity = (pw: string) => {
    const complexRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    return complexRegex.test(pw)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!validateComplexity(password)) {
      setError('Password must be 8+ chars with Upper, Lower, and Special characters')
      return
    }
    onSuccess(password)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full glass-card p-8 rounded-3xl border border-primary-500/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-600/20 rounded-2xl text-primary-400">
           <Shield size={24} />
        </div>
        <div>
           <h2 className="text-xl font-bold">Secure Vault Setup</h2>
           <p className="text-xs text-slate-500">Enable high-level security for your assets.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">New Vault Password</label>
          <div className="relative">
             <input 
                type={showPassword ? 'text' : 'password'}
                className="glass-input w-full pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
             >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
             </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
          <input 
             type="password"
             className="glass-input w-full"
             placeholder="••••••••"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -5 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400"
          >
            <AlertCircle size={14} /> {error}
          </motion.div>
        )}

        <div className="bg-white/5 p-4 rounded-2xl text-[10px] text-slate-500 space-y-1">
           <p className={password.length >= 8 ? 'text-teal-400' : ''}>• At least 8 characters long</p>
           <p className={/[A-Z]/.test(password) ? 'text-teal-400' : ''}>• Contains uppercase capital letter</p>
           <p className={/[a-z]/.test(password) ? 'text-teal-400' : ''}>• Contains lowercase small letter</p>
           <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-teal-400' : ''}>• Contains special character</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-bold text-slate-500">Cancel</button>
          <button type="submit" className="flex-1 btn-primary py-3">Finalize Setup</button>
        </div>
      </form>
    </motion.div>
  )
}
