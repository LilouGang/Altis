"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mountain, TrendingUp, Globe, Award, Star, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { useUtilisateur } from "./logic/utilisateur.hook";
import { useAuth } from "../../shared/lib/AuthContext";
import ListeTrophees from "../../trophees/ui/ListeTrophees";

export default function ProfilPublicPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = params.id as string;
  const { sommets, stats, tropheesGroupes, loading, pseudo } = useUtilisateur(userId);
  
  const [showAllTrophees, setShowAllTrophees] = useState(false);

  useEffect(() => {
    if (user && user.uid === userId) router.push('/dashboard');
  }, [user, userId, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-neutral-400">Chargement...</div>;

  const avis = sommets.filter(s => s.note && s.note > 0);

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 px-6 pb-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 mb-4 transition-colors">
            <ArrowLeft size={14} /> Retour à la carte
          </Link>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter">{pseudo}</h1>
        </div>

        {/* 1. LES 4 CARTES DE STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-4xl border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><Mountain size={20} /></div>
            <div className="text-3xl font-black text-neutral-900 leading-none">{stats.totalSommets}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-2">Sommets gravis</div>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><TrendingUp size={20} /></div>
            <div className="text-3xl font-black text-neutral-900 leading-none">{stats.altitudeTotale.toLocaleString()}m</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-2">Dénivelé total</div>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4"><Globe size={20} /></div>
            <div className="text-3xl font-black text-neutral-900 leading-none">{stats.pays.totalUniques}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-2">Pays visités</div>
          </div>
          <div className="bg-white p-6 rounded-4xl border border-neutral-200 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4"><Maximize2 size={20} /></div>
            <div className="text-3xl font-black text-neutral-900 leading-none">{(stats as any).altitudeMax}m</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-2">Altitude Max</div>
          </div>
        </div>

        {/* 2. SECTION TROPHÉES */}
        <div className="bg-white rounded-4xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 pt-8 pb-2">
             <h2 className="text-2xl font-black text-neutral-900">Succès débloqués</h2>
             <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Palmarès des trophées</p>
          </div>

          <div className={`relative transition-all duration-1000 ease-in-out ${showAllTrophees ? "max-h-1250" : "max-h-112.5"} overflow-hidden px-8`}>
            <div className="category-title-custom pb-8">
              <ListeTrophees 
                  tropheesGroupes={tropheesGroupes} 
                  isPreview={false} 
              />
            </div>
            
            {/* Le dégradé ne s'affiche QUE si c'est fermé pour masquer proprement le bas */}
            {!showAllTrophees && (
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />
            )}
          </div>

          {/* Bouton en bas, façon texte, sans bordure */}
          <button 
            onClick={() => setShowAllTrophees(!showAllTrophees)}
            className="flex items-center justify-center gap-2 w-full pb-6 pt-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors z-20 relative bg-white outline-none"
          >
            {showAllTrophees ? "Réduire" : "Voir tout le palmarès"}
            {showAllTrophees ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* 3. SECTION NOTES & AVIS */}
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-black text-neutral-900 px-2 tracking-tight">Notes & Avis de {pseudo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {avis.length === 0 ? (
              <p className="text-sm text-neutral-400 italic px-2">Aucun avis publié pour le moment.</p>
            ) : (
              avis.map((a, i) => (
                <div key={i} className="bg-white p-7 rounded-4xl border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-black text-neutral-900 text-lg leading-tight">{a.nom}</div>
                      <div className="flex gap-0.5 shrink-0">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= (a.note || 0) ? "text-amber-400 fill-amber-400" : "text-neutral-100"} />)}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 font-medium leading-relaxed">{a.commentaire}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-50 text-[10px] font-bold text-neutral-300 uppercase tracking-widest italic">
                    Ascension du {new Date(a.dateAjout!).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <style jsx global>{`
        /* CORRECTION MAJEURE ICI : 
          On cible uniquement les h2 (les catégories "Endurance", "Exploration") 
          et plus du tout les h3 (les titres des trophées dans les cartes) ! 
        */
        .category-title-custom h2 {
          font-size: 0.8rem !important;
          color: #737373 !important;
          margin-bottom: 1.5rem !important;
          margin-top: 1.5rem !important;
          letter-spacing: 0.15em !important;
          font-weight: 800 !important;
          border-left: 3px solid #e5e5e5;
          padding-left: 12px;
          border-bottom: none !important;
          text-transform: uppercase;
        }

        .category-title-custom {
          opacity: 1 !important;
          filter: none !important;
        }
      `}</style>
    </div>
  );
}