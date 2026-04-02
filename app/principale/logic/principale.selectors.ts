export interface SommetCarte {
  id: string;
  nom: string;
  altitude: number;
  prominence?: number;
  massif_principal?: string;
  pays?: string;
  image_couverture_url?: string;
  markerColor?: string;
  coordonnees: {
    longitude: number;
    latitude: number;
  };
}