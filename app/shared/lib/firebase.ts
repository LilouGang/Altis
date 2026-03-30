// src/shared/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Ton objet de configuration (qui lit les variables d'environnement)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// INITIALISATION SÉCURISÉE POUR NEXT.JS
// Dans Next.js, le code peut être rechargé plusieurs fois (Hot Reload).
// Cette condition évite l'erreur "Firebase App already exists".
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// On exporte la base de données (Firestore) et l'authentification (Auth)
export const db = getFirestore(app);
export const auth = getAuth(app);