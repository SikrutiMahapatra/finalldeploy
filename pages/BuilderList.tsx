
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Info, 
  User, 
  Briefcase, 
  Globe, 
  Wallet, 
  ArrowLeft,
  Calendar,
  Layers,
  Search,
  Check,
  Zap,
  ShieldCheck,
  History,
  TrendingUp,
  SearchCode,
  Map as MapIcon,
  Activity,
  Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, label: 'Identity', icon: User },
  { id: 2, label: 'Asset Info', icon: Building2 },
  { id: 3, label: 'SPV Details', icon: Briefcase },
  { id: 4, label: 'Documents', icon: FileText },
  { id: 5, label: 'Financials', icon: DollarSign },
  { id: 6, label: 'Review', icon: CheckCircle2 },
];

const BuilderList: React.FC = () => {
  const { listAsset, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Identity
    walletAddress: user?.walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    did: 'did:polygon:0x' + Math.random().toString(16).slice(2, 10),
    
    // Step 2: Asset Info
    name: 'Cyber Vista Corporate Park',
    category: 'Real Estate',
    propertyType: 'Commercial',
    address: 'DLF Cyber City, Phase 3',
    city: 'Gurgaon',
    state: 'Haryana',
    postalCode: '122002',
    latitude: '28.4946354',
    longitude: '77.0887457',
    size: '45000',
    age: '5',
    condition: 'Excellent',

    // Step 3: SPV Details
    spvName: 'CyberVista Holdings LLP',
    registrationNumber: 'AAH-9921-IN',
    jurisdiction: 'India - Haryana',
    incorporationDate: '2021-05-12',
    spvAddress: 'Level 12, Tower C, DLF Cyber City',
    directors: 'Vikram Malhotra, Sarah Ahmed',

    // Step 5: Financials
    valuation: 850000000,
    yieldPercent: 9.45,
    monthlyRent: 6500000,
    targetRaise: 250000000,
    risk: 'Low' as 'Low' | 'Medium' | 'High',
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    titleDeed: true,
    spvReg: true,
    taxReceipt: true,
    surveyMap: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 6));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleList = async () => {
    setIsSubmitting(true);
    try {
      await listAsset({
        ...formData,
        totalTokens: 10000,
        tokenPrice: formData.valuation / 10000,
      });
      navigate('/verify');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-12">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = step === s.id;
        const isCompleted = step > s.id;
        return (
          <React.Fragment key={s.id}>
            <button 
              onClick={() => setStep(s.id)}
              className="flex flex-col items-center gap-3 relative group transition-all outline-none"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                isActive ? 'bg-fintech-purple-600 border-fintech-purple-600 text-white shadow-lg' : 
                isCompleted ? 'bg-fintech-purple-100 border-fintech-purple-600 text-fintech-purple-600' : 
                'bg-white border-slate-200 text-slate-300 group-hover:border-fintech-purple-600/30'
              }`}>
                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest absolute -bottom-6 whitespace-nowrap transition-colors ${isActive ? 'text-fintech-purple-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? 'bg-fintech-purple-600' : 'bg-slate-200'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const inputClass = "w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-800 font-bold text-sm outline-none focus:ring-4 focus:ring-fintech-purple-600/5 transition-all text-slate-800 dark:text-white placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-obsidian-950 pb-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-fintech-purple-600 font-black text-xs uppercase tracking-widest mb-10 hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {renderStepper()}

        <div className="mt-16 bg-white dark:bg-obsidian-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Identity & Wallet</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Connect your identity for ownership verification</p>
                  </div>
                  <div className="grid gap-8">
                    <div className="space-y-3">
                      <label className={labelClass}>Wallet Address *</label>
                      <input readOnly value={formData.walletAddress} className={`${inputClass} bg-slate-100 dark:bg-obsidian-950/50 opacity-70 cursor-not-allowed`} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Decentralized ID (DID)</label>
                      <input readOnly value={formData.did} className={`${inputClass} bg-slate-100 dark:bg-obsidian-950/50 opacity-70 cursor-not-allowed`} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Asset Information</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Core details of the property asset</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-3">
                      <label className={labelClass}>Asset Name *</label>
                      <input name="name" placeholder="e.g., Gurgaon Skyview Complex" className={inputClass} value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Category *</label>
                      <select name="category" className={inputClass} value={formData.category} onChange={handleInputChange}>
                        <option>Real Estate</option>
                        <option>Agriculture</option>
                        <option>Industrial</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Property Type *</label>
                      <select name="propertyType" className={inputClass} value={formData.propertyType} onChange={handleInputChange}>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Vacant Land</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className={labelClass}>Address *</label>
                      <input name="address" placeholder="Full property address" className={inputClass} value={formData.address} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>City *</label>
                      <input name="city" className={inputClass} value={formData.city} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>State *</label>
                      <input name="state" className={inputClass} value={formData.state} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Postal Code *</label>
                      <input name="postalCode" className={inputClass} value={formData.postalCode} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Size (SQ FT) *</label>
                      <input type="number" name="size" className={inputClass} value={formData.size} onChange={handleNumericChange} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">SPV Details</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Special Purpose Vehicle holding the asset</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className={labelClass}>SPV Name *</label>
                      <input name="spvName" placeholder="PropToken Holding LLP" className={inputClass} value={formData.spvName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Registration Number *</label>
                      <input name="registrationNumber" placeholder="CIN/LLPIN" className={inputClass} value={formData.registrationNumber} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Jurisdiction *</label>
                      <input name="jurisdiction" className={inputClass} value={formData.jurisdiction} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Incorporation Date *</label>
                      <input type="date" name="incorporationDate" className={inputClass} value={formData.incorporationDate} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className={labelClass}>Registered Address *</label>
                      <input name="spvAddress" className={inputClass} value={formData.spvAddress} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className={labelClass}>Directors (Comma-separated) *</label>
                      <input name="directors" placeholder="Director Names" className={inputClass} value={formData.directors} onChange={handleInputChange} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Documents</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Upload legal proof of ownership and SPV status</p>
                  </div>
                  <div className="grid gap-4">
                    {[
                      { id: 'titleDeed', label: 'Primary Title Deed', desc: 'Absolute proof of asset ownership' },
                      { id: 'spvReg', label: 'SPV Registration Certificate', desc: 'LLP or Private Ltd registration' },
                      { id: 'taxReceipt', label: 'Latest Tax Receipt', desc: 'Verification of no dues' },
                      { id: 'surveyMap', label: 'Authorized Survey Map', desc: 'Verified boundaries of the plot' }
                    ].map(doc => (
                      <div key={doc.id} className="p-6 bg-slate-50 dark:bg-obsidian-800 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${uploadedDocs[doc.id as keyof typeof uploadedDocs] ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-100'}`}>
                            {uploadedDocs[doc.id as keyof typeof uploadedDocs] ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{doc.label}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.desc}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setUploadedDocs(prev => ({ ...prev, [doc.id]: !prev[doc.id as keyof typeof uploadedDocs] }))}
                          className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${uploadedDocs[doc.id as keyof typeof uploadedDocs] ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-obsidian-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-fintech-purple-600'}`}
                        >
                          {uploadedDocs[doc.id as keyof typeof uploadedDocs] ? 'Attached' : 'Attach File'}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Financials</h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Asset valuation and fractional metrics</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className={labelClass}>Total Asset Valuation (INR) *</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                        <input type="number" name="valuation" className={`${inputClass} pl-10`} value={formData.valuation || ''} onChange={handleNumericChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Target Raise (INR) *</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                        <input type="number" name="targetRaise" className={`${inputClass} pl-10`} value={formData.targetRaise || ''} onChange={handleNumericChange} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Projected Annual Yield (%) *</label>
                      <input type="number" name="yieldPercent" className={inputClass} value={formData.yieldPercent} onChange={handleNumericChange} />
                    </div>
                    <div className="space-y-3">
                      <label className={labelClass}>Est. Monthly Rent (INR) *</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                        <input type="number" name="monthlyRent" className={`${inputClass} pl-10`} value={formData.monthlyRent || ''} onChange={handleNumericChange} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Oracle Verification Report</h2>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Automated consensus & Geospatial Analysis Summary</p>
                    </div>
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl border-4 border-white dark:border-obsidian-800">
                      <ShieldCheck className="w-6 h-6" />
                      <span className="text-sm font-black uppercase tracking-widest">ABM VERIFIED</span>
                    </div>
                  </div>
                  
                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Geospatial Satellite Feed */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="aspect-square rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 relative group shadow-2xl bg-slate-200">
                        {/* Urban Top-Down View matching Cyber Vista Gurgaon requested */}
                        <img 
                          src="https://images.unsplash.com/photo-1541339905195-0a82d738eba8?auto=format&fit=crop&q=80&w=800" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90" 
                          alt="Satellite Imagery" 
                        />
                        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-white font-mono uppercase border border-white/10">
                          SAT_NODE_7708: {formData.latitude}, {formData.longitude}
                        </div>
                        <div className="absolute bottom-6 left-6 text-white space-y-1 drop-shadow-md bg-black/50 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Cyber Vista Sync</p>
                          <p className="text-xs font-black flex items-center gap-2">
                             <Crosshair className="w-3.5 h-3.5 text-emerald-400" /> Satisfied > 94.2% Match
                          </p>
                          <p className="text-[9px] font-bold text-white/70 uppercase">Institutional Verification active</p>
                        </div>
                        {/* Visual Scanning Animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-neon-emerald/30 shadow-[0_0_15px_rgba(0,245,160,0.5)] animate-[scan_4s_linear_infinite]"></div>
                      </div>

                      <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Market Sentiment</p>
                        </div>
                        <h4 className="text-xl font-black tracking-tight leading-none uppercase">High Growth Zone Detected</h4>
                        <p className="text-[11px] font-bold text-white/50 leading-relaxed uppercase tracking-tight">
                          PropToken AI oracles have cross-referenced this asset against local transaction data points in Gurgaon Cyber City. Risk category: {formData.risk}.
                        </p>
                      </div>
                    </div>

                    {/* Oracle Truths Ledger */}
                    <div className="lg:col-span-7 space-y-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-50 dark:bg-obsidian-800 rounded-3xl border border-slate-100 dark:border-white/5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <SearchCode className="w-3.5 h-3.5" /> Registry Match
                           </p>
                           <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Matched 100%</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">Cross-verified against Haryana State Govt Registry records.</p>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-obsidian-800 rounded-3xl border border-slate-100 dark:border-white/5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <History className="w-3.5 h-3.5" /> Title History
                           </p>
                           <p className="text-2xl font-black text-emerald-600 uppercase tracking-tight">Audit Cleared</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">No historical encumbrances found in last 30-year audit.</p>
                        </div>
                      </div>

                      <div className="p-10 bg-white dark:bg-obsidian-800 rounded-[2.5rem] border-4 border-slate-50 dark:border-white/5 space-y-8 shadow-inner">
                        <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Self-Reported Valuation</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{formData.valuation.toLocaleString()}</p>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Oracle Fair Value Estimate</p>
                             <p className="text-2xl font-black text-emerald-600 tracking-tighter">₹{(formData.valuation * 0.985).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <Activity className="w-3.5 h-3.5" /> Yield Expectations
                             </p>
                             <div className="flex items-center gap-3">
                               <span className="text-3xl font-black text-slate-800 dark:text-white">{formData.yieldPercent}%</span>
                               <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">Oracle Approved</span>
                             </div>
                             <p className="text-[9px] text-slate-400 font-bold uppercase">Local benchmark: 8.5% - 10.2%</p>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <ShieldCheck className="w-3.5 h-3.5" /> Verification Score
                             </p>
                             <div className="flex items-center gap-3">
                               <span className="text-3xl font-black text-indigo-600">94.2%</span>
                               <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">High Trust Rank</span>
                             </div>
                             <p className="text-[9px] text-slate-400 font-bold uppercase">Consensus threshold (>90%) Satisfied</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-start gap-4 shadow-sm">
                        <Zap className="w-6 h-6 text-amber-600 shrink-0" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Final Authorization Protocol</p>
                          <p className="text-[11px] font-bold text-amber-600/80 leading-relaxed uppercase tracking-tight">
                            By clicking submit, you confirm that all "Oracle Truths" listed above are accurate. Any future discrepancies detected by the network may lead to listing suspension and reputation slashing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between">
              {step > 1 ? (
                <button onClick={prevStep} className="px-10 py-4 flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors transition-all outline-none">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button 
                  onClick={nextStep}
                  className="px-10 py-4 bg-fintech-purple-600 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 hover:bg-fintech-purple-700 active:scale-95 transition-all flex items-center gap-3 outline-none"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleList}
                  disabled={isSubmitting}
                  className="px-10 py-4 primary-gradient text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 outline-none disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Layers className="w-4 h-4" /> Finalize ABM Verification</>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default BuilderList;
