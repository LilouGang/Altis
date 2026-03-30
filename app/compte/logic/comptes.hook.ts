import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitAuth } from "./comptes.actions";

export function useComptes() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await submitAuth(isLogin, email, password);
      router.push("/"); // Redirection vers la carte après succès
    } catch (err: any) {
      setError("Erreur : Identifiants incorrects ou mot de passe trop faible.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => setIsLogin(!isLogin);

  return {
    isLogin,
    email, setEmail,
    password, setPassword,
    error,
    loading,
    handleSubmit,
    toggleMode
  };
}