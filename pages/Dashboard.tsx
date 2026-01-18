
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { db } from '../db.ts';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Landmark,
  Wallet,
  ArrowRight,
  CreditCard,
  History
} from 'lucide-react';
import StatCard from '../components/StatCard.tsx';

const Dashboard: React.FC = () => {
  const { user, wallet, setWalletModalOpen } = useAuth();
  const navigate = useNavigate();
  const assets = db.getAssets();
  
  const totalMonthlyIncome = useMemo(() => {
    return assets.reduce((acc, asset) => {
      const tokens = wallet.tokensByAsset[asset.id] || 0;
      const value = tokens * asset.tokenPrice;
      return acc + (value * (asset.yieldPercent / 100)) / 12;
    }, 0);
  }, [wallet.tokensByAsset, assets]);

  const shortAddress = user?.walletAddress 
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : null;

  return (
    <div className="space-y-8 animate-fintech-fade pb-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2 px-2">
        <div>
          <h1 className="text-2xl font-black text-[#141A19] dark:text-white tracking-tight uppercase leading-none">Portfolio Hub</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           {!shortAddress ? (
             <button 
              onClick={() => setWalletModalOpen(true)}
              className="px-6 py-3 bg-[#5F259F] dark:bg-neon-emerald text-white dark:text-obsidian-950 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group shadow-md active:scale-95"
             >
               <Wallet className="w-4 h-4" />
               Connect Identity
             </button>
           ) : (
             <div className="px-5 py-3 bg-white dark:bg-obsidian-800 rounded-full border border-registry-border dark:border-white/10 flex items-center gap-2.5 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-neon-emerald animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-600 dark:text-neon-emerald uppercase tracking-widest">{shortAddress}</span>
             </div>
           )}
           
           <button 
            onClick={() => navigate('/marketplace')}
            className="px-8 py-3 bg-[#5F259F] dark:bg-neon-emerald text-white dark:text-obsidian-950 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-2 active:scale-95 group"
           >
             Buy Tokens <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        <StatCard 
          title="Cash Balance" 
          value={`₹${wallet.stablecoinBalance.toLocaleString()}`} 
          change="+4.2%" 
          positive={true}
          icon={Wallet}
        />
        <StatCard 
          title="Assets Value" 
          value={`₹${wallet.totalInvested.toLocaleString()}`} 
          change="+12.5%" 
          positive={true}
          icon={Building2}
        />
        <StatCard 
          title="Monthly Yield" 
          value={`₹${totalMonthlyIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo`} 
          change="+₹1,200" 
          positive={true}
          icon={TrendingUp}
        />
        <StatCard 
          title="Collateralized" 
          value={`₹${wallet.lockedCollateral.toLocaleString()}`} 
          icon={Landmark}
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid lg:grid-cols-12 gap-8 px-2">
        <div className="lg:col-span-8 space-y-6">
          <div className="fintech-card p-6 shadow-lg bg-[#F8F8F8] border-[#EAEAEA] dark:bg-obsidian-900 dark:border-white/5">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
                </div>
             </div>
             
             <div className="space-y-3">
                {wallet.history.slice(0, 5).map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-5 hover:bg-white dark:hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-[#EAEAEA] dark:hover:border-white/10 group shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 bg-white dark:bg-obsidian-800 rounded-xl flex items-center justify-center border border-[#EAEAEA] dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                        <Clock className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight line-clamp-1">{action.description}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{new Date(action.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {action.amount && (
                      <p className="text-sm font-black text-slate-900 dark:text-neon-emerald shrink-0 ml-4">{action.amount}</p>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="primary-gradient p-8 rounded-[32px] text-white dark:text-obsidian-950 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight leading-tight">Registry Guard</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-75 leading-relaxed">Secured by institutional smart contracts.</p>
                 </div>
                 <button 
                  onClick={() => navigate('/verify')}
                  className="w-full py-4 bg-white text-[#5F259F] dark:text-obsidian-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all active:scale-95"
                 >
                   Verify Registry
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
