
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Landmark, ArrowRight, Globe, TrendingUp, Star, CheckCircle2, Zap, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-obsidian-950 relative overflow-hidden flex flex-col transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-fintech-purple-50 dark:bg-neon-emerald/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 md:px-10 w-full h-24 flex items-center justify-between relative z-50">
        <Link to="/" className="flex items-center gap-3 text-fintech-purple-600 dark:text-neon-emerald group">
          <div className="w-10 h-10 bg-fintech-purple-600 dark:bg-neon-emerald rounded-xl flex items-center justify-center text-white dark:text-obsidian-950 shadow-lg group-hover:rotate-6 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter dark:text-white uppercase">PropToken</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#how-it-works" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-fintech-purple-600 dark:hover:text-neon-emerald transition-colors">How it Works</a>
          <a href="#security" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-fintech-purple-600 dark:hover:text-neon-emerald transition-colors">Safety</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/signin" className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all">Sign In</Link>
          <Link to="/onboarding" className="primary-gradient text-white px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-fintech-purple-600/20 dark:shadow-neon-emerald/20">
            Start Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid lg:grid-cols-12 items-center gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 bg-fintech-purple-50 dark:bg-neon-emerald/10 text-fintech-purple-600 dark:text-neon-emerald px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest mb-8 border border-fintech-purple-100 dark:border-neon-emerald/20">
            <Zap className="w-3.5 h-3.5" /> Investing made simple
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-8">
            Fractional ownership, <br />
            <span className="text-fintech-purple-600 dark:text-neon-emerald">full‑power investing.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed mb-10">
            With just ₹5,000, co‑own handpicked land and other premium assets, track growth in one dashboard, and liquidate your stake in a few taps.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link to="/onboarding" className="w-full sm:w-auto primary-gradient text-white px-10 py-5 rounded-full font-bold text-base hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                   </div>
                 ))}
               </div>
               <div>
                 <div className="flex items-center gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Trusted by 15,000+ people</p>
               </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative hidden lg:block"
        >
          <div className="w-full aspect-[4/5] bg-registry-card dark:bg-obsidian-900 rounded-[32px] relative overflow-hidden border border-registry-border dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8">
             <div className="rounded-2xl overflow-hidden mb-8 h-1/2 relative group">
               <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Prime Estate" />
               <div className="absolute top-4 left-4 flex gap-2">
                 <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-800 shadow-lg">9.2% ESTIMATED PROFIT</span>
               </div>
             </div>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-white">Emerald Meadows</h3>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-neon-emerald font-black text-xs uppercase">
                    <TrendingUp className="w-4 h-4" /> Value Growing
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-registry-border dark:border-white/5">
                     <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Buy 1 Share</p>
                     <p className="font-black text-xl text-slate-900 dark:text-white">₹5,000</p>
                   </div>
                   <div className="p-4 bg-emerald-50 dark:bg-neon-emerald/10 rounded-2xl border border-emerald-100 dark:border-neon-emerald/20">
                     <p className="text-[10px] font-bold text-emerald-600 dark:text-neon-emerald uppercase tracking-widest mb-1">Status</p>
                     <p className="font-black text-lg text-emerald-700 dark:text-neon-emerald">Verified Safe</p>
                   </div>
                </div>
                <div className="p-4 bg-fintech-purple-50 dark:bg-white/5 rounded-2xl border border-fintech-purple-100 dark:border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-fintech-purple-600 dark:text-neon-emerald" />
                     <span className="text-xs font-bold text-fintech-purple-700 dark:text-slate-300">Papers checked by experts</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </main>

      {/* Trust Features */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 w-full">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "100% Legal Safety", desc: "Every property listed is checked by lawyers to make sure the ownership is clear and real." },
            { icon: Landmark, title: "Verified Assets", desc: "We only pick the best land in areas where prices are likely to go up, saving you the hard work." },
            { icon: Globe, title: "Easy Cash Outs", desc: "You are never stuck. Sell your shares back to the platform and get your money in just a few taps." },
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -8 }}
              className="fintech-card p-10 flex flex-col items-center text-center gap-6"
            >
              <div className="w-16 h-16 bg-fintech-purple-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-fintech-purple-600 dark:text-neon-emerald shadow-inner">
                <feature.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 px-6 md:px-10 text-white/50 w-full mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter text-white uppercase">
            <div className="w-8 h-8 bg-fintech-purple-600 dark:bg-neon-emerald rounded-lg flex items-center justify-center text-white dark:text-obsidian-950">
              <Building2 className="w-5 h-5" />
            </div>
            <span>PropToken</span>
          </div>
          <div className="flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-neon-emerald transition-colors">How it works</a>
            <a href="#" className="hover:text-neon-emerald transition-colors">Safety Guide</a>
            <a href="#" className="hover:text-neon-emerald transition-colors">Contact</a>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">© 2024 PropToken - Simple Property Savings</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
