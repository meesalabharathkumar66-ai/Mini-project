import { motion } from 'framer-motion'
import { Lock, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-slate-100 p-6 md:p-12 lg:p-24 selection:bg-[#CCFF00]/30 selection:text-black">
      <div className="max-w-4xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#CCFF00] transition-colors mb-12 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Login</span>
        </Link>

        <header className="mb-20">
          <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black mb-8 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
            <Lock size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Privacy <span className="text-[#CCFF00]">Policy.</span></h1>
          <p className="text-xl text-slate-500 font-medium tracking-tight">Your privacy matters at S.A.M</p>
        </header>

        <div className="space-y-16">
          <Section title="Information Collected">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Account Information</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>Name</li>
                  <li>Email</li>
                  <li>Login credentials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Usage Information</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>Login activity</li>
                  <li>File activity</li>
                  <li>Device information</li>
                </ul>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Asset Information</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>File metadata</li>
                <li>Upload history</li>
              </ul>
            </div>
          </Section>

          <Section title="How Information Is Used">
            <p className="text-slate-400 mb-4">Data is used to:</p>
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Authenticate users</li>
              <li>Manage assets</li>
              <li>Improve security</li>
              <li>Generate analytics</li>
            </ul>
          </Section>

          <Section title="File Privacy">
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Files remain private</li>
              <li>Permission-based access</li>
              <li>Encryption supported</li>
            </ul>
          </Section>

          <Section title="Data Sharing">
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>No selling of user data</li>
              <li>Shared only when required for operation</li>
            </ul>
          </Section>

          <Section title="Data Retention">
            <p className="text-slate-400 mb-4">Files remain until:</p>
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>User deletion</li>
              <li>Account deletion</li>
              <li>Expiration rules</li>
            </ul>
          </Section>

          <Section title="Security Measures">
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Authentication</li>
              <li>Encryption</li>
              <li>Audit logging</li>
              <li>Session monitoring</li>
            </ul>
          </Section>

          <Section title="User Rights">
            <p className="text-slate-400 mb-4">Users may:</p>
            <ul className="space-y-4 list-disc list-inside text-slate-400">
              <li>Access data</li>
              <li>Edit profile</li>
              <li>Delete assets</li>
              <li>Remove account</li>
            </ul>
          </Section>

          <Section title="Contact">
             <p className="text-lg font-black text-[#CCFF00]">support@sam-project.com</p>
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

export default Privacy
