"use client";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { useTrophees } from "./logic/trophees.hook";
import ListeTrophees from "./ui/ListeTrophees";

export default function TropheesPage() {
  const { tropheesGroupes, loading, isPreview } = useTrophees();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm font-medium text-neutral-400">
        Construction du palmarès...
      </div>
    );
  }

  // Calcul rapide des statistiques globales
  let totalTrophees = 0;
  let debloques = 0;
  Object.values(tropheesGroupes).forEach(liste => {
    totalTrophees += liste.length;
    debloques += liste.filter(t => t.debloque).length;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête centré avec Statistiques */}
        <div className="mb-14 flex flex-col items-center text-center gap-3 px-2">
          
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Réalisations</h1>
          <p className="text-base text-neutral-500 font-medium max-w-lg mb-2">
            Débloquez vos succès en enrichissant votre carnet d'alpiniste et suivez votre progression.
          </p>

          {/* Badge des statistiques globales */}
          {!isPreview && (
            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-neutral-200 shadow-sm animate-in zoom-in-95 duration-500">
              <Trophy size={18} className="text-amber-500" strokeWidth={2.5} />
              <span className="text-sm font-bold text-neutral-800">
                {debloques} <span className="text-neutral-400 font-medium">/ {totalTrophees} obtenus</span>
              </span>
              <div className="w-20 h-1.5 bg-neutral-100 rounded-full ml-1 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${totalTrophees > 0 ? (debloques / totalTrophees) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {isPreview && (
            <Link 
              href="/compte" 
              className="mt-2 px-6 py-3 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Se connecter pour débloquer
            </Link>
          )}
        </div>

        {/* Liste groupée */}
        <ListeTrophees tropheesGroupes={tropheesGroupes} isPreview={isPreview} />
        
      </div>
    </div>
  );
}