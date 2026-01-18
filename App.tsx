
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Mail, Globe, Fingerprint, Loader2 } from 'lucide-react';

// Pages
import Landing from './pages/Landing.tsx';
import Onboarding from './pages/Onboarding.tsx';
import SignUp from './pages/SignUp.tsx';
import SignIn from './pages/SignIn.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Verify from './pages/Verify.tsx';
import Fractional from './pages/Fractional.tsx';
import Yield from './pages/Yield.tsx';
import Swap from './pages/Swap.tsx';
import Pay from './pages/Pay.tsx';
import Account from './pages/Account.tsx';
import PropAI from './pages/PropAI.tsx';
import BuilderTokenize from './pages/BuilderTokenize.tsx';
import BuilderList from './pages/BuilderList.tsx';
import PropertyDetail from './pages/PropertyDetail.tsx';

// Components
import Layout from './components/Layout.tsx';

const GlobalModal: React.FC = () => {
  const { user, isConnecting, isWalletModalOpen, setWalletModalOpen, connectWallet } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    nationality: 'Indian',
    idType: 'PAN' as 'PAN' | 'AADHAR',
    idNumber: ''
  });

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.idNumber) return;
    await connectWallet(formData);
    setWalletModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-obsidian-950/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-obsidian-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-registry-border dark:border-white/5 relative flex flex-col overflow-hidden"
          >
            <div className="p-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-fintech-purple-600 dark:bg-neon-emerald rounded-2xl flex items-center justify-center text-white dark:text-obsidian-950 shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <button 
                  onClick={() => setWalletModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">Identity Check</h2>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Connect to global real estate value rails</p>
              </div>

              <form onSubmit={handleActivateSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Registry Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-registry-card dark:bg-obsidian-800 border border-registry-border dark:border-white/10 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-fintech-purple-600/5 transition-all text-slate-800 dark:text-white"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nationality</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        value={formData.nationality}
                        onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                        className="w-full pl-11 pr-4 py-4 bg-registry-card dark:bg-obsidian-800 border border-registry-border dark:border-white/10 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-fintech-purple-600/5 transition-all text-slate-800 dark:text-white"
                      >
                        <option value="Indian">Indian</option>
                        <option value="NRI">NRI (Non-Resident)</option>
                        <option value="Global">International Investor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                      <select 
                        value={formData.idType}
                        onChange={e => setFormData({ ...formData, idType: e.target.value as 'PAN' | 'AADHAR' })}
                        className="w-full px-4 py-4 bg-registry-card dark:bg-obsidian-800 border border-registry-border dark:border-white/10 rounded-2xl font-bold text-xs outline-none appearance-none focus:ring-4 focus:ring-fintech-purple-600/5 transition-all text-slate-800 dark:text-white"
                      >
                        <option value="PAN">PAN</option>
                        <option value="AADHAR">AADHAR</option>
                      </select>
                    </div>
                    <div className="md:col-span-8 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identifier</label>
                      <div className="relative">
                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={formData.idNumber}
                          onChange={e => setFormData({ ...formData, idNumber: e.target.value.toUpperCase() })}
                          className="w-full pl-11 pr-4 py-4 bg-registry-card dark:bg-obsidian-800 border border-registry-border dark:border-white/10 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-fintech-purple-600/5 transition-all text-slate-800 dark:text-white"
                          placeholder={formData.idType === 'PAN' ? 'ABCDE1234F' : '1234 5678 9012'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isConnecting}
                  className="w-full primary-gradient text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GlobalModal />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><Fractional /></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} />
          <Route path="/builder/list" element={<ProtectedRoute><BuilderList /></ProtectedRoute>} />
          <Route path="/builder/tokenize" element={<ProtectedRoute><BuilderTokenize /></ProtectedRoute>} />
          <Route path="/yield" element={<ProtectedRoute><Yield /></ProtectedRoute>} />
          <Route path="/swap" element={<ProtectedRoute><Swap /></ProtectedRoute>} />
          <Route path="/pay" element={<ProtectedRoute><Pay /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><PropAI /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
