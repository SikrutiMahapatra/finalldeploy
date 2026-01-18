
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Home, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard, 
  Sparkles,
  Layers,
  Crosshair
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navItems = user?.role === 'BUILDER' ? [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'ABM Verify', path: '/builder/list', icon: Crosshair },
    { name: 'Tokenize', path: '/builder/tokenize', icon: Layers },
    { name: 'AI', path: '/ai', icon: Sparkles },
  ] : [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Invest', path: '/marketplace', icon: ShoppingBag },
    { name: 'Wallet', path: '/pay', icon: CreditCard },
    { name: 'AI', path: '/ai', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5 py-3 px-6 shadow-2xl md:hidden">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 group relative"
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-fintech-purple-50 dark:bg-white/10 text-fintech-purple-600 dark:text-neon-emerald scale-110' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-fintech-purple-600 dark:hover:text-neon-emerald'
              }`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-all ${
                isActive ? 'text-fintech-purple-600 dark:text-neon-emerald' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
