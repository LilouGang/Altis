// app/principale/data/principale.service.ts
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { SommetCarte } from '../logic/principale.selectors';

export const fetchUserSummits = async (userId: string): Promise<SommetCarte[]> => {
  // On récupère les sommets que l'utilisateur a explicitement ajoutés
  const q = query(collection(db, "user_summits"), where("userId", "==", userId));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    ...doc.data(),
    id: doc.id // On utilise l'ID du document Firebase
  } as SommetCarte));
};

export const addSummitToUser = async (userId: string, sommet: SommetCarte, statut: 'fait' | 'a_faire' = 'fait') => {
  try {
    // ID unique : On s'assure qu'un utilisateur n'ajoute pas 2 fois le même sommet
    const docId = `${userId}_${sommet.id}`;
    const summitRef = doc(db, 'user_summits', docId);
    
    // On définit la couleur en fonction du statut (Vert pour fait, Orange pour à faire)
    const markerColor = statut === 'fait' ? '#10b981' : '#f59e0b';

    await setDoc(summitRef, {
      // 1. Les infos topographiques
      id: sommet.id,
      nom: sommet.nom,
      altitude: sommet.altitude,
      pays: sommet.pays,
      coordonnees: sommet.coordonnees,
      image_couverture_url: sommet.image_couverture_url || null,
      
      // 2. Tes infos personnelles
      userId: userId,
      dateAjout: new Date().toISOString(),
      statut: statut,
      couleur: markerColor,
      note: null,
      commentaire: ""
    });

    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du sommet :", error);
    return false;
  }
};