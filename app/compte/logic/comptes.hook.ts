import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "../data/comptes.service";

export function useCompte() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // true = Connexion, false = Inscription
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await loginWithGoogle();
    setLoading(false);
    if (error) setError(error);
    else router.push("/"); // On redirige vers la carte après succès
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (isLogin) {
      result = await loginWithEmail(email, password);
    } else {
      result = await registerWithEmail(email, password, pseudo);
    }

    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/"); // On redirige vers la carte
    }
  };

  return {
    isLogin, toggleMode,
    email, setEmail,
    password, setPassword,
    pseudo, setPseudo,
    loading, error,
    handleGoogleAuth, handleSubmit
  };
}