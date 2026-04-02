import Link from 'next/link';
import { MousePointerClick } from 'lucide-react';
import { SommetCarte } from '../logic/principale.selectors';

interface PopupProps {
  sommet: SommetCarte;
}

export default function PopupFiche({ sommet }: PopupProps) {
  return (
    <Link 
      href={`/sommets/${sommet.id}`} 
      className="block w-85 p-2.5 bg-white rounded-2xl shadow-xl border border-neutral-200 hover:border-emerald-500 transition-colors group cursor-pointer relative"
    >
      <div className="absolute top-2.5 right-2.5 text-neutral-400 group-hover:text-emerald-500 transition-colors">
        <MousePointerClick size={14} />
      </div>

      <div className="flex gap-3 items-center">
        <div 
          className="w-14 h-14 rounded-xl bg-neutral-100 shrink-0" 
          style={{ backgroundImage: `url(${sommet.image_couverture_url || 'https://images.unsplash.com/photo-1549880338-65dd4bc8a202?q=80&w=200'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <div className="flex flex-col grow overflow-hidden pr-3">
          <h3 className="font-bold text-neutral-900 text-sm leading-tight mb-1.5 truncate group-hover:text-emerald-600 transition-colors">
            {sommet.nom}
          </h3>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Alti.</span>
              <span className="text-xs font-semibold text-neutral-800">{sommet.altitude}m</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Proé.</span>
              <span className="text-xs font-semibold text-neutral-800">{sommet.prominence ? `${sommet.prominence}m` : '-'}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Massif</span>
              <span className="text-xs font-semibold text-neutral-800 truncate w-full" title={sommet.massif_principal}>{sommet.massif_principal}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Pays</span>
              <span className="text-xs font-semibold text-neutral-800 truncate w-full" title={sommet.pays?.join(', ')}>{sommet.pays?.[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}