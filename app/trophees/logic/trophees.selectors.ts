import { SommetCarte } from "../../principale/logic/principale.selectors";

export interface Trophee {
  id: string;
  categorie: string;
  titre: string;
  description: string;
  icone: string; // 👈 Va maintenant contenir un Emoji !
  couleur: string;
  debloque: boolean;
  progression: number;
  objectif: number;
  formatUnite?: string;
}

export const calculerTrophees = (sommets: SommetCarte[]): Record<string, Trophee[]> => {
  const faits = sommets.filter(s => s.statut === 'fait');
  
  const nbFaits = faits.length;
  const altiMax = faits.length > 0 ? Math.max(...faits.map(s => s.altitude || 0)) : 0;
  const altiCumul = faits.reduce((acc, s) => acc + (s.altitude || 0), 0);
  const paysUniques = new Set(faits.map(s => s.pays).filter(Boolean)).size;
  const nbAvis = faits.filter(s => s.commentaire && s.commentaire.trim() !== '').length;
  const noteMax = faits.length > 0 ? Math.max(...faits.map(s => s.note || 0)) : 0;

  const creerTrophee = (
    id: string, categorie: string, titre: string, description: string, 
    icone: string, couleur: string, valeurActuelle: number, objectif: number, formatUnite: string = ""
  ): Trophee => ({
    id, categorie, titre, description, icone, couleur,
    debloque: valeurActuelle >= objectif,
    progression: Math.min(valeurActuelle, objectif),
    objectif,
    formatUnite
  });

  const tousLesTrophees = [
    // 🏔️ ENDURANCE
    creerTrophee('sommet_1', 'Endurance', 'Premier pas', 'Enregistrez votre première ascension', '🥾', 'bg-amber-100 border-amber-200', nbFaits, 1),
    creerTrophee('sommet_5', 'Endurance', 'Marcheur du dimanche', 'Atteignez 5 sommets', '🐐', 'bg-emerald-100 border-emerald-200', nbFaits, 5),
    creerTrophee('sommet_10', 'Endurance', 'Randonneur', 'Atteignez 10 sommets', '🧗', 'bg-blue-100 border-blue-200', nbFaits, 10),
    creerTrophee('sommet_25', 'Endurance', 'Passionné des cimes', 'Atteignez 25 sommets', '🥉', 'bg-orange-100 border-orange-200', nbFaits, 25),
    creerTrophee('sommet_50', 'Endurance', 'Alpiniste', 'Atteignez 50 sommets', '🥈', 'bg-slate-200 border-slate-300', nbFaits, 50),
    creerTrophee('sommet_100', 'Endurance', 'Centurion', 'Atteignez 100 sommets', '🥇', 'bg-yellow-200 border-yellow-300', nbFaits, 100),
    creerTrophee('sommet_200', 'Endurance', 'Légende vivante', 'Atteignez 200 sommets', '👑', 'bg-purple-200 border-purple-300', nbFaits, 200),

    // 🦅 ALTITUDE MAXIMALE
    creerTrophee('alti_1000', 'Altitude Max', 'Prendre de la hauteur', 'Gravissez un sommet de >1000m', '🌲', 'bg-emerald-100 border-emerald-200', altiMax, 1000, 'm'),
    creerTrophee('alti_2000', 'Altitude Max', 'Au-dessus des nuages', 'Gravissez un sommet de >2000m', '☁️', 'bg-cyan-100 border-cyan-200', altiMax, 2000, 'm'),
    creerTrophee('alti_3000', 'Altitude Max', 'Le Club des 3000', 'Gravissez un sommet de >3000m', '🦅', 'bg-blue-100 border-blue-200', altiMax, 3000, 'm'),
    creerTrophee('alti_4000', 'Altitude Max', 'Air rare', 'Gravissez un sommet de >4000m', '❄️', 'bg-indigo-100 border-indigo-200', altiMax, 4000, 'm'),
    creerTrophee('alti_4800', 'Altitude Max', 'Toit de l\'Europe', 'Gravissez un sommet de >4800m', '🏔️', 'bg-fuchsia-100 border-fuchsia-200', altiMax, 4800, 'm'),

    // 🚀 DÉNIVELÉ CUMULÉ
    creerTrophee('cumul_5000', 'Ascension Cumulée', 'Camp de base', 'Cumulez 5 000m d\'altitude', '🏕️', 'bg-orange-100 border-orange-200', altiCumul, 5000, 'm'),
    creerTrophee('cumul_8848', 'Ascension Cumulée', 'L\'équivalent Everest', 'Cumulez 8 848m d\'altitude', '🗻', 'bg-slate-200 border-slate-300', altiCumul, 8848, 'm'),
    creerTrophee('cumul_20000', 'Ascension Cumulée', 'La Stratosphère', 'Cumulez 20 000m d\'altitude', '🪂', 'bg-blue-100 border-blue-200', altiCumul, 20000, 'm'),
    creerTrophee('cumul_50000', 'Ascension Cumulée', 'Orbite basse', 'Cumulez 50 000m d\'altitude', '🛸', 'bg-violet-100 border-violet-200', altiCumul, 50000, 'm'),
    creerTrophee('cumul_100000', 'Ascension Cumulée', 'Objectif Lune', 'Cumulez 100 000m d\'altitude', '🚀', 'bg-zinc-800 border-zinc-700', altiCumul, 100000, 'm'),

    // 🌍 EXPLORATION
    creerTrophee('pays_2', 'Exploration', 'Frontalier', 'Sommets dans 2 pays différents', '🗺️', 'bg-emerald-100 border-emerald-200', paysUniques, 2),
    creerTrophee('pays_3', 'Exploration', 'Voyageur', 'Sommets dans 3 pays différents', '🧭', 'bg-blue-100 border-blue-200', paysUniques, 3),
    creerTrophee('pays_5', 'Exploration', 'Globe-trotter', 'Sommets dans 5 pays différents', '🌍', 'bg-indigo-100 border-indigo-200', paysUniques, 5),
    creerTrophee('pays_10', 'Exploration', 'Sans frontières', 'Sommets dans 10 pays différents', '✈️', 'bg-rose-100 border-rose-200', paysUniques, 10),

    // 💬 COMMUNAUTÉ
    creerTrophee('avis_1', 'Communauté', 'La Voix', 'Laissez votre premier récit', '✍️', 'bg-sky-100 border-sky-200', nbAvis, 1),
    creerTrophee('avis_10', 'Communauté', 'Guide local', 'Partagez 10 récits', '📸', 'bg-emerald-100 border-emerald-200', nbAvis, 10),
    creerTrophee('avis_25', 'Communauté', 'Légende', 'Partagez 25 récits', '📖', 'bg-amber-100 border-amber-200', nbAvis, 25),
    creerTrophee('note_max', 'Communauté', 'Coup de foudre', 'Donnez une note de 5 étoiles', '💖', 'bg-red-100 border-red-200', noteMax, 5),
  ];

  return tousLesTrophees.reduce((acc, trophee) => {
    if (!acc[trophee.categorie]) acc[trophee.categorie] = [];
    acc[trophee.categorie].push(trophee);
    return acc;
  }, {} as Record<string, Trophee[]>);
};