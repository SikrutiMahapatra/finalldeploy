
import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon: Icon }) => {
  return (
    <div className="group relative bg-[#F8F8F8] dark:bg-obsidian-900 px-5 py-5 rounded-[24px] border border-[#EAEAEA] dark:border-white/5 transition-all duration-500 hover:-translate-y-1 hover:bg-white dark:hover:bg-obsidian-800 hover:shadow-[0_15px_30px_-10px_rgba(95,37,159,0.15)] dark:hover:shadow-[0_15px_30px_-10px_rgba(0,245,160,0.2)]">
      <div className="flex flex-col gap-4">
        {/* Header Row: Icon and Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white dark:bg-obsidian-700 rounded-lg border border-[#EAEAEA] dark:border-white/10 shadow-sm transition-colors duration-500 group-hover:border-fintech-purple-600/30 dark:group-hover:border-neon-emerald/30">
              <Icon className="w-4 h-4 text-[#5F259F] dark:text-neon-emerald" />
            </div>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
              {title}
            </span>
          </div>
        </div>

        {/* Value Hero */}
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-black text-[#141A19] dark:text-white tracking-tight uppercase leading-none">
            {value}
          </h3>
        </div>

        {/* Footer Row: Change Indicator only */}
        {change && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
              positive 
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-neon-emerald/10 dark:text-neon-emerald' 
                : 'bg-red-500/10 text-red-600'
            }`}>
              {positive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {change}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
