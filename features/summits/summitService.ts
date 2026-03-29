import { collection, addDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { Sommet } from "./summitTypes";

// Fonction pour ajouter un sommet dans la collection "sommets"
export async function addSummit(summitData: Omit<Sommet, 'id'>) {
  try {
    // addDoc génère automatiquement un ID unique sur Firebase
    const docRef = await addDoc(collection(db, "sommets"), summitData);
    console.log("Sommet ajouté avec l'ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erreur lors de l'ajout du sommet: ", e);
    throw e;
  }
}