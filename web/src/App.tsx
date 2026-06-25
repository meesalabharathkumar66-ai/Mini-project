import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import React from 'react'

import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AssetExplorer from './pages/AssetExplorer'
import Login from './pages/Login'
import ArchivedAssets from './pages/ArchivedAssets'
import LockedAssets from './pages/LockedAssets'
import SecurityDashboard from './pages/SecurityDashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Bin from './pages/Bin'
import LockedGateSetup from './pages/LockedGateSetup'
import { SessionManager } from './components/SessionManager'
import Shell from './components/Shell'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from './context/ThemeContext'
import { VaultProvider } from './context/VaultContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#CCFF00]"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[#CCFF00] font-bold text-xs uppercase tracking-widest">SAM</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionManager>
      <ProtectedContent>
        <Shell>{children}</Shell>
      </ProtectedContent>
    </SessionManager>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <VaultProvider>
          <Router>
            <Toaster 
              position="top-right" 
              toastOptions={{
                style: {
                  background: '#070707',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px',
                  backdropFilter: 'blur(10px)',
                  fontSize: '11px',
                  fontWeight: '900',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }
              }} 
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginWrapper />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/explorer" element={<ProtectedRoute><AssetExplorer /></ProtectedRoute>} />
              <Route path="/archives" element={<ProtectedRoute><ArchivedAssets /></ProtectedRoute>} />
              <Route path="/locked" element={<ProtectedRoute><LockedAssets /></ProtectedRoute>} />
              <Route path="/bin" element={<ProtectedRoute><Bin /></ProtectedRoute>} />
              <Route path="/locked-setup" element={<ProtectedRoute><LockedGateSetup /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecurityDashboard /></ProtectedRoute>} />
              
              <Route path="/pinned" element={<ProtectedRoute><AssetExplorer /></ProtectedRoute>} />
              <Route path="/recent" element={<ProtectedRoute><AssetExplorer /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </VaultProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const LoginWrapper = () => {
    const { user } = useAuth()
    if (user) return <Navigate to="/dashboard" replace />
    return <Login />
}

export default App

