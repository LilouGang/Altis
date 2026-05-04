import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "../../shared/lib/firebase";

// 🔴 Déconnexion (déjà utilisée dans ton Header)
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};

// 🔵 Connexion avec Google
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// 🟢 Inscription par Email/Mot de passe
export const registerWithEmail = async (email: string, password: string, pseudo: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // On ajoute le pseudo au profil fraîchement créé
    await updateProfile(result.user, { displayName: pseudo });
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: "Erreur lors de l'inscription. L'email est peut-être déjà utilisé." };
  }
};

// 🟡 Connexion par Email/Mot de passe
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: "Email ou mot de passe incorrect." };
  }
};