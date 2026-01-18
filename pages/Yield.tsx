
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, Percent, Info, Briefcase, Sparkles } from 'lucide-react';

const Yield: React.FC = () => {
  const { wallet, user } = useAuth();
  const assets = db.getAssets();

  // Calculate stats based on current wallet
  const totalMonthlyIncome = assets.reduce((acc, asset) => {
    const tokens = wallet.tokensByAsset[asset.id] || 0;
    const value = tokens * asset.tokenPrice;
    return acc + (value * (asset.yieldPercent / 100)) / 12;
  }, 0);

  const portfolioValue = assets.reduce((acc, asset) => {
    const tokens = wallet.tokensByAsset[asset.id] || 0;
    return acc + (tokens * asset.tokenPrice);
  }, 0);

  const avgYield = assets.filter(a => (wallet.tokensByAsset[a.id] || 0) > 0).reduce((acc, a, _, arr) => {
    return acc + (a.yieldPercent / arr.length);
  }, 0) || 0;

  const chartData = [
    { month: 'Jan', income: totalMonthlyIncome * 0.8 },
    { month: 'Feb', income: totalMonthlyIncome * 0.85 },
    { month: 'Mar', income: totalMonthlyIncome * 0.82 },
    { month: 'Apr', income: totalMonthlyIncome * 0.9 },
    { month: 'May', income: totalMonthlyIncome * 0.95 },
    { month: 'Jun', income: totalMonthlyIncome },
    { month: 'Jul', income: totalMonthlyIncome * 1.05 },
    { month: 'Aug', income: totalMonthlyIncome * 1.1 },
    { month: 'Sep', income: totalMonthlyIncome * 1.15 },
    { month: 'Oct', income: totalMonthlyIncome * 1.2 },
    { month: 'Nov', income: totalMonthlyIncome * 1.25 },
    { month: 'Dec', income: totalMonthlyIncome * 1.3 },
  ];

  const isInvestor = user?.role === 'INVESTOR';

  return (
    <div className="space-y-10 animate-fintech-fade pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-none">Yield Intelligence</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> {isInvestor ? 'Passive Earning Performance' : 'Asset Appreciation Stats'}
          </p>
        </div>
        <div className="bg-white dark:bg-obsidian-900 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-center gap-3 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Live Portfolio Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="fintech-card p-8 flex items-center gap-6 group hover:border-emerald-500/30 transition-all">
          <div className="p-4 bg-emerald-50 dark:bg-neon-emerald/10 rounded-2xl text-emerald-600 dark:text-neon-emerald border border-emerald-100 dark:border-neon-emerald/20 transition-transform group-hover:scale-110">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Monthly Earning</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">₹{totalMonthlyIncome.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</h3>
          </div>
        </div>
        <div className="fintech-card p-8 flex items-center gap-6 group hover:border-indigo-500/30 transition-all">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 transition-transform group-hover:scale-110">
            <Percent className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Avg. Yield Rate</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{avgYield.toFixed(2)}%</h3>
          </div>
        </div>
        <div className="fintech-card p-8 flex items-center gap-6 group hover:border-slate-800 transition-all">
          <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10 transition-transform group-hover:scale-110">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Yearly Forecast</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">₹{(totalMonthlyIncome * 12).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 fintech-card p-10 shadow-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div className="space-y-1">
               <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Earning Growth</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projected earnings over 12 months</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-[10px] font-black text-white bg-emerald-600 dark:bg-neon-emerald dark:text-obsidian-950 px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
                <ArrowUpRight className="w-4 h-4" /> +{(avgYield * 1.2).toFixed(1)}% Projected
              </span>
            </div>
          </div>
          <div className="h-[350px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}}
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0D1110', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    color: '#fff',
                    padding: '16px',
                    fontWeight: 'bold'
                  }}
                  itemStyle={{ color: '#00F5A0' }}
                  cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#6366F1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#00F5A0' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="fintech-card p-10 shadow-lg">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-8 leading-none">Asset Allocation</h2>
            <div className="space-y-8">
              {assets.filter(a => (wallet.tokensByAsset[a.id] || 0) > 0).length > 0 ? (
                assets.filter(a => (wallet.tokensByAsset[a.id] || 0) > 0).map(asset => {
                  const tokens = wallet.tokensByAsset[asset.id] || 0;
                  const share = (tokens * asset.tokenPrice / portfolioValue) * 100;
                  return (
                    <div key={asset.id} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate pr-4">{asset.name}</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-neon-emerald shrink-0">{share.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 dark:bg-neon-emerald h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${share}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-3">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Earning Impact</span>
                        <span className="text-[9px] text-slate-900 dark:text-slate-300 font-black">
                          ₹{((tokens * asset.tokenPrice * (asset.yieldPercent / 100)) / 12).toLocaleString(undefined, {maximumFractionDigits: 0})} / mo
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-4">
                  <Briefcase className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto opacity-50" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio Empty</p>
                </div>
              )}
            </div>
            <button className="w-full mt-10 py-5 bg-slate-900 dark:bg-white dark:text-obsidian-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95">
              Download Full Audit
            </button>
          </div>

          <div className="bg-indigo-600 dark:bg-neon-emerald p-10 rounded-[2.5rem] text-white dark:text-obsidian-950 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
               <Sparkles className="w-24 h-24" />
             </div>
             <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Wealth Strategy</span>
                </div>
                <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">Compound Your Monthly Earnings</h3>
                <p className="text-[11px] font-bold opacity-75 uppercase leading-relaxed tracking-tight">Reinvesting your earnings can increase your portfolio value by an estimated 14.5% over 3 years.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yield;
