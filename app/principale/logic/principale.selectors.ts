export interface SommetCarte {
  id: string;
  nom: string;
  altitude: number;
  pays: string;
  image_couverture_url?: string;
  coordonnees: {
    longitude: number;
    latitude: number;
  };
  
  // 📖 NOUVELLES PROPRIÉTÉS DU CARNET DE BORD (Optionnelles)
  statut?: 'fait' | 'a_faire';
  couleur?: string;
  note?: number | null;
  commentaire?: string;
  dateAjout?: string;
  userId?: string;
}