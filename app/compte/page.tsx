"use client";
import FormulaireAuth from "./ui/FormulaireAuth";
import { useAuth } from "../shared/lib/AuthContext";
import { logoutUser } from "./data/comptes.service";
import { UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ComptePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Pendant que Firebase vérifie qui est là
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm font-medium text-neutral-400">
        Chargement de votre espace...
      </div>
    );
  }

  // 🟢 SI CONNECTÉ : On affiche son profil
  if (user) {
    const handleLogout = async () => {
      await logoutUser();
      router.push('/'); // Retour à la carte après déconnexion
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 relative top-0 z-40 pt-16">
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 text-center animate-in fade-in zoom-in-95 duration-300">
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <UserCircle size={40} strokeWidth={2} />
          </div>
          
          <h1 className="text-2xl font-black text-neutral-900 mb-1">Mon Profil</h1>
          
          {/* On affiche le nom Google ou l'email */}
          <p className="text-neutral-500 font-medium mb-8">
            {user.displayName || user.email}
          </p>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>

        </div>
      </div>
    );
  }

  // 🔴 SI NON CONNECTÉ : On affiche le formulaire
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 relative top-0 z-40 pt-16">
      <FormulaireAuth />
    </div>
  );
}