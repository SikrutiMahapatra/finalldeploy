
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { db } from '../db.ts';
import { 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  Globe, 
  X,
  CreditCard,
  Rocket
} from 'lucide-react';

const BuilderTokenize: React.FC = () => {
  const { user, tokenizeAssetBuilder } = useAuth();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedSuccess, setMintedSuccess] = useState(false);

  const allAssets = db.getAssets();
  
  const myVerifiedAssets = useMemo(() => {
    // Builders can tokenize assets they own that are currently in VERIFIED state
    // For demo purposes, we check if ownerEmail matches or if it's the builder placeholder
    return allAssets.filter(a => 
      (a.ownerEmail === user?.email || a.ownerEmail === 'builder@example.com') && 
      a.status === 'VERIFIED'
    );
  }, [allAssets, user]);

  const selectedAsset = allAssets.find(a => a.id === selectedAssetId);

  const handleMint = async () => {
    if (!selectedAssetId) return;
    setIsMinting(true);
    try {
      // Simulate on-chain minting delay
      await new Promise(r => setTimeout(r, 2000));
      await tokenizeAssetBuilder(selectedAssetId);
      setMintedSuccess(true);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">Fractionalize Assets</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mt-2 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Minting Institutional Units on Polygon
          </p>
        </div>
      </div>

      {!selectedAssetId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myVerifiedAssets.length > 0 ? (
            myVerifiedAssets.map(asset => (
              <div key={asset.id} className="bg-white dark:bg-slate-900 border-4 border-slate-900 rounded-[2.5rem] p-8 space-y-6 shadow-xl hover:-translate-y-2 transition-all group">
                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-slate-900 relative">
                  <img src={asset.image} className="w-full h-full object-cover" alt="" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 border-slate-900">Verified</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">{asset.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                    <Globe className="w-3.5 h-3.5" /> {asset.location}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-900">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total Units</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{asset.totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-900">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Value/Unit</p>
                    <p className="text-sm font-black text-indigo-600">₹{asset.tokenPrice.toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAssetId(asset.id)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border-b-4 border-indigo-500 hover:bg-indigo-600 transition-all"
                >
                  Configure Tokens <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 bg-white dark:bg-slate-900 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center">
               <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No verified assets ready</h3>
               <p className="text-sm font-bold text-slate-500 mt-2">Submit your listings for verification first.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-950 border-4 border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 bg-slate-50 dark:bg-slate-900 p-12 border-r-4 border-slate-900">
                <button 
                  onClick={() => { setSelectedAssetId(null); setMintedSuccess(false); }}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-10 hover:underline"
                >
                  <X className="w-4 h-4" /> Back to List
                </button>
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 border-b-4 border-slate-900">
                  <Rocket className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-6">Token Minting</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Asset</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{selectedAsset?.name}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-900">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Initial Valuation</p>
                    <p className="text-xl font-black text-indigo-600">₹{(selectedAsset!.totalTokens * selectedAsset!.tokenPrice).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-12 space-y-10">
                {!mintedSuccess ? (
                  <>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-8">Supply Parameters</h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Supply</label>
                            <input readOnly value={selectedAsset?.totalTokens} className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-slate-900 font-black" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Unit Price (Fixed)</label>
                            <input readOnly value={`₹${selectedAsset?.tokenPrice}`} className="w-full px-4 py-3 bg-slate-100 rounded-xl border-2 border-slate-900 font-black" />
                          </div>
                        </div>
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border-2 border-indigo-600/30 flex items-start gap-4">
                           <Zap className="w-6 h-6 text-indigo-600 shrink-0" />
                           <p className="text-[10px] font-black text-indigo-600/80 uppercase tracking-widest leading-relaxed">By clicking "Deploy", you will mint {selectedAsset?.totalTokens} units on Polygon and list them for institutional trade.</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleMint}
                      disabled={isMinting}
                      className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 border-b-8 border-black shadow-2xl active:translate-y-1"
                    >
                      {isMinting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <><Sparkles className="w-5 h-5" /> Deploy Value Rail</>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-8">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-slate-900 animate-in zoom-in duration-500">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Minting Complete</h3>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-4 max-w-xs mx-auto">Asset units are now live and discoverable in the institutional marketplace.</p>
                    </div>
                    <div className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-900 font-mono text-[9px] break-all text-slate-500">
                       PROPTX_0x{selectedAsset?.id.toUpperCase()}_MINT_SUCCESS
                    </div>
                    <button 
                      onClick={() => { setSelectedAssetId(null); setMintedSuccess(false); }}
                      className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] border-b-4 border-slate-900"
                    >
                      Return to Listings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderTokenize;
