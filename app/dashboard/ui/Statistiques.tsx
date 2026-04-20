import { Mountain, ArrowUpRight, Maximize2 } from 'lucide-react';

export default function DashboardStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      
      <div className="bg-white p-6 rounded-4xl border border-neutral-100/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between h-36 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-neutral-400">
          <Mountain size={16} strokeWidth={2.5} />
          <span className="text-sm font-medium">Sommets gravis</span>
        </div>
        <div className="text-5xl font-bold text-neutral-800 tracking-tight leading-none">
          {stats.totalSummits}
        </div>
      </div>

      <div className="bg-white p-6 rounded-4xl border border-neutral-100/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between h-36 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-neutral-400">
          <ArrowUpRight size={16} strokeWidth={2.5} />
          <span className="text-sm font-medium">Dénivelé cumulé</span>
        </div>
        <div className="text-5xl font-bold text-neutral-800 tracking-tight leading-none flex items-baseline gap-1">
          {stats.totalAscent.toLocaleString('fr-FR')}
          <span className="text-xl font-semibold text-neutral-400">m</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-4xl border border-neutral-100/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col justify-between h-36 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-neutral-400">
          <Maximize2 size={16} strokeWidth={2.5} />
          <span className="text-sm font-medium">Altitude record</span>
        </div>
        <div className="text-5xl font-bold text-neutral-800 tracking-tight leading-none flex items-baseline gap-1">
          {stats.maxAltitude.toLocaleString('fr-FR')}
          <span className="text-xl font-semibold text-neutral-400">m</span>
        </div>
      </div>

    </div>
  );
}