import { useState, useEffect } from 'react';
import { useAuth } from '../../shared/lib/AuthContext';
import { updateUserDisplayName, updateUserEmailAddress, updateUserSecret } from '../data/comptes.service';

export function useProfil() {
  const { user } = useAuth();
  
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setPseudo(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setMessage({ type: "", text: "" });

    try {
      if (pseudo !== user?.displayName) {
        await updateUserDisplayName(pseudo);
      }
      if (email !== user?.email) {
        await updateUserEmailAddress(email);
      }
      if (password.length > 5) {
        await updateUserSecret(password);
        setPassword(""); // On vide le champ après succès
      }
      
      setMessage({ type: "success", text: "Profil mis à jour avec succès." });
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ 
          type: "error", 
          text: "Sécurité : Veuillez vous déconnecter puis vous reconnecter pour modifier ces informations." 
        });
      } else {
        setMessage({ type: "error", text: "Une erreur est survenue." });
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  return {
    pseudo, setPseudo,
    email, setEmail,
    password, setPassword,
    loadingUpdate, message,
    handleUpdateProfile
  };
}