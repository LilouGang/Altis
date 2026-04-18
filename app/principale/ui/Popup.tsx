"use client";
import { Plus, Check, ChevronRight, Mountain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SommetCarte } from '../logic/principale.selectors';

interface PopupFicheProps {
  sommet: SommetCarte;
  dejaEnregistre: boolean;
  onAdd: () => void;
}

export default function PopupFiche({ sommet, dejaEnregistre, onAdd }: PopupFicheProps) {
  const router = useRouter();

  // 🚀 REDIRECTION VERS LA PAGE DU SOMMET
  const handleCardClick = () => {
    // On redirige vers la future page du sommet
    router.push(`/sommet/${sommet.id}`);
  };

  // 🛑 AJOUT SANS REDIRECTION
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 👈 MAGIE : Empêche le clic de se propager à la carte entière !
    if (!dejaEnregistre) {
      onAdd();
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-4 w-[240px] flex flex-col gap-3 cursor-pointer group transition-all hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] active:scale-[0.98]"
    >
      {/* HEADER : Nom + Chevron */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-neutral-800 text-base leading-tight truncate group-hover:text-emerald-600 transition-colors">
            {sommet.nom}
          </h3>
          <p className="text-xs font-semibold text-neutral-500 mt-0.5 truncate">
            {sommet.pays || "Pays inconnu"}
          </p>
        </div>
        {/* Le petit logo de clic qui glisse au survol */}
        <div className="text-neutral-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all">
          <ChevronRight size={18} strokeWidth={2.5} />
        </div>
      </div>

      {/* STATS RAPIDES */}
      <div className="flex items-center gap-1.5 bg-neutral-100/80 rounded-xl px-2.5 py-1.5 w-fit">
        <Mountain size={12} className="text-neutral-500" />
        <span className="text-xs font-bold text-neutral-700">{sommet.altitude} m</span>
      </div>

      {/* BOUTON D'ACTION (Ajouter ou Fait) */}
      <button 
        onClick={handleAddClick}
        disabled={dejaEnregistre}
        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          dejaEnregistre 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' 
            : 'bg-neutral-800 text-white hover:bg-emerald-500 hover:shadow-md active:scale-95'
        }`}
      >
        {dejaEnregistre ? (
          <>
            <Check size={16} strokeWidth={3} />
            Dans le carnet
          </>
        ) : (
          <>
            <Plus size={16} strokeWidth={2.5} />
            Ajouter au carnet
          </>
        )}
      </button>
    </div>
  );
}