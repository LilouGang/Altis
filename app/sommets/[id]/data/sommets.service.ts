import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";
import { SommetCarte } from "../../../principale/logic/principale.selectors";

export const getSummitFromCarnet = async (userId: string, summitId: string): Promise<SommetCarte | null> => {
  const docRef = doc(db, 'user_summits', `${userId}_${summitId}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data() as SommetCarte;
  return null;
};

export const getCommunityReviews = async (summitId: string): Promise<SommetCarte[]> => {
  const q = query(collection(db, 'user_summits'), where('id', '==', summitId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as SommetCarte);
};

export const fetchWikipediaData = async (nom: string) => {
  try {
    const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nom)}`);
    const data = await res.json();
    return {
      description: data.extract || "Aucune description disponible.",
      image_wiki: data.originalimage?.source || ""
    };
  } catch {
    return { description: "Aucune description disponible.", image_wiki: "" };
  }
};

export const addAscension = async (docId: string, data: SommetCarte) => {
  const summitRef = doc(db, 'user_summits', docId);
  await setDoc(summitRef, data, { merge: true });
  return docId;
};

export const updateAscension = async (docId: string, data: Partial<SommetCarte>) => {
  const summitRef = doc(db, 'user_summits', docId);
  await updateDoc(summitRef, data);
  return docId;
};

export const saveMarkerColor = async (docId: string, color: string) => {
  const summitRef = doc(db, 'user_summits', docId);
  await updateDoc(summitRef, { couleur: color });
};