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

  // 🎨 Traduction des couleurs
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

  // 🧩 Composant interne réutilisable pour éviter la répétition du code
  const BlocFiltre = ({ icon: Icon, label, value, displayValue, options, onChange, isMobile }: any) => (
    <div className={`relative flex flex-col justify-center bg-neutral-50/80 hover:bg-neutral-100 transition-colors border border-neutral-100 shrink-0 group overflow-hidden ${isMobile ? 'rounded-xl px-4 py-3 w-full' : 'rounded-2xl px-5 h-full min-w-35'}`}>
      <select            
        value={value}            
        onChange={(e) => onChange(e.target.value)}           
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"         
      >           
        {options}
      </select>       
      <div className={`flex items-center gap-1.5 ${isMobile ? 'mb-1' : 'mb-1'}`}>
        <Icon size={12} className="text-neutral-400 w-3.5 h-3.5" />
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className={`font-black text-neutral-800 ${isMobile ? 'text-sm' : 'text-base max-w-25 truncate'}`}>{displayValue}</span>
        <ChevronDown size={14} className="text-neutral-400 group-hover:text-emerald-500 transition-colors" />
      </div>
    </div>
  );

  return (     
    <>
      {/* ============================================================ */}
      {/* 📱 VERSION MOBILE (Cachée sur PC avec "md:hidden")           */}
      {/* ============================================================ */}
      <div className="absolute top-20 left-2 md:hidden z-10">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="w-28 h-16 flex justify-center items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-neutral-200/50 active:scale-95 transition-transform"
        >
          <Filter size={16} className="text-emerald-600" strokeWidth={2.5} />
          <span className="font-bold text-sm text-neutral-800">Filtres</span>
        </button>
      </div>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 z-60 md:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {isMobileOpen && (
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 z-70 md:hidden flex flex-col gap-3 bg-white p-5 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-emerald-600" />
              <span className="font-black text-neutral-800 text-lg tracking-tight">Filtres</span>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          <BlocFiltre 
            isMobile={true} icon={Mountain} label="Altitude" value={filtres.altitude} displayValue={altitudeLabel} 
            onChange={(v: string) => filtres.setAltitude(Number(v))}
            options={<><option value={0}>Toutes</option><option value={2000}>&gt; 2 000 m</option><option value={3000}>&gt; 3 000 m</option><option value={4000}>&gt; 4 000 m</option></>}
          />
          <BlocFiltre 
            isMobile={true} icon={MapPin} label="Pays" value={filtres.pays} displayValue={filtres.pays} 
            onChange={filtres.setPays}
            options={filtres.optionsPays.map(p => <option key={p} value={p}>{p}</option>)}
          />
          <BlocFiltre 
            isMobile={true} icon={Palette} label="Couleur" value={filtres.couleur} displayValue={getNomCouleur(filtres.couleur)} 
            onChange={filtres.setCouleur}
            options={<><option value="Toutes">Toutes</option>{filtres.optionsCouleurs.filter(c => c !== "Toutes").map(c => <option key={c} value={c}>{getNomCouleur(c)}</option>)}</>}
          />

          <button 
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 w-full bg-neutral-900 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform"
          >
            Afficher {totalAffiches} résultat{totalAffiches !== 1 && 's'}
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 💻 VERSION PC (Cachée sur Mobile avec "hidden md:flex")      */}
      {/* ============================================================ */}
      <div className="hidden md:flex absolute z-10 top-20 left-1/2 -translate-x-1/2 flex-nowrap items-center gap-3 bg-white/90 backdrop-blur-md p-2.5 rounded-3xl shadow-lg border border-neutral-200/50 h-24 w-auto animate-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col items-center justify-center h-full aspect-square rounded-2xl bg-neutral-100 text-neutral-400 shrink-0">         
          <Filter size={20} strokeWidth={2.5} />       
        </div>  
        
        <BlocFiltre 
          isMobile={false} icon={Mountain} label="Altitude" value={filtres.altitude} displayValue={altitudeLabel} 
          onChange={(v: string) => filtres.setAltitude(Number(v))}
          options={<><option value={0}>Toutes</option><option value={2000}>&gt; 2 000 m</option><option value={3000}>&gt; 3 000 m</option><option value={4000}>&gt; 4 000 m</option></>}
        />
        <BlocFiltre 
          isMobile={false} icon={MapPin} label="Pays" value={filtres.pays} displayValue={filtres.pays} 
          onChange={filtres.setPays}
          options={filtres.optionsPays.map(p => <option key={p} value={p}>{p}</option>)}
        />
        <BlocFiltre 
          isMobile={false} icon={Palette} label="Couleur" value={filtres.couleur} displayValue={getNomCouleur(filtres.couleur)} 
          onChange={filtres.setCouleur}
          options={<><option value="Toutes">Toutes</option>{filtres.optionsCouleurs.filter(c => c !== "Toutes").map(c => <option key={c} value={c}>{getNomCouleur(c)}</option>)}</>}
        />

        <div className="flex flex-col justify-center px-4 shrink-0">         
          <span className="text-2xl font-black text-neutral-800 leading-none">{totalAffiches}</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">
            Affiché{totalAffiches !== 1 && 's'}
          </span>
        </div> 
      </div>

    </>
  ); 
}