export interface Coordonnees {
  latitude: number;
  longitude: number;
}

export interface Sommet {
  id: string;
  nom: string;
  noms_alternatifs?: string[]; 
  altitude: number;
  coordonnees: Coordonnees;
  pays: string[];
  massif_principal: string;
  soiusa_section?: string;
  soiusa_sous_section?: string;
  prominence?: number;
  listes_celebres?: string[];
  difficulte_moyenne?: 'F' | 'PD' | 'AD' | 'D' | 'TD' | 'ED' | 'EX';
  image_couverture_url?: string;
  modele_3d_url?: string;
}

export interface Ascension {
  id: string;
  userId: string;
  summitId: string;
  summitName: string;
  altitude: number;
  dateAscension: string;
  rating: number;
  comment: string;
  customColor: string;
}

export interface UserStats {
  totalSummits: number;
  totalAscent: number;
  maxAltitude: number;
}