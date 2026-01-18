
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Search, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  Clock, 
  ShoppingCart, 
  RefreshCcw, 
  CreditCard, 
  Landmark, 
  Zap
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar: React.FC = () => {
  const { user, wallet, signOut, markNotificationsAsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/marketplace?q=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleToggleNotifications = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      await markNotificationsAsRead();
    }
  };

  const unreadCount = wallet.history.filter(h => h.isRead === false).length;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'BUY_TOKENS': return <ShoppingCart className="w-4 h-4 text-fintech-purple-600 dark:text-neon-emerald" />;
      case 'SWAP': return <RefreshCcw className="w-4 h-4 text-fintech-purple-600 dark:text-neon-indigo" />;
      case 'VERIFY': return <ShieldCheck className="w-4 h-4 text-fintech-purple-600 dark:text-neon-emerald" />;
      case 'PAYMENT': return <CreditCard className="w-4 h-4 text-fintech-purple-600 dark:text-neon-emerald" />;
      case 'COLLATERAL_LOCK': return <Landmark className="w-4 h-4 text-fintech-purple-600 dark:text-neon-indigo" />;
      case 'WALLET_ACTIVATE': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const shortAddress = user?.walletAddress 
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : null;

  return (
    <header className="h-20 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-md border-b border-registry-border dark:border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search registry... (Press Enter)" 
            className="w-full bg-registry-card dark:bg-white/5 pl-11 pr-5 py-2.5 rounded-full border-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fintech-purple-600/10 dark:focus:ring-neon-emerald/20 transition-all"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {shortAddress && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-fintech-purple-50 dark:bg-white/5 rounded-full border border-fintech-purple-100 dark:border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-fintech-purple-600"></div>
            <span className="text-[10px] font-black text-fintech-purple-600 uppercase tracking-widest">{shortAddress}</span>
          </div>
        )}

        <div className="flex items-center gap-1 relative" ref={notificationRef}>
          <button 
            onClick={handleToggleNotifications}
            className={`p-2.5 transition-colors relative ${showNotifications ? 'text-fintech-purple-600 dark:text-neon-emerald bg-fintech-purple-50 dark:bg-white/5 rounded-full' : 'text-slate-400 dark:text-slate-500 hover:text-fintech-purple-600 dark:hover:text-neon-emerald'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-fintech-purple-600 dark:bg-red-500 rounded-full border-2 border-white dark:border-obsidian-950"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 top-full w-80 md:w-96 bg-white dark:bg-obsidian-900 rounded-2xl border border-registry-border dark:border-white/10 shadow-2xl z-50 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-registry-border dark:border-white/5 flex items-center justify-between">
                  <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Digital Ledger Updates</h3>
                  {unreadCount > 0 && <span className="bg-fintech-purple-50 dark:bg-neon-emerald/10 text-fintech-purple-600 dark:text-neon-emerald px-2 py-0.5 rounded text-[9px] font-black">{unreadCount} NEW</span>}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {wallet.history.length > 0 ? (
                    <div className="divide-y divide-registry-border dark:divide-white/5">
                      {wallet.history.map((item) => (
                        <div key={item.id} className={`p-5 hover:bg-registry-card dark:hover:bg-white/10 transition-colors group flex items-start gap-4 ${item.isRead === false ? 'bg-fintech-purple-50/50 dark:bg-neon-emerald/5' : ''}`}>
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-obsidian-800 border border-registry-border dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                            {getActionIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-1 line-clamp-2">{item.description}</p>
                            <div className="flex items-center justify-between mt-2">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString()}</p>
                               {item.isRead === false && <div className="w-1.5 h-1.5 rounded-full bg-fintech-purple-600 dark:bg-neon-emerald"></div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No activity found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-fintech-purple-600 dark:hover:text-neon-emerald transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={handleLogout}
            title="Logout"
            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative ml-2">
          <button 
            onClick={() => navigate('/account')}
            className="flex items-center gap-2 p-1 pl-3 rounded-full border border-registry-border dark:border-white/10 hover:border-fintech-purple-600 dark:hover:border-neon-emerald transition-all bg-white dark:bg-white/5 shadow-sm active:scale-95 group"
            title="Go to Profile"
          >
            <span className="hidden lg:block text-xs font-bold text-slate-700 dark:text-slate-300 mr-1 group-hover:text-fintech-purple-600 dark:group-hover:text-neon-emerald">{user?.name.split(' ')[0]}</span>
            <div className="w-8 h-8 rounded-full bg-fintech-purple-600 dark:bg-neon-emerald flex items-center justify-center text-white dark:text-obsidian-950 font-bold text-xs shadow-inner">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
