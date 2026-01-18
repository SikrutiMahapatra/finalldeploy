
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db.ts';
import { ShieldCheck, MapPin, TrendingUp, Info, ChevronLeft, CreditCard, Star, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = db.getAssets().find(a => a.id === id);

  if (!asset) return <div className="p-20 text-center font-black">404: ASSET_NOT_FOUND</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fintech-fade px-2">
      <button 
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black uppercase text-[10px] tracking-widest pt-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-video rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 shadow-2xl relative">
            <img src={asset.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <div className="bg-white/95 dark:bg-obsidian-900/95 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl border border-white/50 dark:border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-neon-emerald" />
                <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Legally Verified</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-2">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{asset.name}</h1>
                <p className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] tracking-widest mt-2">
                  <MapPin className="w-4 h-4" /> {asset.location}
                </p>
              </div>
              <div className="text-left md:text-right shrink-0">
                 <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Rating: AAA</p>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-white dark:bg-obsidian-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-8">
               <div className="space-y-2 text-center sm:text-left">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Annual Yield</p>
                 <p className="text-3xl font-black text-indigo-600 dark:text-neon-emerald">{asset.yieldPercent}%</p>
               </div>
               <div className="space-y-2 text-center sm:text-left">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Price</p>
                 <p className="text-3xl font-black text-slate-900 dark:text-white">₹{asset.tokenPrice.toLocaleString()}</p>
               </div>
               <div className="space-y-2 text-center sm:text-left">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</p>
                 <p className={`text-3xl font-black ${asset.risk === 'Low' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>{asset.risk}</p>
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pb-3 border-b border-slate-100 dark:border-white/10">Registry Intelligence</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-7 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 space-y-4 group">
                   <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                      <div className="w-10 h-10 bg-white dark:bg-obsidian-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-neon-emerald" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">Title Clearance</span>
                   </div>
                   <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase leading-relaxed tracking-tight">
                     Institutional legal audit confirmed. All registry records and encumbrances have been cleared.
                   </p>
                </div>
                <div className="p-7 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 space-y-4 group">
                   <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                      <div className="w-10 h-10 bg-white dark:bg-obsidian-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                        <Clock className="w-5 h-5 text-indigo-600 dark:text-neon-emerald" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">Appreciation Trend</span>
                   </div>
                   <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase leading-relaxed tracking-tight">
                     Local region growth tracking at +12.4% annually based on institutional market data.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="fintech-card p-10 shadow-2xl border-indigo-600/10 bg-white dark:bg-obsidian-900">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Acquire Units</h3>
                 <div className="bg-emerald-100 dark:bg-neon-emerald/10 text-emerald-700 dark:text-neon-emerald px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">Active</div>
               </div>
               
               <div className="space-y-8">
                  <div className="p-8 bg-indigo-50 dark:bg-white/5 rounded-[2rem] border border-indigo-100 dark:border-white/10 flex flex-col gap-1 shadow-inner">
                    <span className="text-[10px] font-black text-indigo-400 dark:text-slate-500 uppercase tracking-widest mb-1">Fixed Asset Price</span>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₹{asset.tokenPrice.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase">Per Unit</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-start gap-4 shadow-sm">
                    <Info className="w-5 h-5 text-indigo-600 dark:text-neon-emerald shrink-0" />
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                      Institutional Guard: Units are 1:1 backed by audited physical real estate assets.
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate('/marketplace')}
                    className="w-full primary-gradient text-white dark:text-obsidian-950 py-7 rounded-full font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all active:scale-[0.98]"
                  >
                    Start Acquisition <CreditCard className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
               <div className="flex items-center gap-4 mb-6">
                  <TrendingUp className="w-6 h-6 text-emerald-400 dark:text-neon-emerald" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Earning Forecast</span>
               </div>
               <p className="text-3xl font-black tracking-tighter mb-3 leading-none uppercase">₹{(asset.tokenPrice * 10 * (asset.yieldPercent/100)).toLocaleString()} <span className="text-sm opacity-30 font-bold">/ YEAR</span></p>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                 Estimated passive earning for acquiring 10 fractional units in this position.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
