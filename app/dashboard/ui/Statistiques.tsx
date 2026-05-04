"use client";
import { Mountain, TrendingUp, ArrowUpRight, Globe } from 'lucide-react';
import { DashboardStats } from '../logic/dashboard.selectors';

export default function Statistiques({ stats }: { stats: DashboardStats }) {
  return (
    <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
          <Mountain size={16} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black text-neutral-900 leading-none">{stats.totalSommets}</span>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sommets</span>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
          <TrendingUp size={16} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black text-neutral-900 leading-none">{stats.altitudeTotale.toLocaleString('fr-FR')} <span className="text-sm">m</span></span>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Dénivelé total</span>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black text-neutral-900 leading-none">{stats.sommetLePlusHaut?.altitude?.toLocaleString('fr-FR') || 0} <span className="text-sm">m</span></span>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">Record alti.</span>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
          <Globe size={16} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-black text-neutral-900 leading-none">{stats.pays.totalUniques}</span>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pays explorés</span>
      </div>
    </div>
  );
}