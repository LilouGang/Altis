"use client";
import { useParams } from "next/navigation";
import { sommetsDb } from "@/lib/data"; // On appelle notre base
import { Mountain, Navigation, ArrowLeft, MessageSquare, Star, Thermometer, Wind } from "lucide-react";
import Link from "next/link";

export default function SommetPage() {
  const params = useParams(); // Récupère l'ID dans l'URL (ex: "mont-blanc")
  
  // On cherche le sommet correspondant dans notre base
  const sommet = sommetsDb.find(s => s.id === params.id);

  if (!sommet) {
    return <div className="p-10 text-center font-bold text-neutral-500">Sommet introuvable.</div>;
  }

  return (
    <main className="w-full min-h-screen bg-neutral-50 pb-24">
      
      {/* 1. HEADER IMAGE (Hero Section) */}
      <div 
        className="h-[40vh] w-full bg-neutral-800 relative flex items-end p-10"
        style={{ backgroundImage: `url(${sommet.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Bouton retour */}
        <Link href="/" className="absolute top-8 left-8 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all">
          <ArrowLeft size={20} />
        </Link>

        {/* Titre superposé à l'image */}
        <div className="relative z-10 text-white">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest border border-white/20 mb-3">
            {sommet.massif}
          </span>
          <h1 className="text-5xl font-black tracking-tight drop-shadow-lg">{sommet.nom}</h1>
        </div>
      </div>

      {/* 2. CORPS DE LA PAGE (2 colonnes sur grand écran) */}
      <div className="max-w-6xl mx-auto mt-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* COLONNE GAUCHE (Infos principales) */}
        <div className="md:col-span-2 space-y-10">
          
          {/* Les 3 stats clés */}
          <div className="flex gap-4">
            <div className="flex-1 bg-white p-5 rounded-2xl border border-neutral-200">
              <span className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-1">Altitude</span>
              <span className="text-2xl font-black text-neutral-900 flex items-center gap-2"><Navigation size={20} className="text-emerald-600"/> {sommet.altitude}m</span>
            </div>
            <div className="flex-1 bg-white p-5 rounded-2xl border border-neutral-200">
              <span className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-1">Cotation</span>
              <span className="text-2xl font-black text-neutral-900">{sommet.difficulte}</span>
            </div>
            <div className="flex-1 bg-white p-5 rounded-2xl border border-neutral-200">
              <span className="block text-sm font-bold text-neutral-400 uppercase tracking-wider mb-1">Proéminence</span>
              <span className="text-2xl font-black text-neutral-900">{sommet.prominence}m</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">À propos de la course</h2>
            <p className="text-lg text-neutral-600 leading-relaxed bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              {sommet.description}
            </p>
          </div>

          {/* Commentaires (Section base de données future) */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2"><MessageSquare size={24} /> Conditions & Avis</h2>
              <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100">
                + Ajouter une condition
              </button>
            </div>

            <div className="space-y-4">
              {/* Exemple de commentaire */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-bold text-neutral-900 block">Marie L.</span>
                    <span className="text-xs text-neutral-500 font-medium">Il y a 2 semaines • Voie Normale</span>
                  </div>
                  <div className="flex text-amber-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} /></div>
                </div>
                <p className="text-neutral-600">Trace bien marquée jusqu'au dôme. Rimaye passe encore bien sur la gauche mais s'ouvre vite. Attention au vent sur l'arête finale.</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (Actions & Météo) */}
        <div className="space-y-6">
          
          {/* Bouton d'action principal */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm sticky top-6">
            <h3 className="font-bold text-neutral-900 mb-2">Prêt pour l'ascension ?</h3>
            <p className="text-sm text-neutral-500 mb-6">Enregistrez cette course dans votre carnet pour débloquer de nouveaux succès.</p>
            <button className="w-full py-4 text-white font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 shadow-sm">
              <Mountain size={20} /> Ajouter à mon carnet
            </button>
          </div>

          {/* Widget Météo Fictif */}
          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h3 className="font-bold text-slate-300 mb-4 uppercase tracking-wider text-xs">Météo au sommet (API)</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-black">-12°C</span>
                <span className="block text-sm text-slate-400 mt-1 flex items-center gap-1"><Thermometer size={14}/> Ressenti -20°C</span>
              </div>
              <div className="text-right">
                <Wind size={24} className="text-slate-400 mb-1 ml-auto" />
                <span className="text-sm font-bold block">45 km/h</span>
                <span className="text-xs text-slate-400">Nord-Ouest</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}