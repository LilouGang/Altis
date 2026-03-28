export interface Coordonnees {
  latitude: number;
  longitude: number;
}

export interface Sommet {
  // 1. Identité & Géographie de base
  id: string; // UUID généré par Firebase
  nom: string;
  noms_alternatifs?: string[]; 
  altitude: number;
  coordonnees: Coordonnees;
  pays: string[];

  // 2. Topographie & Classification
  massif_principal: string;
  soiusa_section?: string;
  soiusa_sous_section?: string;
  prominence?: number; 

  // 3. Données "Gamification" & Esthétique
  listes_celebres?: string[];
  difficulte_moyenne?: 'F' | 'PD' | 'AD' | 'D' | 'TD' | 'ED' | 'EX'; // Cotation alpine standard
  image_couverture_url?: string;
  modele_3d_url?: string; // Pour le futur !
}