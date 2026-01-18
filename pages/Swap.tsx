
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { RefreshCcw, ArrowRight, ArrowDown, Loader2, CheckCircle2, AlertCircle, Info, ChevronDown, Coins, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Swap: React.FC = () => {
  const { wallet, swapToStablecoin } = useAuth();
  const [assetId, setAssetId] = useState(DUMMY_ASSETS[0].id);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedAsset = DUMMY_ASSETS.find(a => a.id === assetId)!;
  const ownedTokens = Number(wallet.tokensByAsset[assetId]) || 0;
  const outputINR = tokenAmount * selectedAsset.tokenPrice;

  const handleSwap = async () => {
    if (tokenAmount <= 0) return;
    if (tokenAmount > ownedTokens) {
      setError("Insufficient units available.");
      return;
    }
    setIsSwapping(true);
    setError(null);
    try {
      await swapToStablecoin(assetId, tokenAmount);
      setShowSuccess(true);
      setTokenAmount(0);
    } catch (err: any) {
      setError(err.message || 'Swap failed.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 animate-fintech-fade px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Swap to Stablecoin</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
          Convert your property units into cash immediately
        </p>
      </div>

      {/* Main Swap Card */}
      <div className="fintech-card p-6 md:p-10 relative overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 bg-white dark:bg-obsidian-900 rounded-[48px]">
        <div className="space-y-10">
          
          {/* Asset Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-4">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Asset</label>
              <span className="text-[9px] font-black text-indigo-600 dark:text-neon-emerald uppercase tracking-widest bg-indigo-50 dark:bg-neon-emerald/10 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-neon-emerald/20">
                You hold: {ownedTokens} Units
              </span>
            </div>
            <div className="relative group">
              <select 
                className="w-full bg-slate-50 dark:bg-obsidian-800 border border-slate-200 dark:border-white/10 rounded-3xl px-8 py-5 font-black text-sm text-slate-900 dark:text-white outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
                value={assetId}
                onChange={e => { setAssetId(e.target.value); setError(null); }}
              >
                {DUMMY_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} — ₹{asset.tokenPrice.toLocaleString()} / Unit</option>
                ))}
              </select>
              <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>

          {/* Conversion Logic */}
          <div className="flex flex-col gap-8 relative">
            {/* Input Side */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Units to Swap</label>
                <button 
                  onClick={() => { setTokenAmount(ownedTokens); setError(null); }}
                  className="text-[9px] font-black text-indigo-600 dark:text-neon-emerald hover:opacity-70 uppercase tracking-widest transition-all"
                >
                  Use Max
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-obsidian-800 p-10 rounded-[36px] border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-inner focus-within:ring-4 focus-within:ring-indigo-600/5 transition-all">
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-transparent text-5xl font-black outline-none tracking-tighter text-slate-900 dark:text-white leading-none"
                  value={tokenAmount || ''}
                  onChange={e => setTokenAmount(Math.min(ownedTokens, Math.max(0, parseFloat(e.target.value) || 0)))}
                />
                <div className="flex flex-col items-end shrink-0 gap-3">
                  <div className="bg-white dark:bg-obsidian-700 px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-md flex items-center gap-3">
                    <Coins className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Units</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Side */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Cash Value</label>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 dark:text-neon-emerald uppercase tracking-widest">
                  <RefreshCcw className="w-3 h-3" /> Direct Conversion
                </div>
              </div>
              <div className="bg-emerald-50 dark:bg-neon-emerald/5 p-12 rounded-[36px] border border-emerald-100/50 dark:border-neon-emerald/20 flex items-center justify-between shadow-inner">
                <p className="text-5xl font-black text-emerald-700 dark:text-neon-emerald tracking-tighter leading-none">
                  ₹{outputINR.toLocaleString()}
                </p>
                <div className="bg-white dark:bg-obsidian-700 px-6 py-2.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-md flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">INR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-6 pt-4">
            {error && (
              <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <AlertCircle className="w-6 h-6 shrink-0" /> {error}
              </div>
            )}

            <button 
              onClick={handleSwap}
              disabled={isSwapping || tokenAmount <= 0}
              className="w-full primary-gradient text-white py-8 rounded-full font-black uppercase tracking-[0.3em] text-[12px] shadow-xl flex items-center justify-center gap-6 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSwapping ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Authorize Token Swap <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </div>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 bg-white dark:bg-obsidian-900 z-50 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-32 h-32 bg-emerald-50 dark:bg-neon-emerald/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-neon-emerald mb-10 border-4 border-emerald-100 dark:border-neon-emerald shadow-xl">
                 <CheckCircle2 className="w-16 h-16" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">Swap Completed</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-md mx-auto leading-relaxed uppercase tracking-[0.2em] mb-12">
                ₹{outputINR.toLocaleString()} added to your cash balance.
              </p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="bg-slate-900 dark:bg-white text-white dark:text-obsidian-950 px-20 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-xl hover:opacity-90 active:scale-95 transition-all"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Registry Protocol Info */}
      <div className="p-10 bg-indigo-50 dark:bg-indigo-600/10 rounded-[40px] border border-indigo-100 dark:border-indigo-600/20 flex flex-col lg:flex-row items-center gap-8 shadow-sm">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl shrink-0">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-4">
          <p className="text-[12px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-[0.3em]">Asset Liquidity Policy</p>
          <p className="text-[11px] font-bold text-indigo-700/80 dark:text-indigo-300/70 leading-relaxed uppercase tracking-tight">
            Exchange property units back to cash instantly. All transactions are settled at current appraisal values on the digital registry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Swap;
