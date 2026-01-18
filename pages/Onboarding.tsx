
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Landmark, Wallet, ArrowRight, CheckCircle2, ShieldCheck, Crosshair } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'BUILDER' | 'INVESTOR') => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 md:p-10 transition-colors animate-fintech-fade">
      <nav className="max-w-7xl mx-auto w-full flex items-center mb-16 md:mb-24">
        <Link to="/" className="flex items-center gap-3 text-fintech-purple-600 font-bold text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-fintech-purple-600 rounded-xl flex items-center justify-center text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="uppercase tracking-[0.1em] font-black">PropToken</span>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="text-fintech-purple-600 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Step 1 of 2</p>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-800 tracking-tight uppercase mb-6 leading-none">Choose your path</h1>
          <p className="text-slate-500 font-semibold max-w-md mx-auto">Tell us if you want to grow your money or sell your property.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full mb-16">
          {/* Builder Path */}
          <button 
            onClick={() => handleRoleSelect('BUILDER')}
            className="group fintech-card p-10 text-left border border-slate-100 hover:border-fintech-purple-600/30 transition-all shadow-lg flex flex-col"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-10 shadow-sm transition-transform group-hover:scale-105">
              <Crosshair className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4 uppercase">I want to sell land</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-1">
              If you have a large piece of land and want to sell it in small shares to many buyers quickly.
            </p>
            <div className="space-y-3 mb-12">
              {['Expert Legal Verification', 'Quick Buyer Matching', 'Digital Paperwork'].map(text => (
                <div key={text} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-fintech-purple-600" /> {text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 font-black text-[11px] uppercase tracking-widest text-fintech-purple-600 group-hover:gap-5 transition-all">
              Start ABM Verification <ArrowRight className="w-5 h-5" />
            </div>
          </button>

          {/* Investor Path */}
          <button 
            onClick={() => handleRoleSelect('INVESTOR')}
            className="group fintech-card p-10 text-left border border-slate-100 hover:border-fintech-purple-600/30 transition-all shadow-lg flex flex-col"
          >
            <div className="w-16 h-16 bg-fintech-purple-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-sm transition-transform group-hover:scale-105">
              <Wallet className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4 uppercase">I want to co‑own land</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-1">
              If you want to save money by buying small pieces of land for just ₹5,000.
            </p>
            <div className="space-y-3 mb-12">
              {['Start with only ₹5,000', 'Sell anytime for cash', 'Safe legal tracking'].map(text => (
                <div key={text} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 font-black text-[11px] uppercase tracking-widest text-fintech-purple-600 group-hover:gap-5 transition-all">
              Start Co‑owning <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 py-4 px-8 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
           <ShieldCheck className="w-5 h-5 text-emerald-600" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank-grade safety for your money and documents</p>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
