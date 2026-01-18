
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Building2,
  Sparkles,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Crosshair
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const investorRails = [
    { name: 'Buy Tokens', path: '/marketplace', icon: ShoppingBag },
    { name: 'Yield Stats', path: '/yield', icon: BarChart3 },
    { name: 'Swap to Stablecoin', path: '/swap', icon: ArrowUpRight },
    { name: 'Pay as Collateral', path: '/pay', icon: CreditCard },
    { name: 'Neural Advisor', path: '/ai', icon: Sparkles },
  ];

  const builderRails = [
    { name: 'ABM Verification', path: '/builder/list', icon: Crosshair },
    { name: 'Verify Asset', path: '/verify', icon: ShieldCheck },
    { name: 'Tokenize', path: '/builder/tokenize', icon: Layers },
    { name: 'Yield Stats', path: '/yield', icon: BarChart3 },
    { name: 'PropAI Help', path: '/ai', icon: Sparkles },
  ];

  const mainItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
  ];

  const railItems = user?.role === 'BUILDER' ? builderRails : investorRails;

  return (
    <aside className="w-56 bg-white dark:bg-obsidian-950 hidden md:flex flex-col h-screen sticky top-0 transition-all border-r border-registry-border dark:border-white/5 shadow-sm z-20">
      <div className="p-6 border-b border-registry-border dark:border-white/5">
        <Link to="/" className="flex items-center gap-2.5 text-fintech-purple-600 group">
          <div className="w-9 h-9 bg-fintech-purple-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none dark:text-white">PropToken</span>
            <span className="text-[8px] font-bold text-slate-400 dark:text-fintech-purple-200 uppercase tracking-widest mt-1">Institutional</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
        <section>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-3">Portfolio</p>
          <nav className="space-y-1">
            {mainItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-2 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-fintech-purple-50 dark:bg-white/10 text-fintech-purple-600 dark:text-white font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-fintech-purple-600 dark:hover:text-white hover:bg-registry-card dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-fintech-purple-600 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-xs">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </section>

        <section>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-3">
            {user?.role === 'BUILDER' ? 'Builder Hub' : 'Invest'}
          </p>
          <nav className="space-y-1">
            {railItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-2 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-fintech-purple-50 dark:bg-white/10 text-fintech-purple-600 dark:text-white font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-fintech-purple-600 dark:hover:text-white hover:bg-registry-card dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-fintech-purple-600 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-xs">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </section>
      </div>

      <div className="p-5 mt-auto">
        <div className="p-3 rounded-xl bg-fintech-purple-50 dark:bg-white/5 border border-fintech-purple-100 dark:border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-fintech-purple-100 dark:bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-fintech-purple-600 dark:text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Safety</span>
            <span className="text-[8px] text-slate-400">Audited</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
