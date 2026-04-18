"use client";
import { MousePointerClick, PlusCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SommetCarte } from '../logic/principale.selectors';

interface PopupProps {
  sommet: SommetCarte;
  dejaEnregistre?: boolean;
  onAdd?: () => void;
}

export default function PopupFiche({ sommet, dejaEnregistre = false, onAdd }: PopupProps) {
  const router = useRouter();
  const imageUrl = sommet.image_couverture_url || 'https://images.unsplash.com/photo-1549880338-65dd4bc8a202?q=80&w=200';
  const cleanId = sommet.id.replace('peak_', '');

  // 📦 On prépare les données pour les envoyer dans l'URL
  const handleNavigation = () => {
    const dataString = encodeURIComponent(JSON.stringify(sommet));
    router.push(`/sommet/${cleanId}?data=${dataString}`);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche d'ouvrir la page si on clique sur le bouton
    if (onAdd && !dejaEnregistre) onAdd();
  };

  const ContenuVisuel = (
    <div className="flex gap-3 items-center">
      <div 
        className="w-14 h-14 rounded-xl bg-neutral-100 shrink-0" 
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="flex flex-col grow overflow-hidden pr-3">
        <h3 className="font-bold text-neutral-900 text-sm leading-tight mb-1.5 truncate transition-colors group-hover:text-blue-600">
          {sommet.nom || 'Sommet inconnu'}
        </h3>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Alti.</span>
            <span className="text-xs font-semibold text-neutral-800">
              {sommet.altitude ? `${sommet.altitude} m` : 'Inconnue'}
            </span>
          </div>
          <div className="flex flex-col overflow-hidden border-l border-neutral-100 pl-4">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Pays</span>
            <span className="text-xs font-semibold text-neutral-800 truncate w-full">
              {sommet.pays || 'Inconnu'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      onClick={handleNavigation}
      className={`block w-85 p-2.5 bg-white rounded-2xl shadow-xl border transition-all group cursor-pointer relative ${
        dejaEnregistre ? 'border-emerald-100 hover:border-emerald-500' : 'border-neutral-200 hover:border-blue-500'
      }`}
    >
      <div className={`absolute top-2.5 right-2.5 transition-colors ${dejaEnregistre ? 'text-emerald-500' : 'text-neutral-300 group-hover:text-blue-500'}`}>
        <MousePointerClick size={14} />
      </div>

      {ContenuVisuel}
      
      <button 
        onClick={handleAddClick}
        disabled={dejaEnregistre}
        className={`mt-3 w-full py-2 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 ${
          dejaEnregistre 
            ? 'bg-emerald-500 text-white cursor-default' 
            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
        }`}
      >
        {dejaEnregistre ? (
          <>
            <Check size={16} strokeWidth={3} />
            Déjà dans le carnet
          </>
        ) : (
          <>
            <PlusCircle size={16} />
            Ajouter au carnet
          </>
        )}
      </button>
    </div>
  );
}