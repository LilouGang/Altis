import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';
import { Sommet } from '../../shared/types/index';

export const fetchSommets = async (): Promise<Sommet[]> => {
  const sommetsSnap = await getDocs(collection(db, "sommets"));
  return sommetsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Sommet[];
};

export const fetchUserMarkers = async (userId: string): Promise<Record<string, string>> => {
  const qColors = query(collection(db, "user_markers"), where("userId", "==", userId));
  const colorsSnap = await getDocs(qColors);
  
  const colorsMap: Record<string, string> = {};
  colorsSnap.docs.forEach(doc => {
    colorsMap[doc.data().summitId] = doc.data().color;
  });
  
  return colorsMap;
};