import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";
import { SommetCarte } from "../../../principale/logic/principale.selectors";

export const fetchUtilisateurSummits = async (userId: string): Promise<SommetCarte[]> => {
  const q = query(collection(db, 'user_summits'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as SommetCarte);
};