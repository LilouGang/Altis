import { SlidersHorizontal, CheckCircle2, MapPin } from 'lucide-react';

export default function MapFilters() {
  return (
    <div className="fixed top-20 bottom-4 left-4 w-86 bg-white border border-neutral-200 shadow-lg rounded-3xl p-5 z-40 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
      
      <div className="flex items-center gap-3 border-b border-neutral-200/50 pb-3 shrink-0">
        <SlidersHorizontal size={18} className="text-emerald-600" />
        <h2 className="font-bold text-neutral-800 tracking-tight">Filtres</h2>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-2">Statut</span>
          <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors w-full text-left text-sm font-medium text-neutral-700">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Sommets gravis
          </button>
          <button className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors w-full text-left text-sm font-medium text-neutral-700">
            <MapPin size={18} className="text-neutral-400" />
            À découvrir
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-2">Régions</span>
          <select className="w-full bg-neutral/50 border border-white/60 text-neutral-700 text-sm font-medium rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer shadow-sm">
            <option>Toutes les régions</option>
            <option>Massif du Mont-Blanc</option>
            <option>Écrins</option>
            <option>Vanoise</option>
          </select>
        </div>
      </div>
    </div>
  );
}