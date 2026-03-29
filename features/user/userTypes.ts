export interface Ascension {
  id: string;          // Généré par Firebase
  userId: string;      // L'ID du grimpeur
  summitId: string;    // L'ID du sommet dans la base
  
  // On copie quelques infos de base pour éviter de faire 2 requêtes sur le dashboard
  summitName: string;  
  altitude: number;    

  dateAscension: string; // Format YYYY-MM-DD
  rating: number;        // Note sur 5
  comment: string;       // Le commentaire public/privé
  customColor: string;   // La couleur choisie pour la carte (ex: "#10b981")
}

export interface UserStats {
  totalSummits: number;
  totalAscent: number;   // Dénivelé / Altitude cumulée
  maxAltitude: number;
}