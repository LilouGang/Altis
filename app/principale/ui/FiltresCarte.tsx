"use client";
import { Filter, Mountain, MapPin, Palette } from "lucide-react";

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
  return (
    <div className="absolute top-20 left-3 md:left-1/2 md:-translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 md:p-2 rounded-2xl shadow-lg border border-neutral-200/50 animate-in slide-in-from-top-4 duration-500 overflow-x-auto max-w-[calc(100vw-130px)] md:max-w-[90vw] scrollbar-hide">
      
      <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl bg-neutral-100 text-neutral-500 shrink-0 ml-1">
        <Filter size={16} strokeWidth={2.5} />
      </div>

      {/* Filtre Altitude */}
      <div className="relative flex items-center bg-neutral-50 rounded-lg md:rounded-xl px-2 py-1.5 md:px-3 border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors">
        <Mountain size={14} className="text-neutral-400 mr-1.5 md:mr-2" />
        <select 
          value={filtres.altitude} 
          onChange={(e) => filtres.setAltitude(Number(e.target.value))}
          className="bg-transparent text-xs md:text-sm font-bold text-neutral-700 outline-none cursor-pointer appearance-none pr-3 md:pr-4"
        >
          <option value={0}>Toutes</option>
          <option value={2000}>&gt; 2 000 m</option>
          <option value={3000}>&gt; 3 000 m</option>
          <option value={4000}>&gt; 4 000 m</option>
        </select>
      </div>

      {/* Filtre Pays */}
      <div className="relative flex items-center bg-neutral-50 rounded-lg md:rounded-xl px-2 py-1.5 md:px-3 border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors">
        <MapPin size={14} className="text-neutral-400 mr-1.5 md:mr-2" />
        <select 
          value={filtres.pays} 
          onChange={(e) => filtres.setPays(e.target.value)}
          className="bg-transparent text-xs md:text-sm font-bold text-neutral-700 outline-none cursor-pointer appearance-none pr-3 md:pr-4"
        >
          {filtres.optionsPays.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Filtre Couleur */}
      <div className="relative flex items-center bg-neutral-50 rounded-lg md:rounded-xl px-2 py-1.5 md:px-3 border border-neutral-100 shrink-0 hover:bg-neutral-100 transition-colors">
        <Palette size={14} className="text-neutral-400 mr-1.5 md:mr-2" />
        <select 
          value={filtres.couleur} 
          onChange={(e) => filtres.setCouleur(e.target.value)}
          className="bg-transparent text-xs md:text-sm font-bold text-neutral-700 outline-none cursor-pointer appearance-none pr-3 md:pr-4"
        >
          <option value="Toutes">Toutes</option>
          {filtres.optionsCouleurs.filter(c => c !== "Toutes").map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="hidden md:flex items-center px-3 text-xs font-bold text-neutral-400 whitespace-nowrap">
        {totalAffiches} affiché{totalAffiches !== 1 && 's'}
      </div>
    </div>
  );
}