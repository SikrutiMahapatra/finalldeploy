
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { Lock, AlertCircle, Loader2, CheckCircle2, Wallet, ArrowRight, ArrowDown, Banknote, Landmark, ShieldCheck, Sparkles, TrendingUp, Coins, ChevronDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Pay: React.FC = () => {
  const { wallet, makePayment, lockAsCollateral } = useAuth();
  const [activeTab, setActiveTab] = useState<'pay' | 'collateral'>('pay');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [lockAssetId, setLockAssetId] = useState(DUMMY_ASSETS[0].id);
  const [lockAmount, setLockAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (payAmount <= 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const success = await makePayment(payAmount);
      if (success) {
        setSuccessMsg(`₹${payAmount.toLocaleString()} Withdrawal Initialized`);
        setShowSuccess(true);
        setPayAmount(0);
      } else {
        setError("Capital transfer failed.");
      }
    } catch (err: any) {
      setError(err.message || 'Payment system error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLock = async () => {
    if (lockAmount <= 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const owned = Number(wallet.tokensByAsset[lockAssetId]) || 0;
      if (lockAmount > owned) throw new Error("Insufficient units.");
      const creditToReceive = (lockAmount * selectedLockAsset.tokenPrice) * 0.6;
      await lockAsCollateral(lockAssetId, lockAmount);
      setSuccessMsg(`Credit Line of ₹${creditToReceive.toLocaleString()} Active`);
      setShowSuccess(true);
      setLockAmount(0);
    } catch (err: any) {
      setError(err.message || 'Vault processing error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedLockAsset = DUMMY_ASSETS.find(a => a.id === lockAssetId)!;
  const ownedTokens = Number(wallet.tokensByAsset[lockAssetId]) || 0;
  const creditToReceive = lockAmount * selectedLockAsset.tokenPrice * 0.6;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-fintech-fade px-2">
      {/* Page Header - Aligned Left */}
      <div className="space-y-2 pt-2">
        <h1 className="text-2xl font-black text-[#141A19] dark:text-white tracking-tight uppercase leading-none">Wallet & Credit</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">Withdraw balance to bank or unlock credit from holdings</p>
      </div>

      {/* Tabs Container - Left Aligned */}
      <div className="flex bg-slate-100 dark:bg-obsidian-900 p-1 rounded-full w-full max-w-[280px] border border-slate-200 dark:border-white/5 shadow-inner">
        <button 
          onClick={() => { setActiveTab('pay'); setError(null); }}
          className={`flex-1 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === 'pay' ? 'bg-white dark:bg-white text-slate-900 dark:text-obsidian-950 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
        >
          Withdraw
        </button>
        <button 
          onClick={() => { setActiveTab('collateral'); setError(null); }}
          className={`flex-1 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${activeTab === 'collateral' ? 'bg-white dark:bg-white text-slate-900 dark:text-obsidian-950 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
        >
          Credit
        </button>
      </div>

      {/* Main Content Area - Left Aligned Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 fintech-card p-6 md:p-10 relative overflow-hidden shadow-lg border border-slate-100 dark:border-white/5 bg-white dark:bg-obsidian-900 rounded-[32px]">
          <AnimatePresence mode="wait">
            {activeTab === 'pay' ? (
              <motion.div 
                key="withdraw"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Withdrawal Amount</label>
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">Wallet Balance: ₹{wallet.stablecoinBalance.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-obsidian-800 p-8 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-inner focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-slate-300 dark:text-slate-600">₹</span>
                        <input 
                          type="number" 
                          placeholder="0"
                          className="w-full bg-transparent text-4xl font-black outline-none tracking-tighter text-slate-900 dark:text-white"
                          value={payAmount || ''}
                          onChange={e => setPayAmount(Math.min(wallet.stablecoinBalance, Math.max(0, parseFloat(e.target.value) || 0)))}
                        />
                      </div>
                      <button 
                        onClick={() => setPayAmount(wallet.stablecoinBalance)}
                        className="text-[9px] font-black text-indigo-600 dark:text-neon-emerald uppercase tracking-widest bg-white dark:bg-obsidian-700 px-4 py-2 rounded-xl shadow-md border border-slate-100 dark:border-white/5"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="p-8 bg-emerald-50 dark:bg-neon-emerald/5 rounded-3xl border border-emerald-100/50 dark:border-neon-emerald/20 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-neon-emerald">
                          <Landmark className="w-5 h-5" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Bank Destination</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Direct transfer to your verified nodal account.</p>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-4xl font-black text-emerald-700 dark:text-neon-emerald tracking-tighter leading-none">₹{payAmount.toLocaleString()}</p>
                     </div>
                  </div>
                </div>

                <button 
                  onClick={handlePay}
                  disabled={isProcessing || payAmount <= 0}
                  className="w-full primary-gradient text-white py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-lg flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Request Bank Withdrawal <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="credit"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Select Asset</label>
                    <div className="relative group">
                      <select 
                        className="w-full bg-slate-50 dark:bg-obsidian-800 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-black text-xs text-slate-900 dark:text-white outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
                        value={lockAssetId}
                        onChange={e => { setLockAssetId(e.target.value); setError(null); }}
                      >
                        {DUMMY_ASSETS.map(asset => (
                          <option key={asset.id} value={asset.id}>{asset.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Units (Max: {ownedTokens})</label>
                    <div className="bg-slate-50 dark:bg-obsidian-800 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-inner focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-transparent text-2xl font-black outline-none tracking-tighter text-slate-900 dark:text-white"
                        value={lockAmount || ''}
                        onChange={e => setLockAmount(Math.min(ownedTokens, Math.max(0, parseInt(e.target.value) || 0)))}
                      />
                      <button 
                        onClick={() => setLockAmount(ownedTokens)}
                        className="text-[9px] font-black text-indigo-600 dark:text-neon-emerald uppercase tracking-widest"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-indigo-50 dark:bg-white/5 rounded-3xl border border-indigo-100/50 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 text-indigo-600 dark:text-white">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Asset-Backed Credit</span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Instantly borrow 60% LTV against tokens.</p>
                   </div>
                   <div className="text-right shrink-0">
                      <p className="text-4xl font-black text-indigo-700 dark:text-white tracking-tighter leading-none">₹{creditToReceive.toLocaleString()}</p>
                   </div>
                </div>

                <button 
                  onClick={handleLock}
                  disabled={isProcessing || lockAmount <= 0}
                  className="w-full primary-gradient text-white py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-lg flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Activate Unit Credit Line <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="absolute inset-0 bg-white dark:bg-obsidian-900 z-[60] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-24 h-24 bg-emerald-50 dark:bg-neon-emerald/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-neon-emerald mb-6 border-4 border-emerald-100 dark:border-neon-emerald">
                   <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-3">Settlement Secured</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs max-w-xs mx-auto leading-relaxed uppercase tracking-[0.1em] mb-8">
                  {successMsg}
                </p>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-obsidian-950 px-12 py-4 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg hover:opacity-90 active:scale-95 transition-all"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[28px] border border-slate-100 dark:border-white/5 flex flex-col gap-4 shadow-sm">
            <div className="bg-slate-900 dark:bg-white text-white dark:text-obsidian-950 p-3 rounded-xl shrink-0 w-min">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.1em]">Registry Policy</p>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                Cash withdrawals are settled through nodal bank rails within 24 business hours. 
                Credit lines are asset-backed; units used as collateral remain in your name but are frozen on the registry until the credit is settled.
              </p>
            </div>
          </div>
          
          <div className="p-8 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-[28px] border border-indigo-100 dark:border-white/5 space-y-3">
             <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Active Rate</p>
             <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">60% LTV</p>
             <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">Borrowing rates are dynamically adjusted based on registry appraisal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
