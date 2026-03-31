import { Ascension, UserStats } from "../../shared/types/index";

// 1. Fusionner les ascensions avec les couleurs personnalisées et trier par date
export const formatAndSortAscensions = (
  ascensions: Ascension[], 
  colorsMap: Record<string, string>
): Ascension[] => {
  const formatted = ascensions.map(asc => ({
    ...asc,
    customColor: colorsMap[asc.summitId] || "#10b981" // Vert par défaut
  }));

  // Tri du plus récent au plus ancien
  return formatted.sort((a, b) => new Date(b.dateAscension).getTime() - new Date(a.dateAscension).getTime());
};

// 2. Calculer les statistiques globales
export const calculateDashboardStats = (ascensions: Ascension[]): UserStats => {
  if (ascensions.length === 0) {
    return { totalSummits: 0, totalAscent: 0, maxAltitude: 0 };
  }
  
  return {
    totalSummits: ascensions.length,
    totalAscent: ascensions.reduce((acc, curr) => acc + curr.altitude, 0),
    maxAltitude: Math.max(...ascensions.map(a => a.altitude))
  };
};