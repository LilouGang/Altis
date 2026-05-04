"use client";
import { Trophee } from '../logic/trophees.selectors';
import { Check, Lock } from 'lucide-react';

interface ListeTropheesProps {
  tropheesGroupes: Record<string, Trophee[]>;
  isPreview: boolean;
}

export default function ListeTrophees({ tropheesGroupes, isPreview }: ListeTropheesProps) {
  return (
    <div className="flex flex-col gap-12 mt-8">
      {Object.entries(tropheesGroupes).map(([categorie, liste]) => (
        <div key={categorie}>
          <h2 className="text-xl font-black text-neutral-900 mb-6 border-b border-neutral-100 pb-2">
            {categorie}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {liste.map((trophee) => {
              const estDebloque = trophee.debloque && !isPreview;

              return (
                <div 
                  key={trophee.id} 
                  className={`relative flex flex-col items-center text-center p-5 rounded-3xl border transition-all duration-300 ${
                    estDebloque 
                      ? 'bg-white border-neutral-200 shadow-md hover:-translate-y-1' 
                      : 'bg-neutral-50/50 border-neutral-100'
                  }`}
                >
                  {/* L'image / Emoji Centrale */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-sm border ${
                    estDebloque ? trophee.couleur : 'bg-neutral-100 border-neutral-200'
                  }`}>
                    {isPreview ? (
                      <Lock size={28} className="text-neutral-300" strokeWidth={2} />
                    ) : (
                      <span className={`text-3xl transition-all duration-500 ${
                        estDebloque ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-30'
                      }`}>
                        {trophee.icone}
                      </span>
                    )}
                  </div>

                  {/* Textes */}
                  <div className="grow flex flex-col justify-start">
                    <h3 className={`text-sm font-bold leading-tight mb-1 ${estDebloque ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {trophee.titre}
                    </h3>
                    <p className="text-[10px] font-medium text-neutral-400 mb-4 leading-relaxed">
                      {trophee.description}
                    </p>
                  </div>

                  {/* Barre de progression ou Badge Terminé */}
                  <div className="w-full mt-auto pt-4 border-t border-neutral-100/50">
                    {estDebloque ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 py-1.5 rounded-lg w-full">
                        <Check size={14} strokeWidth={3} /> Terminé
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(trophee.progression / trophee.objectif) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">
                          {trophee.progression.toLocaleString('fr-FR')} / {trophee.objectif.toLocaleString('fr-FR')} {trophee.formatUnite}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}