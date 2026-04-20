import { Star, MapPin } from 'lucide-react';
import { SommetCarte } from '../../principale/logic/principale.selectors';

export default function RecentAscensions({ carnet }: { carnet: SommetCarte[] }) {
  if (carnet.length === 0) {
    return (
      <div className="bg-transparent border border-neutral-200 border-dashed rounded-4xl p-12 text-center flex flex-col items-center">
        <MapPin size={24} className="text-neutral-300 mb-3" />
        <h3 className="text-base font-bold text-neutral-600">Votre carnet est vide</h3>
        <p className="text-sm text-neutral-400 mt-1">Explorez la carte et marquez votre premier sommet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-neutral-800 text-lg mb-2 px-2">Dernières ascensions</h2>
      
      {carnet.map((asc) => {
        // Formatage d'une date lisible ("12 mai 2026")
        const dateStr = asc.dateAjout ? new Date(asc.dateAjout).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue';

        return (
          <div key={asc.id} className="relative bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md group">
            
            {/* Ligne de couleur personnalisée, beaucoup plus discrète */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 rounded-r-full" style={{ backgroundColor: asc.couleur || '#10b981' }} />
            
            <div className="pl-3 flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-neutral-900 text-base">{asc.nom}</h3>
                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-md font-bold">{asc.altitude} m</span>
              </div>
              <p className="text-xs font-medium text-neutral-400">{dateStr} • {asc.pays}</p>
            </div>

            <div className="pl-3 md:pl-0 flex flex-col items-start md:items-end gap-2">
              {asc.note && asc.note > 0 && (
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < asc.note! ? "text-amber-400 fill-amber-400" : "text-neutral-200"} />
                  ))}
                </div>
              )}
              {asc.commentaire && (
                <p className="text-sm text-neutral-600 font-medium">
                  {asc.commentaire}
                </p>
              )}
            </div>
            
          </div>
        );
      })}
    </div>
  );
}