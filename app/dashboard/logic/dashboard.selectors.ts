import { SommetCarte } from '../../principale/logic/principale.selectors';

export interface DashboardStats {
  totalSommets: number;
  altitudeTotale: number;
  altitudeMoyenne: number;
  sommetLePlusHaut: { nom: string; altitude: number } | null;
  pays: {
    totalUniques: number;
    topPays: string;
    repartition: { nom: string; count: number; pourcentage: number }[];
  };
}

export const calculateDashboardStats = (sommets: SommetCarte[]): DashboardStats => {
  // On ne garde que les sommets validés (si tu as un système de statut)
  const faits = sommets.filter(s => s.statut === 'fait' || !s.statut);

  // Sécurité : si le carnet est vide (ou si l'utilisateur n'est pas connecté)
  if (faits.length === 0) {
    return {
      totalSommets: 0,
      altitudeTotale: 0,
      altitudeMoyenne: 0,
      sommetLePlusHaut: null,
      pays: { totalUniques: 0, topPays: '-', repartition: [] }
    };
  }

  // --- STATS CLASSIQUES ---
  const totalSommets = faits.length;
  const altitudeTotale = faits.reduce((acc, s) => acc + (s.altitude || 0), 0);
  const altitudeMoyenne = Math.round(altitudeTotale / totalSommets);
  const sommetLePlusHaut = faits.reduce((prev, current) => 
    (prev.altitude || 0) > (current.altitude || 0) ? prev : current
  );

  // --- STATS GÉOGRAPHIQUES (PAYS) ---
  const paysCount: Record<string, number> = {};
  
  faits.forEach(s => {
    // Si un sommet n'a pas de pays défini, on le met dans "Inconnu"
    const p = s.pays || 'Inconnu';
    paysCount[p] = (paysCount[p] || 0) + 1;
  });

  const totalUniques = Object.keys(paysCount).filter(p => p !== 'Inconnu').length;
  
  // On transforme l'objet en tableau pour calculer les pourcentages et trier
  const repartition = Object.entries(paysCount)
    .map(([nom, count]) => ({
      nom,
      count,
      pourcentage: Math.round((count / totalSommets) * 100)
    }))
    .sort((a, b) => b.count - a.count); // Trie du plus visité au moins visité

  const topPays = repartition.length > 0 ? repartition[0].nom : '-';

  return {
    totalSommets,
    altitudeTotale,
    altitudeMoyenne,
    sommetLePlusHaut: { nom: sommetLePlusHaut.nom || "Inconnu", altitude: sommetLePlusHaut.altitude || 0 },
    pays: {
      totalUniques,
      topPays,
      repartition
    }
  };
};