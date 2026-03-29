"use client";
import { useState, useEffect, useMemo } from "react";
import { getSummitById, addAscension, getSummitAscensions, updateAscension } from "./summitService";
import { Sommet } from "./summitTypes";
import { Ascension } from "../user/userTypes";
import { ArrowLeft, Flag, Star, ChevronDown, Check, Edit2, MapPin } from "lucide-react";
import Link from "next/link";

// Nos belles couleurs prédéfinies (Tailwind colors)
const TRACE_COLORS = [
  "#ef4444", // Rouge
  "#f97316", // Orange
  "#eab308", // Jaune
  "#10b981", // Émeraude (défaut)
  "#3b82f6", // Bleu
  "#8b5cf6", // Violet
  "#ec4899", // Rose
  "#64748b", // Gris/Ardoise
];

export default function SummitDetail({ summitId }: { summitId: string }) {
  const [sommet, setSommet] = useState<Sommet | null>(null);
  const [ascensions, setAscensions] = useState<Ascension[]>([]);
  const [loading, setLoading] = useState(true);

  // État de la boîte d'action : 'prompt' (Pas fait) -> 'form' (En cours d'ajout/édition) -> 'done' (Fait)
  const [actionState, setActionState] = useState<'prompt' | 'form' | 'done'>('prompt');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myAscensionId, setMyAscensionId] = useState<string | null>(null); // Pour savoir si on doit Créer ou Mettre à jour

  // États du formulaire
  const [customColor, setCustomColor] = useState(TRACE_COLORS[3]);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [dateAscension, setDateAscension] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  useEffect(() => {
    async function fetchData() {
      try {
        const [summitData, ascensionsData] = await Promise.all([
          getSummitById(summitId),
          getSummitAscensions(summitId)
        ]);
        setSommet(summitData);
        setAscensions(ascensionsData);

        // NOUVEAU : On vérifie si l'utilisateur a DÉJÀ fait ce sommet
        const currentUserId = "user_test_123"; // À remplacer par auth.currentUser.uid plus tard
        const existingAscension = ascensionsData.find(a => a.userId === currentUserId);
        
        if (existingAscension) {
          setActionState('done');
          setMyAscensionId(existingAscension.id);
          setCustomColor(existingAscension.customColor);
          setDateAscension(existingAscension.dateAscension);
          setRating(existingAscension.rating);
          setComment(existingAscension.comment);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [summitId]);

  const stats = useMemo(() => {
    if (ascensions.length === 0) return { total: 0, avg: 0, distribution: [0, 0, 0, 0, 0] };
    const total = ascensions.length;
    const sum = ascensions.reduce((acc, curr) => acc + curr.rating, 0);
    return { 
      total, 
      avg: (sum / total).toFixed(1), 
      distribution: [5, 4, 3, 2, 1].map(star => ascensions.filter(a => a.rating === star).length)
    };
  }, [ascensions]);

  const sortedAscensions = useMemo(() => {
    return [...ascensions].sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.dateAscension).getTime() - new Date(a.dateAscension).getTime();
      return b.rating - a.rating;
    });
  }, [ascensions, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sommet || rating === 0) return alert("Veuillez donner une note.");
    setIsSubmitting(true);

    try {
      const ascensionData = {
        userId: "user_test_123",
        summitId: summitId,
        summitName: sommet.nom,
        altitude: sommet.altitude,
        dateAscension,
        rating,
        comment,
        customColor
      };

      if (myAscensionId) {
        // MISE À JOUR (Édition)
        await updateAscension(myAscensionId, ascensionData);
        setAscensions(prev => prev.map(a => a.id === myAscensionId ? { id: myAscensionId, ...ascensionData } : a));
      } else {
        // CRÉATION
        const newId = await addAscension(ascensionData);
        setMyAscensionId(newId);
        setAscensions([{ id: newId, ...ascensionData }, ...ascensions]);
      }
      
      setActionState('done'); // On repasse en mode "Terminé"
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-sm font-medium text-neutral-400">Chargement des données...</div>;
  if (!sommet) return <div className="p-20 text-center text-sm font-medium text-neutral-400">Sommet introuvable.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={14} /> Retour
        </Link>
      </div>

      {/* SECTION 1 : EN-TÊTE (Encadré discret) */}
      <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm p-2 mb-8">
        <div 
          className="h-64 md:h-[340px] w-full rounded-t-3xl rounded-b-xl bg-neutral-100 mb-6"
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

            {/* Drapeau épuré sans cadre, prenant la couleur choisie */}
            <div className="relative flex flex-col items-center">
              <button 
                onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
                className="focus:outline-none hover:scale-110 transition-transform"
                title="Choisir une couleur"
              >
                <Flag size={24} color={customColor} fill={customColor} className="drop-shadow-sm transition-colors duration-300" />
              </button>
              
              {/* Le menu des couleurs qui s'ouvre au clic */}
              {isColorPaletteOpen && (
                <div className="absolute top-8 right-0 bg-white border border-neutral-100 shadow-xl rounded-2xl p-3 flex gap-2 z-20 animate-in fade-in zoom-in-95">
                  {TRACE_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setCustomColor(color);
                        setIsColorPaletteOpen(false);
                      }}
                      className={`w-6 h-6 rounded-full transition-all ${customColor === color ? 'ring-2 ring-offset-2 ring-neutral-800 scale-110' : 'hover:scale-110'}`}
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
            <span>Pays <strong className="text-neutral-900 font-bold">{sommet.pays.join(', ')}</strong></span>
            <span className="font-mono text-[10px] bg-neutral-50 px-2 py-0.5 rounded">{sommet.coordonnees.latitude.toFixed(4)}, {sommet.coordonnees.longitude.toFixed(4)}</span>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed text-justify">
            Ce sommet est l'un des plus emblématiques de sa région, offrant un panorama exceptionnel à 360 degrés sur les massifs environnants. Sa première ascension documentée date de la fin du 19ème siècle. La voie normale nécessite une bonne condition physique et reste exposée aux caprices de la météo montagnarde. C'est un incontournable pour les passionnés d'alpinisme.
          </p>
        </div>
      </div>

      {/* SECTION 2 : ACTION & FORMULAIRE (Encadré discret avec transitions d'état) */}
      <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm p-8 mb-8 transition-all">
        
        {/* ÉTAT 1 : PROMPT */}
        {actionState === 'prompt' && (
          <div className="text-center">
            <MapPin size={32} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Avez-vous gravi ce sommet ?</h3>
            <p className="text-sm text-neutral-500 mb-6">Ajoutez-le à votre carnet pour sauvegarder vos souvenirs et vos traces.</p>
            <button onClick={() => setActionState('form')} className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-colors">
              Oui, enregistrer mon ascension
            </button>
          </div>
        )}

        {/* ÉTAT 2 : FORMULAIRE (Création ou Édition) */}
        {actionState === 'form' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">Détails de l'ascension</h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-4 md:w-1/2">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Date</label>
                  <input required type="date" value={dateAscension} onChange={(e) => setDateAscension(e.target.value)} className="w-full p-2.5 text-sm font-medium border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Note globale</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={24} onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} className={`cursor-pointer transition-colors ${s <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 flex flex-col justify-center">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Couleur de la trace</label>
                <div className="flex flex-wrap gap-3">
                  {TRACE_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCustomColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${customColor === color ? 'ring-2 ring-offset-2 ring-neutral-800 scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                      title="Choisir cette couleur"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Votre récit / Avis</label>
              <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 text-sm font-medium border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-colors resize-none" placeholder="Partagez les conditions, la voie empruntée..." />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setActionState(myAscensionId ? 'done' : 'prompt')} className="px-5 py-2.5 text-sm font-bold text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors">Annuler</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 shadow-sm">
                {isSubmitting ? "Enregistrement..." : myAscensionId ? "Mettre à jour" : "Publier l'ascension"}
              </button>
            </div>
          </form>
        )}

        {/* ÉTAT 3 : FAIT (Mode affichage avec bouton Modifier) */}
        {actionState === 'done' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                <Check size={20} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Ascension enregistrée</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Fait le {new Date(dateAscension).toLocaleDateString('fr-FR')} • Évalué {rating}/5</p>
              </div>
            </div>
            <button onClick={() => setActionState('form')} className="flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm font-bold rounded-xl transition-colors">
              <Edit2 size={14} /> Modifier mon avis
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3 : AVIS DE LA COMMUNAUTÉ (Encadré discret) */}
      <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm p-8">
        <h2 className="text-xl font-black text-neutral-900 mb-8 border-b border-neutral-100 pb-4">Carnet de la communauté</h2>

        {stats.total === 0 ? (
          <p className="text-sm font-medium text-neutral-500 italic text-center py-8">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Colonne Stats */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-neutral-900 tracking-tighter">{stats.avg}</span>
                <span className="text-sm font-bold text-neutral-400">/ 5</span>
              </div>
              <div className="flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((star, index) => {
                  const count = stats.distribution[index];
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs font-bold text-neutral-500">
                      <span className="w-8 text-right">{star} ét.</span>
                      <div className="flex-grow h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="w-8 text-right text-neutral-400">{percentage.toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-2">{stats.total} avis partagés</p>
            </div>

            {/* Colonne Liste */}
            <div className="md:col-span-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-neutral-900">Récits d'ascension</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')} className="appearance-none bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-600 pl-3 pr-8 py-2 cursor-pointer outline-none hover:bg-neutral-100">
                    <option value="recent">Plus récents</option>
                    <option value="rating">Mieux notés</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {sortedAscensions.map((asc) => (
                  <div key={asc.id} className="flex flex-col gap-2 pb-6 border-b border-neutral-100 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: asc.customColor, boxShadow: `0 0 0 2px white, 0 0 0 4px ${asc.customColor}` }}></div>
                        <span className="text-sm font-bold text-neutral-900">Alpiniste Anonyme</span>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{new Date(asc.dateAscension).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= asc.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"} />
                      ))}
                    </div>
                    {asc.comment && (
                      <p className="text-sm text-neutral-600 font-medium leading-relaxed mt-1">{asc.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}