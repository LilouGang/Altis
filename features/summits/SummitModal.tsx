// src/components/ui/AjoutAscensionModal.tsx
import { X, Calendar, Clock, CloudSun, Mountain } from 'lucide-react';
import { Sommet } from './summitTypes'; // On importe notre type !

interface Props {
  sommet: Sommet;
  onClose: () => void;
}

export default function AjoutAscensionModal({ sommet, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* La boîte de la modale */}
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* En-tête */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={18} />
          </button>
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1 block">Nouvelle ascension</span>
          <h3 className="text-2xl font-black">{sommet.nom}</h3>
          <p className="text-slate-400 text-sm mt-1">{sommet.altitude}m • {sommet.massif_principal}</p>
        </div>

        {/* Le Formulaire */}
        <div className="p-8 flex flex-col gap-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14}/> Date</label>
              <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-700" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Clock size={14}/> Temps total</label>
              <input type="text" placeholder="Ex: 6h 30m" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-700" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><CloudSun size={14}/> Météo</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-700">
              <option>Grand beau</option>
              <option>Nuageux / Mer de nuages</option>
              <option>Brouillard / Blanc</option>
              <option>Conditions hivernales difficiles</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes personnelles (Voie, conditions...)</label>
            <textarea rows={3} placeholder="Racontez votre course..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium text-slate-700 resize-none"></textarea>
          </div>

          {/* Bouton de validation */}
          <button className="mt-4 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-500/30">
            <Mountain size={20} /> Valider l'ascension
          </button>
        </div>
      </div>
    </div>
  );
}