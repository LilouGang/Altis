"use client";
import { useState } from 'react';
import { Mountain, TrendingUp } from 'lucide-react';
import { SommetCarte } from '../logic/principale.selectors';

interface QuickStatsProps {
  sommets: SommetCarte[];
}

export default function QuickStats({ sommets = [] }: QuickStatsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const faits = sommets.filter(s => s.statut === 'fait' || !s.statut);
  const altitudeTotale = faits.reduce((total, s) => total + (s.altitude || 0), 0);
  const slides = [];

  slides.push(
    <div key="sommets" className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5 md:mb-1.5">
        <Mountain size={14} strokeWidth={2.5} className="w-3 h-3 md:w-4 md:h-4" />
        <span className="text-[10px] md:text-xs font-medium">Sommets</span>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-neutral-800 tracking-tight leading-none">
        {faits.length}
      </div>
    </div>
  );

  slides.push(
    <div key="altitude" className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5 md:mb-1.5">
        <TrendingUp size={14} strokeWidth={2.5} className="w-3 h-3 md:w-4 md:h-4" />
        <span className="text-[10px] md:text-xs font-medium">Dénivelé</span>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-neutral-800 tracking-tight leading-none flex items-baseline gap-1">
        {altitudeTotale.toLocaleString('fr-FR')} <span className="text-sm md:text-base font-semibold text-neutral-400">m</span>
      </div>
    </div>
  );

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div 
      className="absolute top-20 right-2 md:right-4 z-50 pointer-events-auto select-none cursor-pointer" 
      onClick={nextSlide}
    >
      {/* 📱 Plus petit sur mobile (w-24 h-16), taille normale sur PC (w-36 h-24) */}
      <div className="bg-white/80 backdrop-blur-md border border-neutral-200/50 shadow-sm rounded-2xl w-24 h-16 md:w-36 md:h-24 flex items-center justify-center relative overflow-hidden transition-colors hover:bg-white/95">
        
        <div className="pb-2 md:pb-3">
          {slides[activeIndex]}
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-1.5 md:bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
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