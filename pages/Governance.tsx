
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { db } from '../db.ts';
import { 
  Gavel, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  Users, 
  TrendingUp, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROPOSALS = [
  {
    id: 'prop-1',
    assetId: 'plot-001',
    title: 'Lease Renewal - Floor 4',
    description: 'Renew corporate lease with Tech Solutions Inc. for 3 years at 8% escalation.',
    status: 'ACTIVE',
    deadline: '2024-06-20',
    votesFor: 12400,
    votesAgainst: 1200,
  },
  {
    id: 'prop-2',
    assetId: 'plot-002',
    title: 'Maintenance Fund Allocation',
    description: 'Allocate ₹2,50,000 for landscaping and external painting works.',
    status: 'ACTIVE',
    deadline: '2024-06-25',
    votesFor: 8500,
    votesAgainst: 4200,
  },
  {
    id: 'prop-3',
    assetId: 'plot-001',
    title: 'Sustainability Upgrade',
    description: 'Install solar panel array to reduce common area power costs by 40%.',
    status: 'CLOSED',
    deadline: '2024-05-15',
    votesFor: 18000,
    votesAgainst: 500,
    outcome: 'PASSED'
  }
];

const Governance: React.FC = () => {
  const { wallet } = useAuth();
  const assets = db.getAssets();
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  // Cast count to number to resolve 'unknown' type error
  const myGovernanceRights = Object.entries(wallet.tokensByAsset)
    .filter(([_, count]) => (count as number) > 0)
    .map(([assetId, count]) => {
      const asset = assets.find(a => a.id === assetId);
      return {
        assetId,
        assetName: asset?.name || 'Unknown Asset',
        votingPower: count as number,
      };
    });

  // Ensure acc and votingPower are treated as numbers
  const totalVotingPower = myGovernanceRights.reduce((acc, curr) => acc + (curr.votingPower as number), 0);

  return (
    <div className="space-y-10 animate-fintech-fade pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Governance Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-3">Fractional Voting Rail • Power Based on Stake</p>
        </div>
        <div className="bg-emerald-50 dark:bg-neon-emerald/10 border border-emerald-100 dark:border-neon-emerald/20 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
           <Users className="w-5 h-5 text-emerald-600 dark:text-neon-emerald" />
           <div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Weight</p>
             <p className="text-lg font-black text-emerald-700 dark:text-neon-emerald leading-none">{totalVotingPower.toLocaleString()} Units</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Active Proposals */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Clock className="w-4 h-4 text-fintech-purple-600" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Active Proposals</h2>
          </div>
          
          <div className="space-y-4">
            {PROPOSALS.filter(p => p.status === 'ACTIVE').map(prop => {
              const asset = assets.find(a => a.id === prop.assetId);
              const myWeight = (wallet.tokensByAsset[prop.assetId] as number) || 0;
              
              return (
                <div key={prop.id} className="fintech-card p-8 border border-slate-100 dark:border-white/5 bg-white dark:bg-obsidian-900 shadow-xl group hover:border-fintech-purple-600/30 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-fintech-purple-600 uppercase tracking-widest bg-fintech-purple-50 dark:bg-white/5 px-3 py-1 rounded-full">{asset?.name}</span>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mt-2">{prop.title}</h3>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Closes in</p>
                       <p className="text-sm font-black text-slate-900 dark:text-white">4 Days</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                    {prop.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                        <span>For</span>
                        <span className="text-emerald-500">{((prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                        <span>Against</span>
                        <span className="text-red-500">{((prop.votesAgainst / (prop.votesFor + prop.votesAgainst)) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${(prop.votesAgainst / (prop.votesFor + prop.votesAgainst)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Weight: {myWeight.toLocaleString()}</span>
                    </div>
                    <button 
                      disabled={myWeight === 0}
                      className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${myWeight > 0 ? 'primary-gradient text-white shadow-lg hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                      Cast Ballot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 px-2 pt-6">
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Historical Archive</h2>
          </div>
          
          <div className="space-y-4 opacity-60">
             {PROPOSALS.filter(p => p.status === 'CLOSED').map(prop => (
                <div key={prop.id} className="fintech-card p-6 bg-slate-50 dark:bg-obsidian-900 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-white dark:bg-obsidian-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/10">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{prop.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Concluded on {prop.deadline}</p>
                      </div>
                   </div>
                   <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-neon-emerald px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">Outcome: PASSED</div>
                </div>
             ))}
          </div>
        </div>

        {/* Voter Rights Profile */}
        <div className="lg:col-span-4 space-y-8">
           <div className="fintech-card p-10 bg-slate-900 text-white rounded-fintech-lg shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-8">Voting Rights Profile</h3>
              
              <div className="space-y-6">
                 {myGovernanceRights.length > 0 ? myGovernanceRights.map(right => (
                   <div key={right.assetId} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="opacity-40">{right.assetName}</span>
                        <span>{right.votingPower} Units</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full">
                         {/* Cast votingPower to number to resolve 'unknown' type in arithmetic operation */}
                         <div className="bg-neon-emerald h-full rounded-full" style={{ width: `${((right.votingPower as number) / (totalVotingPower || 1)) * 100}%` }}></div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-10 text-center">
                      <AlertCircle className="w-10 h-10 text-white/10 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-relaxed">No voting units detected in your registry portfolio.</p>
                   </div>
                 )}
              </div>
              
              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                 <TrendingUp className="w-5 h-5 text-neon-emerald shrink-0" />
                 <p className="text-[10px] font-bold opacity-60 uppercase leading-relaxed tracking-tight">Your voting power increases automatically as you acquire more institutional units.</p>
              </div>
           </div>

           <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 space-y-4">
              <div className="flex items-center gap-3">
                 <Gavel className="w-5 h-5 text-indigo-600" />
                 <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Governance Rulebook</h4>
              </div>
              <p className="text-[10px] font-bold text-indigo-700/80 dark:text-indigo-300 leading-relaxed uppercase tracking-tight">
                All proposals require a 51% majority to pass. High-impact structural decisions require a 67% super-majority.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
