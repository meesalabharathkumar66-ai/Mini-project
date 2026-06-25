import React from 'react'
import { motion } from 'framer-motion'
import { Archive, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const ArchivedAssets = () => {
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Archive className="text-orange-400" />
          Archived Assets
        </h1>
        <p className="text-slate-400">These files are hidden from your main explorer to keep things organized.</p>
      </header>

      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Archive size={40} className="text-slate-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">No archived files yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Files you archive from the explorer will appear here safely.
        </p>
      </div>
    </div>
  )
}

export default ArchivedAssets
