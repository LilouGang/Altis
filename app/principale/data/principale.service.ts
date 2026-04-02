import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../shared/lib/firebase';

// On ne télécharge plus les sommets ici, le fichier GeoJSON prend le relais !

export const fetchUserMarkers = async (userId: string): Promise<Record<string, string>> => {
  const qColors = query(collection(db, "user_markers"), where("userId", "==", userId));
  const colorsSnap = await getDocs(qColors);
  
  const colorsMap: Record<string, string> = {};
  colorsSnap.docs.forEach(doc => {
    colorsMap[doc.data().summitId] = doc.data().color;
  });
  
  return colorsMap;
};