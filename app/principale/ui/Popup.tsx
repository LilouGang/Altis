"use client";
import { useState, useEffect } from 'react';
import { MousePointerClick, PlusCircle, Check, MountainSnow, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SommetCarte } from '../logic/principale.selectors';
// 👇 1. On importe l'auth
import { useAuth } from '../../shared/lib/AuthContext'; 

interface PopupProps {
  sommet: SommetCarte;
  dejaEnregistre?: boolean;
  onAdd?: () => void;
}

export default function PopupFiche({ sommet, dejaEnregistre = false, onAdd }: PopupProps) {
  const [wikiImage, setWikiImage] = useState<string | null>(null);
  const router = useRouter();
  // 👇 2. On récupère l'utilisateur
  const { user } = useAuth(); 

  useEffect(() => {
    if (!sommet.image_couverture_url) {
      fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(sommet.nom)}`)
        .then(res => res.json())
        .then(data => {
          if (data.originalimage?.source) setWikiImage(data.originalimage.source);
        }).catch(() => {});
    }
  }, [sommet.nom, sommet.image_couverture_url]);

  const imageUrl = sommet.image_couverture_url || wikiImage;

  const handleNavigation = () => {
    const cleanId = String(sommet.id).split('_').pop()?.replace(/^(peak_|osm_)/, '') || '';
    
    const dataString = encodeURIComponent(JSON.stringify(sommet));
    router.push(`/sommets/${cleanId}?data=${dataString}`);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 👇 3. Logique de redirection si non connecté
    if (!user) {
      router.push('/compte');
    } else if (onAdd && !dejaEnregistre) {
      onAdd();
    }
  };

  const ContenuVisuel = (
    <div className="flex gap-3 items-center">
      {imageUrl ? (
        <div 
          className="w-14 h-14 rounded-xl bg-neutral-100 shrink-0" 
          style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
          <MountainSnow size={25} className="text-neutral-400" strokeWidth={1.5}/>
        </div>
      )}

      <div className="flex flex-col grow overflow-hidden pr-3">
        <h3 className="font-bold text-neutral-900 text-sm leading-tight mb-1.5 truncate group-hover:text-blue-600 transition-colors">
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
            <span className="text-xs font-semibold text-neutral-800 truncate">
              {sommet.pays || 'Inconnu'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // 👇 4. Gestion des styles du bouton selon l'état
  let buttonClass = "";
  let buttonContent = null;

  if (!user) {
    buttonClass = "bg-red-50 hover:bg-red-100 text-red-500";
    buttonContent = <><Lock size={16} /> Connectez-vous pour ajouter</>;
  } else if (dejaEnregistre) {
    buttonClass = "bg-emerald-500 text-white cursor-default";
    buttonContent = <><Check size={16} strokeWidth={3} /> Déjà dans le carnet</>;
  } else {
    buttonClass = "bg-blue-50 hover:bg-blue-100 text-blue-600";
    buttonContent = <><PlusCircle size={16} /> Ajouter au carnet</>;
  }

  return (
    <div 
      onClick={handleNavigation}
      className={`block w-[85vw] sm:w-85 p-2.5 bg-white rounded-2xl shadow-xl border transition-all group cursor-pointer relative ${
        dejaEnregistre ? 'border-emerald-100 hover:border-emerald-500' : 'border-neutral-200 hover:border-blue-500'
      }`}
    >
      <div className={`absolute top-2.5 right-2.5 transition-colors ${dejaEnregistre ? 'text-emerald-500' : 'text-neutral-300 group-hover:text-blue-500'}`}>
        <MousePointerClick size={14} />
      </div>
      {ContenuVisuel}
      <button 
        onClick={handleAddClick}
        disabled={!!user && dejaEnregistre}
        className={`mt-3 w-full py-2 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 ${buttonClass}`}
      >
        {buttonContent}
      </button>
    </div>
  );
}