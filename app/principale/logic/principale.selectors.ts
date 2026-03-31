import { Sommet } from '../../shared/types/index';

export type SommetCarte = Sommet & { markerColor: string };

export const mergeSommetsAndColors = (sommets: Sommet[], markerColors: Record<string, string>): SommetCarte[] => {
  return sommets.map(sommet => ({
    ...sommet,
    markerColor: markerColors[sommet.id] || "#3b82f6" // Bleu par défaut
  }));
};