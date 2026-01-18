
import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, Loader2, AlertCircle, TrendingUp, Info, CheckCircle2, ArrowRight, FileText, Gavel } from 'lucide-react';
import { db } from '../db';
import { useAuth } from '../context/AuthContext.tsx';
import { Asset, AssetLifecycle } from '../types';

const Verify: React.FC = () => {
  const { user, submitForAudit, verifyAssetAdmin } = useAuth();
  const [assetId, setAssetId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Asset | null>(null);
  const [error, setError] = useState('');

  const allAssets = db.getAssets();
  const isBuilder = user?.role === 'BUILDER';
  const isAdmin = user?.role === 'ADMIN';
  
  const myActionableAssets = useMemo(() => {
    if (isAdmin) {
      return allAssets.filter(a => a.status === 'SUBMITTED');
    }
    if (isBuilder) {
      return allAssets.filter(a => a.ownerEmail === user?.email && (a.status === 'DRAFT' || a.status === 'SUBMITTED'));
    }
    return [];
  }, [allAssets, user, isBuilder, isAdmin]);

  const handleAction = async (asset: Asset) => {
    setIsProcessing(true);
    setError('');
    try {
      if (isAdmin && asset.status === 'SUBMITTED') {
        await verifyAssetAdmin(asset.id);
        setResult(db.getAssets().find(a => a.id === asset.id) || null);
      } else if (isBuilder && asset.status === 'DRAFT') {
        await submitForAudit(asset.id);
        setResult(db.getAssets().find(a => a.id === asset.id) || null);
      }
    } catch (err: any) {
      setError(err.message || "Protocol error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const searchAsset = () => {
    if (!assetId) return;
    const found = allAssets.find(a => a.id.toLowerCase() === assetId.toLowerCase() || a.name.toLowerCase().includes(assetId.toLowerCase()));
    if (found) {
      setResult(found);
      setError('');
    } else {
      setError('Registry entry not found.');
      setResult(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fintech-fade">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Audit & Registry</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Compliance Lifecycle Management</p>
        </div>
        {isAdmin && (
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
            Admin Auth Active
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className={`${myActionableAssets.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8`}>
          <div className="fintech-card p-8 border border-emerald-900/10 dark:border-neon-emerald/20 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Asset ID or Registry Name..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-obsidian-800 border border-slate-200 dark:border-white/10 dark:text-slate-100 outline-none focus:ring-4 focus:ring-fintech-purple-600/5 font-bold uppercase text-xs tracking-widest"
                  value={assetId}
                  onChange={e => setAssetId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchAsset()}
                />
              </div>
              <button 
                onClick={searchAsset}
                className="bg-slate-900 dark:bg-emerald-500 text-white dark:text-obsidian-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Search Registry
              </button>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-500/20 flex items-center gap-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-bold uppercase tracking-tight text-xs">{error}</p>
            </div>
          )}

          {result && (
            <div className="fintech-card overflow-hidden animate-fintech-fade shadow-2xl bg-white dark:bg-obsidian-900">
              <div className={`p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8 ${
                result.status === 'VERIFIED' ? 'bg-emerald-600 dark:bg-neon-emerald/20 dark:text-neon-emerald' : 
                result.status === 'ACTIVE' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">
                    <ShieldCheck className="w-4 h-4" /> Status: {result.status}
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter leading-none dark:text-white">{result.name}</h2>
                  <p className="text-sm font-bold opacity-80 mt-2 uppercase tracking-widest">{result.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Audit Rating</p>
                  <div className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest border border-white/20 ${
                    result.risk === 'Low' ? 'bg-emerald-500/30' : result.risk === 'Medium' ? 'bg-amber-500/30' : 'bg-red-500/30'
                  }`}>
                    {result.risk} Risk
                  </div>
                </div>
              </div>

              <div className="p-10 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pb-3 border-b border-slate-100 dark:border-white/5">Digital Document Vault</h3>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-obsidian-800 border border-slate-100 dark:border-white/5">
                    <FileText className="w-6 h-6 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase">Title Deed Audit</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">Institutional clearance of land records.</p>
                    </div>
                  </div>
                  {result.verificationHash && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-neon-emerald/10 border border-emerald-100 dark:border-neon-emerald/20">
                      <p className="text-[9px] font-black text-emerald-600 dark:text-neon-emerald uppercase mb-1">On-Chain Proof Hash</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{result.verificationHash}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] pb-3 border-b border-slate-100 dark:border-white/5">Available Actions</h3>
                  
                  {isBuilder && result.status === 'DRAFT' && (
                    <button 
                      onClick={() => handleAction(result)}
                      disabled={isProcessing}
                      className="w-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-obsidian-950 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit for Legal Audit <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  )}

                  {isAdmin && result.status === 'SUBMITTED' && (
                    <button 
                      onClick={() => handleAction(result)}
                      disabled={isProcessing}
                      className="w-full bg-emerald-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Approve & Verify Asset <ShieldCheck className="w-4 h-4" /></>}
                    </button>
                  )}

                  {result.status === 'VERIFIED' && (
                    <div className="p-6 bg-emerald-50 dark:bg-neon-emerald/10 rounded-2xl border border-emerald-100 dark:border-neon-emerald/20 flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-neon-emerald" />
                      <p className="text-[10px] font-black text-emerald-700 dark:text-neon-emerald uppercase leading-relaxed">
                        Asset verified. Ready for fractional tokenization.
                      </p>
                    </div>
                  )}

                  {result.status === 'ACTIVE' && (
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-4">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                      <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase leading-relaxed">
                        Institutional trade live on Polygon Value Rail.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {myActionableAssets.length > 0 && (
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
              <Gavel className="w-4 h-4" /> Pending Queue
            </h2>
            <div className="space-y-4">
              {myActionableAssets.map(asset => (
                <button 
                  key={asset.id}
                  onClick={() => setResult(asset)}
                  className={`w-full fintech-card p-6 text-left group transition-all flex items-center justify-between border-2 ${
                    result?.id === asset.id ? 'border-fintech-purple-600 dark:border-neon-emerald bg-slate-50 dark:bg-white/5' : 'border-transparent bg-white dark:bg-obsidian-900'
                  }`}
                >
                  <div>
                    <p className="font-black text-slate-800 dark:text-white text-xs uppercase">{asset.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${asset.status === 'DRAFT' ? 'bg-slate-300' : 'bg-amber-400'}`}></span>
                       {asset.status}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-fintech-purple-600 dark:group-hover:text-neon-emerald group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
