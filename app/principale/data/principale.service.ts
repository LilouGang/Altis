// app/principale/data/principale.service.ts
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { SommetCarte } from '../logic/principale.selectors';

export const fetchUserSummits = async (userId: string): Promise<SommetCarte[]> => {
  const q = query(collection(db, "user_summits"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { ...data, id: data.id } as SommetCarte;
  });
}

export const addSummitToUser = async (userId: string, sommet: SommetCarte) => {
  const cleanId = sommet.id.replace(/^(peak_|osm_)/, '');
  const docId = `${userId}_${cleanId}`; // ID de document propre : user123_123456
  
  const summitRef = doc(db, 'user_summits', docId);

  await setDoc(summitRef, {
    ...sommet,
    id: cleanId, // 👈 On écrase l'ID osm_ par l'ID propre
    userId: userId,
    dateAjout: new Date().toISOString(),
    statut: 'fait',
    note: null, // Null pour ne pas polluer le carnet communautaire avant la notation
    commentaire: ""
  });
  return true;
};