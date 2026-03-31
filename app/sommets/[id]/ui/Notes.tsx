import { Star, ChevronDown } from "lucide-react";
import { Ascension } from "../../../shared/types";

interface NotesProps {
  stats: { total: number; avg: string; distribution: number[] };
  sortedAscensions: Ascension[];
  sortBy: 'recent' | 'rating';
  setSortBy: (val: 'recent' | 'rating') => void;
}

export default function Notes({ stats, sortedAscensions, sortBy, setSortBy }: NotesProps) {
  return (
    <div className="bg-white rounded-4xl border border-neutral-200 shadow-sm p-8">
      <h2 className="text-xl font-black text-neutral-900 mb-8 border-b border-neutral-100 pb-4">Carnet de la communauté</h2>

      {stats.total === 0 ? (
        <p className="text-sm font-medium text-neutral-500 italic text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Colonne Stats */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black text-neutral-900 tracking-tighter">{stats.avg}</span>
              <span className="text-sm font-bold text-neutral-400">/ 5</span>
            </div>
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((star, index) => {
                const percentage = stats.total > 0 ? (stats.distribution[index] / stats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs font-bold text-neutral-500">
                    <span className="w-8 text-right">{star} ét.</span>
                    <div className="grow h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-neutral-400">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-2">{stats.total} avis</p>
          </div>

          {/* Colonne Liste */}
          <div className="md:col-span-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-neutral-900">Récits</span>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')} className="appearance-none bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-600 pl-3 pr-8 py-2 cursor-pointer outline-none">
                  <option value="recent">Plus récents</option>
                  <option value="rating">Mieux notés</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {sortedAscensions.map((asc) => (
                <div key={asc.id} className="flex flex-col gap-2 pb-6 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: asc.customColor, boxShadow: `0 0 0 2px white, 0 0 0 4px ${asc.customColor}` }}></div>
                      <span className="text-sm font-bold text-neutral-900">Alpiniste Anonyme</span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{new Date(asc.dateAscension).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= asc.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"} />
                    ))}
                  </div>
                  {asc.comment && <p className="text-sm text-neutral-600 font-medium leading-relaxed mt-1">{asc.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}