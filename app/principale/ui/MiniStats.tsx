// app/principale/ui/MiniStats.tsx
import { Trophy, TrendingUp, MountainSnow } from 'lucide-react';
import { UserStats } from '../../shared/types/index';

interface QuickStatsProps {
  stats: UserStats | null;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  // Si les stats ne sont pas encore chargées, on peut renvoyer null (ou un squelette de chargement)
  if (!stats) return null; 

  return (
    <div className="fixed top-20 right-4 bg-white border border-neutral-200 shadow-lg rounded-3xl p-2.5 z-40 flex gap-2.5">
      
      <div className="flex flex-col items-center justify-center bg-neutral-50 border border-neutral-100 rounded-2xl p-2 min-w-17.5">
        <Trophy size={16} className="text-amber-500 mb-1" />
        <span className="text-lg font-black text-neutral-800 leading-none">{stats.totalSummits}</span>
        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide mt-1">Sommets</span>
      </div>

      <div className="flex flex-col items-center justify-center bg-white/40 rounded-2xl p-2 min-w-17.5">
        <TrendingUp size={16} className="text-emerald-600 mb-1" />
        <span className="text-lg font-black text-neutral-800 leading-none">{stats.maxAltitude}<span className="text-xs">m</span></span>
        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide mt-1">Record</span>
      </div>

      <div className="flex flex-col items-center justify-center bg-white/40 rounded-2xl p-2 min-w-17.5">
        <MountainSnow size={16} className="text-blue-500 mb-1" />
        <span className="text-lg font-black text-neutral-800 leading-none">{stats.totalAscent}<span className="text-xs">m</span></span>
        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide mt-1">Dénivelé</span>
      </div>

    </div>
  );
}