
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db';
import { 
  CheckCircle2, 
  Loader2, 
  Search, 
  TrendingUp,
  X,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  ChevronRight,
  Coins,
  ArrowLeft,
  Wallet,
  User as UserIcon,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

type PurchaseStep = 'DETAILS' | 'QUANTITY' | 'SUCCESS';

const Marketplace: React.FC = () => {
  const { buyTokens, wallet } = useAuth();
  const assets = db.getAssets();
  const location = useLocation();
  
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<PurchaseStep>('DETAILS');
  const [tokenCount, setTokenCount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchTerm(q);
  }, [location.search]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const isActive = asset.status === 'ACTIVE' || asset.status === 'VERIFIED';
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           asset.location.toLowerCase().includes(searchTerm.toLowerCase());
      return isActive && matchesSearch;
    });
  }, [searchTerm, assets]);

  const selectedAsset = assets.find(a => a.id === selectedAssetId);
  const totalPrice = selectedAsset ? selectedAsset.tokenPrice * tokenCount : 0;
  const canAfford = wallet.stablecoinBalance >= totalPrice;

  const handlePurchase = async () => {
    if (!selectedAssetId || !canAfford) return;
    setIsProcessing(true);
    setTxHash(null);
    setError(null);
    try {
      const hash = await buyTokens(selectedAssetId, tokenCount);
      setTxHash(hash);
      setPurchaseStep('SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Institutional settlement failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openDetails = (id: string) => {
    setSelectedAssetId(id);
    setPurchaseStep('DETAILS');
    setTokenCount(1);
    setError(null);
  };

  const closeFrame = () => {
    setSelectedAssetId(null);
    setPurchaseStep('DETAILS');
    setTxHash(null);
    setError(null);
  };

  return (
    <div className="space-y-10 animate-fintech-fade pb-24 max-w-7xl mx-auto">
      {/* Optimized Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4">
        <div className="flex-1 space-y-2 px-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">BUY TOKENS</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
            Fractional Asset Pool • 100% Legal Clearance • Entry from ₹5,000
          </p>
        </div>
        <div className="relative group w-full lg:max-w-sm shrink-0 px-2 md:px-0">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-fintech-purple-600 transition-colors" />
           <input 
            type="text" 
            placeholder="Search registry..." 
            className="w-full bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 pl-11 pr-6 py-4 rounded-[18px] outline-none text-[10px] font-black uppercase tracking-wider placeholder-slate-400 dark:text-white focus:ring-4 focus:ring-fintech-purple-600/5 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Property Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0">
        {filteredAssets.length > 0 ? filteredAssets.map((asset) => (
          <motion.div 
            key={asset.id} 
            whileHover={{ y: -8 }}
            onClick={() => openDetails(asset.id)}
            className="fintech-card overflow-hidden shadow-xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] flex flex-col cursor-pointer group transition-all duration-500 relative"
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <img src={asset.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={asset.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 left-4">
                 <div className="bg-white/95 dark:bg-obsidian-950/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/50 dark:border-white/10 shadow-lg">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-neon-emerald" />
                    <span className="text-[9px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Safe Registry</span>
                 </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-base font-black text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl leading-none">
                  ₹{asset.tokenPrice.toLocaleString()} <span className="text-[9px] opacity-60 ml-1">/ UNIT</span>
                </p>
              </div>
            </div>
            
            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none group-hover:text-fintech-purple-600 dark:group-hover:text-neon-emerald transition-colors truncate">{asset.name}</h3>
                <p className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-2">
                  <MapPin className="w-3.5 h-3.5" /> {asset.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 shadow-inner">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Yield</p>
                  <p className="font-black text-xs uppercase tracking-tight text-emerald-600 dark:text-neon-emerald flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +{asset.yieldPercent}%
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 shadow-inner">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Type</p>
                  <p className="font-black text-[9px] uppercase tracking-tight text-slate-700 dark:text-slate-300 truncate">Tokenized Plot</p>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-24 text-center fintech-card border-dashed border-2 mx-2">
            <Search className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-tight">No Registry Matches</h3>
            <button onClick={() => setSearchTerm('')} className="mt-6 text-fintech-purple-600 font-black uppercase text-[9px] tracking-widest hover:underline">Clear Global Filters</button>
          </div>
        )}
      </div>

      {/* Immersive Full-Screen Property Detail Modal */}
      <AnimatePresence>
        {selectedAssetId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-obsidian-950 z-[100] flex flex-col overflow-hidden"
          >
            {/* Top Navigation Bar */}
            <div className="px-6 md:px-10 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-white/50 dark:bg-obsidian-950/50 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-4">
                {(purchaseStep === 'QUANTITY' || purchaseStep === 'SUCCESS') ? (
                  <button 
                    onClick={() => setPurchaseStep('DETAILS')}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105 bg-slate-100 dark:bg-white/5 rounded-xl"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={closeFrame}
                    className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Registry
                  </button>
                )}
                <div className="hidden md:flex flex-col">
                  <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                    {purchaseStep === 'SUCCESS' ? 'ASSET SECURED' : selectedAsset?.name}
                  </h2>
                </div>
              </div>

              {purchaseStep !== 'SUCCESS' && (
                <div className="flex items-center gap-4">
                   <div className="hidden lg:flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset ID</span>
                      <span className="text-[10px] font-mono font-bold dark:text-neon-emerald">{selectedAsset?.id}</span>
                   </div>
                   <button 
                    onClick={closeFrame} 
                    className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-white/5 rounded-xl shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {purchaseStep === 'DETAILS' && (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col"
                  >
                    {/* Hero Section - Reduced Header Size */}
                    <div className="aspect-[21/9] md:aspect-[21/5] w-full relative overflow-hidden">
                      <img 
                        src={selectedAsset?.image} 
                        className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-110" 
                        alt={selectedAsset?.name} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 md:left-20 right-6 md:right-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                         <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 bg-neon-emerald px-2 py-1 rounded-lg text-obsidian-950 text-[8px] font-black uppercase tracking-widest shadow-xl">
                              <ShieldCheck className="w-3 h-3" /> Legal Verified
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">{selectedAsset?.name}</h1>
                            <div className="flex items-center gap-2 text-white/80">
                              <MapPin className="w-3.5 h-3.5 text-neon-emerald" />
                              <span className="text-sm font-bold uppercase tracking-widest">{selectedAsset?.location}</span>
                            </div>
                         </div>
                         <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-[24px] border border-white/20 text-white min-w-[240px] shadow-2xl">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Unit Price</p>
                            <p className="text-2xl font-black tracking-tighter mb-1">₹{selectedAsset?.tokenPrice.toLocaleString()}</p>
                            <div className="flex items-center gap-1.5 text-neon-emerald font-black text-[8px] uppercase tracking-widest">
                              <TrendingUp className="w-3 h-3" /> Market Active
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="px-6 md:px-20 py-10 lg:py-12 grid lg:grid-cols-12 gap-10">
                       <div className="lg:col-span-8 space-y-10">
                          {/* Property Details Grid - Scaled Typography */}
                          <div className="grid md:grid-cols-2 gap-6">
                             <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-3 group hover:border-fintech-purple-600/30 transition-all duration-500 shadow-sm hover:shadow-xl">
                                <div className="flex items-center gap-3 text-slate-400">
                                  <UserIcon className="w-4 h-4" />
                                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Custodian</span>
                                </div>
                                <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                                  {selectedAsset?.ownerName || 'Strategic Builder'}
                                </p>
                             </div>
                             <div className="p-6 bg-indigo-50 dark:bg-indigo-600/10 rounded-[32px] border border-indigo-100 dark:border-indigo-600/20 flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Growth PA</span>
                                </div>
                                <div>
                                  <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300 tracking-tighter">+{selectedAsset?.yieldPercent}%</p>
                                </div>
                             </div>
                          </div>

                          {/* Detailed Summary - Scaled Typography */}
                          <div className="space-y-6">
                             <div className="flex items-center gap-3 text-fintech-purple-600 dark:text-neon-emerald">
                                <div className="w-8 h-8 rounded-lg bg-fintech-purple-50 dark:bg-neon-emerald/10 flex items-center justify-center border border-fintech-purple-100 dark:border-neon-emerald/20">
                                  <Briefcase className="w-4 h-4" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Property Summary</h3>
                             </div>
                             <div className="p-10 bg-white dark:bg-obsidian-900 rounded-[36px] border border-slate-100 dark:border-white/5 shadow-inner-lg space-y-6">
                                <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                  Positioned in <span className="text-slate-900 dark:text-white font-black">{selectedAsset?.location}</span>, this asset has cleared audit. 
                                  Ownership is 1:1 tokenized on institutional rails.
                                </p>
                                <div className="grid md:grid-cols-3 gap-6">
                                   <div className="space-y-1">
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Risk Profile</p>
                                      <span className="text-[11px] font-black dark:text-white uppercase">{selectedAsset?.risk}</span>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset Pool</p>
                                      <p className="text-[11px] font-black dark:text-white uppercase">{selectedAsset?.totalTokens.toLocaleString()} Units</p>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                      <p className="text-[11px] font-black text-emerald-600 dark:text-neon-emerald uppercase">Operational</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Acquisition Sidebar - Scaled Down */}
                       <div className="lg:col-span-4 space-y-6">
                          <div className="p-8 bg-slate-900 rounded-[36px] text-white space-y-6 shadow-2xl relative overflow-hidden border border-white/5 sticky top-32">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                             <div className="space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                                  <Coins className="w-6 h-6 text-neon-emerald" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Buy Tokens</h3>
                                <p className="text-[9px] font-bold text-white/50 leading-relaxed uppercase tracking-widest">Expand your institutional registry portfolio.</p>
                             </div>

                             <div className="space-y-3 border-t border-white/10 pt-6">
                                <div className="flex justify-between items-end">
                                   <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Price / Unit</span>
                                   <span className="text-xl font-black tracking-tighter">₹{selectedAsset?.tokenPrice.toLocaleString()}</span>
                                </div>
                             </div>

                             <button 
                              onClick={() => setPurchaseStep('QUANTITY')}
                              className="w-full py-5 bg-white dark:bg-neon-emerald text-obsidian-950 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-xl flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.98] transition-all"
                             >
                              Choose Units <ArrowRight className="w-4 h-4" />
                             </button>
                          </div>

                          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[28px] border border-slate-100 dark:border-white/5 flex items-start gap-4">
                             <Info className="w-6 h-6 text-fintech-purple-600 dark:text-neon-emerald shrink-0" />
                             <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Safe & Audited</p>
                                <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                  Ownership recorded on a secure ledger. Each unit represents audited physical property.
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {purchaseStep === 'QUANTITY' && (
                  <motion.div 
                    key="quantity"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-xl mx-auto p-12 lg:p-16 space-y-12"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-fintech-purple-50 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto text-fintech-purple-600 dark:text-white border border-fintech-purple-100/50">
                        <Coins className="w-7 h-7" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Select Units</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">{selectedAsset?.name}</p>
                    </div>

                    <div className="space-y-8">
                       <div className="bg-slate-50 dark:bg-obsidian-900 p-8 rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-inner transition-all focus-within:ring-4 focus-within:ring-fintech-purple-600/5 group">
                          <input 
                            type="number" 
                            min="1"
                            autoFocus
                            className="flex-1 bg-transparent text-3xl font-black outline-none tracking-tighter text-slate-900 dark:text-white w-full pr-4"
                            value={tokenCount || ''}
                            onChange={e => setTokenCount(Math.max(1, parseInt(e.target.value) || 0))}
                          />
                          <div className="flex flex-col items-end shrink-0 pointer-events-none">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">UNITS</span>
                            <span className="text-xs font-black text-fintech-purple-600 dark:text-neon-emerald">₹{selectedAsset?.tokenPrice.toLocaleString()} ea</span>
                          </div>
                       </div>

                       <div className="p-8 bg-slate-900 rounded-[32px] text-white shadow-xl space-y-6 relative overflow-hidden border border-white/5">
                          <div className="flex justify-between items-center border-b border-white/10 pb-6">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Total Cost</span>
                             <span className="text-3xl font-black tracking-tighter text-white leading-none">₹{totalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center px-2">
                             <div className="flex items-center gap-4">
                               <Wallet className={`w-5 h-5 ${canAfford ? 'text-emerald-400' : 'text-red-400'}`} />
                               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Available Balance</span>
                             </div>
                             <span className={`text-xl font-black tracking-tight ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>₹{wallet.stablecoinBalance.toLocaleString()}</span>
                          </div>
                       </div>
                    </div>

                    {error && (
                      <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-[24px] border border-red-100 dark:border-red-900/30 flex items-center gap-4 text-[10px] font-black text-red-600 uppercase tracking-widest justify-center">
                        <AlertCircle className="w-5 h-5" /> {error}
                      </div>
                    )}

                    <button 
                      onClick={handlePurchase}
                      disabled={isProcessing || !canAfford || tokenCount <= 0}
                      className="w-full primary-gradient text-white py-6 rounded-full font-black uppercase tracking-[0.3em] text-[11px] shadow-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Complete Purchase <ArrowRight className="w-6 h-6" /></>}
                    </button>
                  </motion.div>
                )}

                {purchaseStep === 'SUCCESS' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-16 space-y-10"
                  >
                     <div className="w-32 h-32 bg-emerald-50 dark:bg-neon-emerald/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-neon-emerald mx-auto border-4 border-emerald-500 dark:border-neon-emerald shadow-2xl">
                        <CheckCircle2 className="w-16 h-16" />
                     </div>
                     <div className="space-y-4 px-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Asset Secured</h2>
                        <p className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
                          {tokenCount} units of {selectedAsset?.name} added to portfolio.
                        </p>
                     </div>
                     <div className="w-full max-w-lg bg-slate-50 dark:bg-white/5 p-8 rounded-[32px] font-mono text-[10px] text-slate-400 break-all select-all flex flex-col items-center gap-4 border border-slate-100 dark:border-white/5 shadow-inner">
                        <span className="font-black uppercase text-slate-500 tracking-widest">Transaction ID</span>
                        {txHash}
                     </div>
                     <button 
                        onClick={closeFrame}
                        className="bg-slate-900 dark:bg-white text-white dark:text-obsidian-950 px-16 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:opacity-90 active:scale-95 transition-all"
                     >
                        Return to Dashboard
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
