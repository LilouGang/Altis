import { Sommet } from "./summitTypes";
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";
import { Ascension } from "../user/userTypes";

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

// 1. Récupérer un sommet
export async function getSummitById(id: string) {
  const docRef = doc(db, "sommets", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as any;
  throw new Error("Sommet introuvable");
}

// 2. Ajouter une ascension (fonctionnelle)
export async function addAscension(ascensionData: Omit<Ascension, 'id'>) {
  const docRef = await addDoc(collection(db, "ascensions"), ascensionData);
  return docRef.id;
}

// 3. NOUVEAU : Récupérer toutes les ascensions/commentaires pour UN sommet
export async function getSummitAscensions(summitId: string) {
  const q = query(collection(db, "ascensions"), where("summitId", "==", summitId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ascension[];
}

export async function updateAscension(id: string, data: Partial<Ascension>) {
  const docRef = doc(db, "ascensions", id);
  await updateDoc(docRef, data);
}

export async function saveMarkerColor(userId: string, summitId: string, color: string) {
  // On crée un ID unique combinant l'utilisateur et le sommet
  const docRef = doc(db, "user_markers", `${userId}_${summitId}`);
  // { merge: true } permet de créer le document s'il n'existe pas, ou de le mettre à jour
  await setDoc(docRef, { userId, summitId, color }, { merge: true });
}

// 6. NOUVEAU : Récupérer la couleur du drapeau
export async function getMarkerColor(userId: string, summitId: string) {
  const docRef = doc(db, "user_markers", `${userId}_${summitId}`);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data().color : "#3b82f6"; // Bleu par défaut si aucune couleur choisie
}