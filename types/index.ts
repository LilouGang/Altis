// src/types/index.ts

export interface Sommet {
  id: number | string;
  nom: string;
  altitude: number;
  lat: number;
  lng: number;
  massif: string;
  fait: boolean;
  description: string;
  difficulte: string;
  prominence: number;
}

export interface Ascension {
  id: string;
  sommetId: number | string;
  date: string;
  dPlus: number;
  temps: string;
  meteo: 'Soleil' | 'Nuageux' | 'Tempête' | 'Neige';
  note: string;
}