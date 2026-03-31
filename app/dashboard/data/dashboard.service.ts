import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import { Ascension } from "../../shared/types/index";

export const fetchUserAscensions = async (userId: string): Promise<Ascension[]> => {
  const q = query(collection(db, "ascensions"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ascension[];
};

export const fetchUserColors = async (userId: string): Promise<Record<string, string>> => {
  const qColors = query(collection(db, "user_markers"), where("userId", "==", userId));
  const colorsSnap = await getDocs(qColors);
  
  const colorsMap: Record<string, string> = {};
  colorsSnap.docs.forEach(doc => {
    colorsMap[doc.data().summitId] = doc.data().color;
  });
  
  return colorsMap;
};