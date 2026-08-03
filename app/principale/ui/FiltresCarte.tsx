"use client"; 
import { Filter, Mountain, MapPin, Palette, ChevronDown } from "lucide-react"; 

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
  
  // Formatage propre pour l'affichage de l'altitude
  const altitudeLabel = filtres.altitude === 0 ? "Toutes" : `> ${filtres.altitude.toLocaleString('fr-FR')} m`;

  return (     
    // 📱 Hauteur fixée : h-16 sur mobile (comme MiniStats), h-24 sur PC. 
    // max-w calculé pour s'arrêter juste avant les statistiques !
    <div className="absolute top-20 left-4 md:left-1/2 md:-translate-x-1/2 z-10 flex flex-nowrap items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-md p-1.5 md:p-2.5 rounded-2xl md:rounded-3xl shadow-lg border border-neutral-200/50 animate-in slide-in-from-top-4 duration-500 overflow-x-auto max-w-[calc(100vw-120px)] md:max-w-[90vw] scrollbar-hide h-16 md:h-24">              
      
      {/* Icône principale (cachée sur mobile pour gagner de la place) */}
      <div className="hidden md:flex flex-col items-center justify-center h-full aspect-square rounded-2xl bg-neutral-100 text-neutral-400 shrink-0">         
        <Filter size={20} strokeWidth={2.5} />       
      </div>       
      
      {/* 1. BLOC ALTITUDE */}       
      <div className="relative flex flex-col justify-center bg-neutral-50/80 rounded-xl md:rounded-2xl px-3 md:px-5 h-full border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors group overflow-hidden min-w-27.5 md:min-w-35">         
        
        {/* Select invisible par-dessus tout pour un clic facile sur mobile */}
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

        {/* Visuel du bouton */}
        <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
          <Mountain size={12} className="text-neutral-400 md:w-3.5 md:h-3.5" />
          <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Altitude</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm md:text-base font-black text-neutral-800">{altitudeLabel}</span>
          <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>       
      
      {/* 2. BLOC PAYS */}       
      <div className="relative flex flex-col justify-center bg-neutral-50/80 rounded-xl md:rounded-2xl px-3 md:px-5 h-full border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors group overflow-hidden min-w-27.5 md:min-w-35">         
        
        <select            
          value={filtres.pays}            
          onChange={(e) => filtres.setPays(e.target.value)}           
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"         
        >           
          {filtres.optionsPays.map(p => (             
            <option key={p} value={p}>{p}</option>           
          ))}         
        </select>       

        <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
          <MapPin size={12} className="text-neutral-400 md:w-3.5 md:h-3.5" />
          <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pays</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm md:text-base font-black text-neutral-800 truncate max-w-20 md:max-w-25">{filtres.pays}</span>
          <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>       
      
      {/* 3. BLOC COULEUR */}       
      <div className="relative flex flex-col justify-center bg-neutral-50/80 rounded-xl md:rounded-2xl px-3 md:px-5 h-full border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors group overflow-hidden min-w-27.5 md:min-w-35">         
        
        <select            
          value={filtres.couleur}            
          onChange={(e) => filtres.setCouleur(e.target.value)}           
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"         
        >           
          <option value="Toutes">Toutes</option>           
          {filtres.optionsCouleurs.filter(c => c !== "Toutes").map(c => (             
            <option key={c} value={c}>{c}</option>           
          ))}         
        </select>       

        <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
          <Palette size={12} className="text-neutral-400 md:w-3.5 md:h-3.5" />
          <span className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Couleur</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm md:text-base font-black text-neutral-800">{filtres.couleur}</span>
          <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>       
      
      {/* Compteur (Caché sur mobile) */}
      <div className="hidden md:flex flex-col justify-center px-4 shrink-0">         
        <span className="text-2xl font-black text-neutral-800 leading-none">{totalAffiches}</span>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">
          Affiché{totalAffiches !== 1 && 's'}
        </span>
      </div>     
      
    </div>   
  ); 
}