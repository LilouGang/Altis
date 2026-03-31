import { Trophy, TrendingUp, MountainSnow } from 'lucide-react';
import { UserStats } from '../../shared/types/index';

export default function DashboardStats({ stats }: { stats: UserStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
          <Trophy size={28} className="text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Sommets gravis</p>
          <p className="text-3xl font-black text-neutral-900">{stats.totalSummits}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
          <MountainSnow size={28} className="text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Altitude cumulée</p>
          <p className="text-3xl font-black text-neutral-900">{stats.totalAscent.toLocaleString()} <span className="text-lg text-neutral-500 font-bold">m</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
          <TrendingUp size={28} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Record absolu</p>
          <p className="text-3xl font-black text-neutral-900">{stats.maxAltitude} <span className="text-lg text-neutral-500 font-bold">m</span></p>
        </div>
      </div>

    </div>
  );
}