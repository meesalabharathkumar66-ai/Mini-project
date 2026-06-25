import { motion } from 'framer-motion'
import { Shield, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-slate-100 p-6 md:p-12 lg:p-24 selection:bg-[#CCFF00]/30 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#CCFF00] transition-colors mb-12 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Login</span>
        </Link>

        <header className="mb-20">
          <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black mb-8 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
            <Shield size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Terms of <span className="text-[#CCFF00]">Service.</span></h1>
          <p className="text-xl text-slate-500 font-medium tracking-tight">Welcome to S.A.M — Secure Asset Manager</p>
        </header>

        <div className="space-y-16">
          <Section title="Account Responsibility">
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Maintaining account security</li>
              <li>Protecting credentials</li>
              <li>Managing uploaded assets</li>
            </ul>
          </Section>

          <Section title="Acceptable Use">
            <p className="text-slate-400 mb-4">Users must not:</p>
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Upload malicious software</li>
              <li>Upload illegal content</li>
              <li>Attempt unauthorized access</li>
              <li>Abuse storage resources</li>
              <li>Interfere with platform operation</li>
            </ul>
          </Section>

          <Section title="Asset Ownership">
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Users retain ownership of uploaded files</li>
              <li>S.A.M does not claim ownership</li>
            </ul>
          </Section>

          <Section title="Storage & Availability">
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Files are stored securely</li>
              <li>Storage limits may apply</li>
              <li>Availability is provided on best effort</li>
            </ul>
          </Section>

          <Section title="Security">
            <p className="text-slate-400 mb-4">S.A.M provides:</p>
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Encrypted storage</li>
              <li>Authentication</li>
              <li>Monitoring</li>
            </ul>
          </Section>

          <Section title="Account Termination">
            <p className="text-slate-400">Accounts may be restricted for misuse.</p>
          </Section>

          <Section title="Changes to Terms">
            <p className="text-slate-400">Terms may be updated over time.</p>
          </Section>
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
          <span>© 2026 S.A.M Security Corp</span>
          <span>Effective Date: June 2026</span>
        </footer>
      </div>
    </div>
  )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-6"
  >
    <h2 className="text-xs font-black text-[#CCFF00] uppercase tracking-[0.4em]">{title}</h2>
    <div className="text-lg font-medium leading-relaxed">
      {children}
    </div>
  </motion.section>
)

export default Terms
