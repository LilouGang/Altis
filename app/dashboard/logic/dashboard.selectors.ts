import { SommetCarte } from "../../principale/logic/principale.selectors";

export const sortCarnet = (sommets: SommetCarte[]): SommetCarte[] => {
  return [...sommets].sort((a, b) => {
    const dateA = a.dateAjout ? new Date(a.dateAjout).getTime() : 0;
    const dateB = b.dateAjout ? new Date(b.dateAjout).getTime() : 0;
    return dateB - dateA;
  });
};

export const calculateDashboardStats = (sommets: SommetCarte[]) => {
  const faits = sommets.filter(s => s.statut === 'fait' || !s.statut);
  
  if (faits.length === 0) {
    return { totalSummits: 0, totalAscent: 0, maxAltitude: 0 };
  }
  
  return {
    totalSummits: faits.length,
    totalAscent: faits.reduce((acc, curr) => acc + (curr.altitude || 0), 0),
    maxAltitude: Math.max(...faits.map(a => a.altitude || 0))
  };
};