import { doc, getDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";
import { SommetCarte } from "../../../principale/logic/principale.selectors";

// 1. Chercher si LE sommet est dans MON carnet
export async function getSummitFromCarnet(userId: string, summitId: string) {
  const docRef = doc(db, "user_summits", `${userId}_${summitId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as SommetCarte) : null;
}

// 2. Chercher les avis de TOUTE la communauté pour ce sommet
export async function getCommunityReviews(summitId: string) {
  const q = query(collection(db, "user_summits"), where("id", "==", summitId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as SommetCarte);
}

// 3. 🪄 MAGIE : Récupérer Description + Image sur Wikipédia
export async function fetchWikipediaData(nomSommet: string) {
  try {
    // On cherche sur le Wikipédia français
    const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nomSommet)}`;
    const response = await fetch(url);
    const data = await response.json();

    return {
      description: data.extract || "Aucune description disponible pour ce sommet.",
      image_wiki: data.originalimage?.source || null,
      description_short: data.description || ""
    };
  } catch (error) {
    return { description: "", image_wiki: null, description_short: "" };
  }
}