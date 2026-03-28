"use client";
import { Mountain, TrendingUp, Calendar, ArrowRight, Award } from 'lucide-react';

const statsUtilisateur = { sommetsGravis: 14, dPlusAnnuel: 12450, altitudeMax: 4805 };
const activitesRecentes = [
  { id: 1, sommet: "Mont Blanc", date: "12 Août 2025", dPlus: 2400, temps: "14h 30m" },
  { id: 2, sommet: "Grand Paradis", date: "28 Juil 2025", dPlus: 1300, temps: "6h 15m" },
];

export default function Dashboard() {
  return (
    <main className="p-10 max-w-5xl mx-auto w-full">
      
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Bonjour, Killian</h1>
        <p className="text-neutral-500 mt-1">Voici un résumé de votre année en montagne.</p>
      </div>

      {/* Les 3 stats (Cartes minimalistes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-neutral-500 font-medium text-sm">Sommets gravis</span>
            <Mountain size={20} className="text-emerald-600" />
          </div>
          <p className="text-4xl font-bold text-neutral-900">{statsUtilisateur.sommetsGravis}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-neutral-500 font-medium text-sm">Dénivelé positif</span>
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <p className="text-4xl font-bold text-neutral-900">{statsUtilisateur.dPlusAnnuel.toLocaleString()} m</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-neutral-500 font-medium text-sm">Altitude max</span>
            <Award size={20} className="text-emerald-600" />
          </div>
          <p className="text-4xl font-bold text-neutral-900">{statsUtilisateur.altitudeMax} m</p>
        </div>
      </div>

      {/* Le Fil d'activité (Style Liste Apple) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Activité récente</h2>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
            Tout voir <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {activitesRecentes.map((act, index) => (
            <div key={act.id} className={`p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer ${index !== activitesRecentes.length - 1 ? 'border-b border-neutral-100' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <Mountain size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{act.sommet}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mt-0.5">
                    <Calendar size={14} /> {act.date} • {act.temps}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-neutral-900">+{act.dPlus}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}