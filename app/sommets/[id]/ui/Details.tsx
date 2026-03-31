import { useState } from "react";
import { Flag } from "lucide-react";
import { Sommet } from "../../../shared/types";

const TRACE_COLORS = ["#ef4444", "#f97316", "#eab308", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#64748b"];

interface DetailsProps {
  sommet: Sommet;
  markerColor: string;
  onColorChange: (color: string) => void;
}

export default function Details({ sommet, markerColor, onColorChange }: DetailsProps) {
  // L'état de la palette est purement visuel, on le laisse dans le composant UI !
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 shadow-sm p-2 mb-8">
      <div 
        className="h-64 md:h-85 w-full rounded-t-3xl rounded-b-xl bg-neutral-100 mb-6"
        style={{ backgroundImage: `url(${sommet.image_couverture_url || 'https://images.unsplash.com/photo-1549880338-65dd4bc8a202?q=80&w=1200'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="px-6 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mr-2 inline-block">{sommet.nom}</h1>
            {sommet.noms_alternatifs && sommet.noms_alternatifs.length > 0 && (
              <span className="text-xl font-normal text-neutral-400">({sommet.noms_alternatifs[0]})</span>
            )}
          </div>
          <div className="relative flex flex-col items-center">
            <button 
              onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <Flag size={24} color={markerColor} fill={markerColor} className="drop-shadow-sm transition-colors duration-300" />
            </button>
            {isColorPaletteOpen && (
              <div className="absolute top-8 right-0 bg-white border border-neutral-100 shadow-xl rounded-2xl p-3 flex gap-2 z-20 animate-in fade-in zoom-in-95">
                {TRACE_COLORS.map(color => (
                  <button
                    key={color} type="button"
                    onClick={() => { onColorChange(color); setIsColorPaletteOpen(false); }}
                    className={`w-6 h-6 rounded-full transition-all ${markerColor === color ? 'ring-2 ring-offset-2 ring-neutral-800 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 border-b border-neutral-100 pb-5 mb-5">
          <span>Altitude <strong className="text-neutral-900 font-bold">{sommet.altitude}m</strong></span>
          <span>Proéminence <strong className="text-neutral-900 font-bold">{sommet.prominence ? `${sommet.prominence}m` : '-'}</strong></span>
          <span>Massif <strong className="text-neutral-900 font-bold">{sommet.massif_principal}</strong></span>
          <span>Pays <strong className="text-neutral-900 font-bold">{sommet.pays?.join(', ')}</strong></span>
        </div>
      </div>
    </div>
  );
}