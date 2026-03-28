// src/shared/lib/data.ts

// On crée 3 faux sommets juste pour tester le rendu visuel de la carte
export const sommetsDb = [
  {
    id: "1",
    nom: "Mont Blanc",
    massif: "Mont-Blanc",
    altitude: 4807,
    difficulte: "PD",
    lat: 45.8326,
    lng: 6.8652,
    fait: true,
    image: "https://images.unsplash.com/photo-1530878955558-a6c31cb70926?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "2",
    nom: "La Meije",
    massif: "Écrins",
    altitude: 3984,
    difficulte: "D",
    lat: 45.0022,
    lng: 6.3083,
    fait: false,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "3",
    nom: "Cervin",
    massif: "Alpes valaisannes",
    altitude: 4478,
    difficulte: "AD",
    lat: 45.9763,
    lng: 7.6583,
    fait: false,
    image: "https://images.unsplash.com/photo-1549880338-65dd4bc8a202?q=80&w=800&auto=format&fit=crop"
  }
];