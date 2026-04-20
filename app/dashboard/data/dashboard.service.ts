import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import { SommetCarte } from "../../principale/logic/principale.selectors";

export const fetchUserCarnet = async (userId: string): Promise<SommetCarte[]> => {
  const q = query(collection(db, "user_summits"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  // On retourne directement les documents sous le format de ton interface SommetCarte
  return snapshot.docs.map(doc => doc.data() as SommetCarte);
};