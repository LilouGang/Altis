import { Star, MapPin } from 'lucide-react';
import { Ascension } from './userTypes';

export default function RecentAscensions({ ascensions }: { ascensions: Ascension[] }) {
  if (ascensions.length === 0) {
    return (
      <div className="bg-neutral-50 border border-neutral-200 border-dashed rounded-3xl p-10 text-center">
        <MapPin size={32} className="mx-auto text-neutral-300 mb-3" />
        <h3 className="text-lg font-bold text-neutral-700">Aucune ascension pour le moment</h3>
        <p className="text-neutral-500 mt-1">Explorez la carte et marquez votre premier sommet !</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 shadow-sm rounded-3xl overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
        <h2 className="font-bold text-neutral-800">Journal de bord</h2>
      </div>
      <div className="divide-y divide-neutral-100">
        {ascensions.map((asc) => (
          <div key={asc.id} className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-neutral-50 transition-colors">
            
            <div className="flex items-center gap-4">
              {/* La pastille de couleur personnalisée par l'utilisateur ! */}
              <div className="w-4 h-12 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: asc.customColor }}></div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900">{asc.summitName}</h3>
                <p className="text-sm font-medium text-neutral-500">{asc.altitude}m • Fait le {new Date(asc.dateAscension).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
              {/* Affichage de la note */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < asc.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"} />
                ))}
              </div>
              {asc.comment && (
                <p className="text-sm text-neutral-600 italic bg-white border border-neutral-100 px-3 py-2 rounded-xl">
                  "{asc.comment}"
                </p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}