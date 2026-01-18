
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { User, Mail, ShieldCheck, CreditCard, RefreshCcw, ShoppingCart, ExternalLink, X, Info, Landmark, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Account: React.FC = () => {
  const { user, wallet } = useAuth();
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  const totalTokens = (Object.values(wallet.tokensByAsset) as number[]).reduce((a: number, b: number) => a + (b as number), 0);
  const totalAssets = (Object.values(wallet.tokensByAsset) as number[]).filter((count: number) => (count as number) > 0).length;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'BUY_TOKENS': return <ShoppingCart className="w-4 h-4 text-[#5F259F] dark:text-neon-emerald" />;
      case 'SWAP': return <RefreshCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
      case 'VERIFY': return <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-neon-emerald" />;
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-500" />;
      case 'COLLATERAL_LOCK': return <Landmark className="w-4 h-4 text-[#5F259F] dark:text-neon-emerald" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const cardVariants = {
    hover: {
      y: -4,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-10 animate-fintech-fade pb-20">
      <div className="pt-2">
        <h1 className="text-2xl font-black text-[#141A19] dark:text-white tracking-tight uppercase leading-none">Institutional Profile</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="fintech-card p-8 flex flex-col items-center text-center transition-all bg-[#F8F8F8] dark:bg-obsidian-900 border-[#EAEAEA] dark:border-white/5 shadow-lg"
          >
            <div className="w-24 h-24 rounded-2xl bg-[#5F259F] dark:bg-neon-emerald flex items-center justify-center text-white dark:text-obsidian-950 text-4xl font-black mb-6 border-4 border-white dark:border-obsidian-800 shadow-xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-[#141A19] dark:text-white tracking-tight uppercase">{user?.name}</h2>
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2 justify-center">
              <Mail className="w-3 h-3" /> {user?.email}
            </p>
            
            {user?.walletAddress && (
              <div className="mt-6 bg-white dark:bg-obsidian-800 p-3.5 rounded-xl border border-[#EAEAEA] dark:border-white/10 w-full">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registry Address</p>
                <p className="text-[9px] font-mono text-slate-600 dark:text-neon-emerald break-all select-all">{user.walletAddress}</p>
              </div>
            )}

            <div className="w-full h-px bg-[#EAEAEA] dark:bg-white/5 my-8"></div>
            
            <button 
              onClick={() => setShowUpdateNotice(true)}
              className="w-full py-3.5 bg-[#5F259F] dark:bg-neon-emerald text-white dark:text-obsidian-950 rounded-full font-black uppercase tracking-widest text-[9px] hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              Update Documents
            </button>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="fintech-card p-6 space-y-4 transition-all bg-[#F8F8F8] dark:bg-obsidian-900 border-[#EAEAEA] dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Network</span>
              <span className="text-[#141A19] dark:text-neon-emerald font-black">Polygon</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Status</span>
              <span className="text-[#141A19] dark:text-neon-emerald font-black">Verified</span>
            </div>
          </motion.div>
        </div>

        {/* Account Details & Activity */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: 'Units Held', value: totalTokens.toLocaleString(), accent: 'text-[#141A19]' },
              { label: 'Positions', value: totalAssets, accent: 'text-[#141A19]' },
              { label: 'Balance', value: `₹${wallet.stablecoinBalance.toLocaleString()}`, accent: 'text-[#5F259F] dark:text-neon-emerald' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="fintech-card p-6 bg-[#F8F8F8] dark:bg-obsidian-900 border-[#EAEAEA] dark:border-white/5 transition-all group relative overflow-hidden flex flex-col justify-center min-h-[110px]"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#5F259F]/5 dark:bg-neon-emerald/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 group-hover:text-[#5F259F] dark:group-hover:text-neon-emerald transition-colors">{stat.label}</p>
                <p className={`text-xl font-black tracking-tight dark:text-white ${stat.accent} leading-tight truncate`} title={stat.value.toString()}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="fintech-card overflow-hidden transition-all bg-[#F8F8F8] dark:bg-obsidian-900 border-[#EAEAEA] dark:border-white/5 shadow-xl"
          >
            <div className="px-8 py-6 border-b border-[#EAEAEA] dark:border-white/5 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-[#141A19] dark:text-white uppercase tracking-[0.2em]">Activity Ledger</h3>
              <button className="text-[9px] font-black text-[#5F259F] dark:text-neon-emerald uppercase tracking-widest flex items-center gap-1.5 hover:opacity-70 transition-all">
                Explorer <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            <div className="divide-y divide-[#EAEAEA] dark:divide-white/5">
              {wallet.history.length > 0 ? wallet.history.map((action) => (
                <div key={action.id} className="px-8 py-6 hover:bg-white dark:hover:bg-white/5 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-obsidian-800 flex items-center justify-center border border-[#EAEAEA] dark:border-white/10 shadow-sm transition-all group-hover:scale-105">
                        {getActionIcon(action.type)}
                      </div>
                      <div>
                        <p className="font-black text-[#141A19] dark:text-white text-[11px] uppercase tracking-tight">{action.description}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {format(new Date(action.timestamp), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {action.amount && (
                        <p className={`font-black text-[11px] uppercase tracking-tight ${action.type === 'BUY_TOKENS' || action.type === 'PAYMENT' ? 'text-red-500' : 'text-emerald-600 dark:text-neon-emerald'}`}>
                          {action.type === 'BUY_TOKENS' || action.type === 'PAYMENT' ? '-' : '+'}{action.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-16 text-center">
                  <Clock className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No Recent Activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Update Notice Modal */}
      {showUpdateNotice && (
        <div className="fixed inset-0 bg-[#141A19]/60 dark:bg-obsidian-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fintech-fade">
          <div className="bg-white dark:bg-obsidian-900 w-full max-w-sm rounded-[32px] border border-[#EAEAEA] dark:border-white/10 p-8 relative shadow-2xl overflow-hidden">
            <button 
              onClick={() => setShowUpdateNotice(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-[#141A19] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-[#5F259F] dark:bg-neon-emerald rounded-xl flex items-center justify-center text-white dark:text-obsidian-950 mb-6 border border-white dark:border-obsidian-800 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-[#141A19] dark:text-white tracking-tight uppercase mb-4 leading-none">Security Lock</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mb-8 uppercase tracking-tight">
              Registry updates suspended. Contact support for identity validation.
            </p>
            <button 
              onClick={() => setShowUpdateNotice(false)}
              className="w-full bg-[#5F259F] dark:bg-neon-emerald text-white dark:text-obsidian-950 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-md active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
