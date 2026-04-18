"use client";
import { useState } from 'react';
import { Mountain, TrendingUp, MapPin } from 'lucide-react';
import { SommetCarte } from '../logic/principale.selectors';

interface QuickStatsProps {
  sommets: SommetCarte[];
}

export default function QuickStats({ sommets = [] }: QuickStatsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Analyse des données
  const faits = sommets.filter(s => s.statut === 'fait' || !s.statut);
  const altitudeTotale = faits.reduce((total, s) => total + (s.altitude || 0), 0);

  // 2. Construction des 2 slides parfaitement centrées
  const slides = [];

  // Slide 1 : Le nombre de sommets
  slides.push(
    <div key="sommets" className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-1.5 text-neutral-500 mb-1.5">
        <Mountain size={14} strokeWidth={2.5} />
        <span className="text-xs font-medium">Sommets</span>
      </div>
      <div className="text-3xl font-bold text-neutral-800 tracking-tight leading-none">
        {faits.length}
      </div>
    </div>
  );

  // Slide 2 : L'altitude cumulée
  slides.push(
    <div key="altitude" className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-1.5 text-neutral-500 mb-1.5">
        <TrendingUp size={14} strokeWidth={2.5} />
        <span className="text-xs font-medium">Dénivelé</span>
      </div>
      <div className="text-3xl font-bold text-neutral-800 tracking-tight leading-none flex items-baseline gap-1">
        {altitudeTotale.toLocaleString('fr-FR')} <span className="text-base font-semibold text-neutral-400">m</span>
      </div>
    </div>
  );

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  if (sommets.length === 0) {
    return (
      <div className="absolute top-20 right-4 z-50 pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 shadow-sm rounded-2xl w-36 h-12 flex justify-center items-center gap-2">
          <MapPin size={16} className="text-neutral-400" />
          <div className="text-xs font-medium text-neutral-500">Carnet vide</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute top-20 right-4 z-50 pointer-events-auto select-none cursor-pointer" 
      onClick={nextSlide}
    >
      {/* 🌟 WIDGET À TAILLE FIXE : w-36 (144px) et h-24 (96px) pour une symétrie parfaite */}
      <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 shadow-sm rounded-2xl w-36 h-24 flex items-center justify-center relative overflow-hidden transition-colors hover:bg-white/95">
        
        {/* On "remonte" légèrement le contenu (pb-3) pour faire de la place aux points en bas */}
        <div className="pb-3">
          {slides[activeIndex]}
        </div>

        {/* 🔴 INDICATEURS EN BAS AU CENTRE */}
        {slides.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-3 bg-neutral-800' : 'w-1 bg-neutral-300'}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}