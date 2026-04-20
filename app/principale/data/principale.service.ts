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
  const docId = `${userId}_${cleanId}`;
  
  const summitRef = doc(db, 'user_summits', docId);

  await setDoc(summitRef, {
    ...sommet,
    id: cleanId,
    userId: userId,
    dateAjout: new Date().toISOString(),
    statut: 'fait',
    note: null,
    commentaire: ""
  });
  return true;
};