"use client"; 
import { useState } from "react";
import { Filter, Mountain, MapPin, Palette, ChevronDown, X } from "lucide-react"; 

interface FiltresCarteProps {   
  filtres: {     
    altitude: number; setAltitude: (v: number) => void;     
    pays: string; setPays: (v: string) => void;     
    couleur: string; setCouleur: (v: string) => void;     
    optionsPays: string[];     
    optionsCouleurs: string[];   
  };   
  totalAffiches: number; 
} 

export default function FiltresCarte({ filtres, totalAffiches }: FiltresCarteProps) {   
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const altitudeLabel = filtres.altitude === 0 ? "Toutes" : `> ${filtres.altitude.toLocaleString('fr-FR')} m`;

  // 🎨 Traduction des 12 couleurs de ta palette
  const getNomCouleur = (valeur: string) => {
    if (valeur === "Toutes" || !valeur) return "Toutes";
    const noms: Record<string, string> = {
      "#ef4444": "Rouge",
      "#f97316": "Orange",
      "#f59e0b": "Ambre",
      "#eab308": "Jaune",
      "#84cc16": "Vert clair",
      "#22c55e": "Vert",
      "#10b981": "Émeraude",
      "#14b8a6": "Sarcelle",
      "#06b6d4": "Cyan",
      "#3b82f6": "Bleu",
      "#8b5cf6": "Violet",
      "#d946ef": "Rose"
    };
    return noms[valeur.toLowerCase()] || valeur; 
  };

  const boxStyle = "relative flex flex-col justify-center bg-neutral-50/80 rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 md:py-0 h-[68px] md:h-full border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors group overflow-hidden w-full md:min-w-[140px]";

  return (     
    <>
      {/* 📱 BOUTON MOBILE UNIQUE */}
      <div className="absolute top-20 left-2 md:left-4 z-10 md:hidden">
        {/* w-28 et justify-center pour matcher avec MiniStats */}
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="w-28 h-16 flex justify-center items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-neutral-200/50 active:scale-95 transition-transform"
        >
          <Filter size={16} className="text-emerald-600" strokeWidth={2.5} />
          <span className="font-bold text-sm text-neutral-800">Filtres</span>
        </button>
      </div>

      {/* 📱 OVERLAY NOIR POUR MOBILE (z-[60] pour recouvrir les MiniStats qui sont en z-50) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-60 md:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 🧭 CONTENEUR PRINCIPAL (z-[70] sur mobile) */}
      <div className={`
        absolute z-70 md:z-10
        ${isMobileOpen ? 'flex' : 'hidden'} md:flex
        flex-col md:flex-row flex-nowrap items-stretch md:items-center gap-3 md:gap-3
        bg-white md:bg-white/90 md:backdrop-blur-md
        p-5 md:p-2.5
        rounded-3xl md:rounded-3xl shadow-2xl md:shadow-lg border border-neutral-200/50
        animate-in zoom-in-95 md:zoom-in-100 md:slide-in-from-top-4 duration-200
        
        top-1/2 left-4 right-4 -translate-y-1/2 md:translate-y-0
        md:top-20 md:left-1/2 md:-translate-x-1/2 md:h-24 md:w-auto
      `}>              
        
        <div className="flex md:hidden items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-emerald-600" />
            <span className="font-black text-neutral-800 text-lg tracking-tight">Filtres</span>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center h-full aspect-square rounded-2xl bg-neutral-100 text-neutral-400 shrink-0">         
          <Filter size={20} strokeWidth={2.5} />       
        </div>       
        
        {/* BLOC ALTITUDE */}       
        <div className={boxStyle}>         
          <select            
            value={filtres.altitude}            
            onChange={(e) => filtres.setAltitude(Number(e.target.value))}           
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"         
          >           
            <option value={0}>Toutes</option>           
            <option value={2000}>&gt; 2 000 m</option>           
            <option value={3000}>&gt; 3 000 m</option>           
            <option value={4000}>&gt; 4 000 m</option>         
          </select>       
          <div className="flex items-center gap-1.5 mb-1">
            <Mountain size={12} className="text-neutral-400 w-3.5 h-3.5" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Altitude</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm md:text-base font-black text-neutral-800">{altitudeLabel}</span>
            <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>       
        
        {/* BLOC PAYS */}       
        <div className={boxStyle}>         
          <select            
            value={filtres.pays}            
            onChange={(e) => filtres.setPays(e.target.value)}           
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"         
          >           
            {filtres.optionsPays.map(p => (             
              <option key={p} value={p}>{p}</option>           
            ))}         
          </select>       
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={12} className="text-neutral-400 w-3.5 h-3.5" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pays</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm md:text-base font-black text-neutral-800 truncate max-w-37.5 md:max-w-25">{filtres.pays}</span>
            <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>       
        
        {/* BLOC COULEUR */}       
        <div className={boxStyle}>         
          <select            
            value={filtres.couleur}            
            onChange={(e) => filtres.setCouleur(e.target.value)}           
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"         
          >           
            <option value="Toutes">Toutes</option>           
            {filtres.optionsCouleurs.filter(c => c !== "Toutes").map(c => (             
              <option key={c} value={c}>{getNomCouleur(c)}</option>           
            ))}         
          </select>       
          <div className="flex items-center gap-1.5 mb-1">
            <Palette size={12} className="text-neutral-400 w-3.5 h-3.5" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Couleur</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm md:text-base font-black text-neutral-800">{getNomCouleur(filtres.couleur)}</span>
            <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>       
        
        <div className="flex flex-col items-center md:items-start justify-center pt-3 md:pt-0 pb-1 md:pb-0 md:px-4 shrink-0 border-t border-neutral-100 md:border-0 mt-1 md:mt-0">         
          <span className="text-2xl font-black text-emerald-600 md:text-neutral-800 leading-none">{totalAffiches}</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">
            Sommet{totalAffiches !== 1 && 's'} affiché{totalAffiches !== 1 && 's'}
          </span>
        </div>     

        <button 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden mt-2 w-full bg-neutral-900 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform"
        >
          Afficher les résultats
        </button>
        
      </div>   
    </>
  ); 
}