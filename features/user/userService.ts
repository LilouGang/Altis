import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { Ascension } from "./userTypes";

// Récupérer toutes les ascensions d'un utilisateur spécifique
export async function getUserAscensions(userId: string) {
  const q = query(collection(db, "ascensions"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ascension[];
}