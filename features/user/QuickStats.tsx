import { Trophy, TrendingUp, MountainSnow } from 'lucide-react';

export default function QuickStats() {
  return (
    // Marges réduites, padding plus petit, glassmorphism plus fort
    <div className="fixed top-20 right-4 bg-white border border-neutral-200 shadow-lg rounded-3xl p-2.5 z-40 flex gap-2.5">
  <div className="flex flex-col items-center justify-center bg-neutral-50 border border-neutral-100 rounded-2xl p-2 min-w-17.5">
        <Trophy size={16} className="text-amber-500 mb-1" />
        <span className="text-lg font-black text-neutral-800 leading-none">14</span>
        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide mt-1">Sommets</span>
      </div>

      <div className="flex flex-col items-center justify-center bg-white/40 rounded-2xl p-2 min-w-17.5">
        <TrendingUp size={16} className="text-emerald-600 mb-1" />
        <span className="text-lg font-black text-neutral-800 leading-none">4807<span className="text-xs">m</span></span>
        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide mt-1">Record</span>
      </div>

      {/* NOUVEAU : Altitude totale / Dénivelé */}
      <div className="flex flex-col items-center justify-center bg-white/40 rounded-2xl p-2 min-w-17.5">
        <MountainSnow size={16} className="text-blue-500 mb-1" />
        <span className="text-lg font-black text-neutral-800 leading-none">24<span className="text-xs">k m</span></span>
        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide mt-1">Cumulé</span>
      </div>

    </div>
  );
}