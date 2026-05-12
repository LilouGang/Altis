"use client";
import FormulaireAuth from "./ui/FormulaireAuth";
import { useAuth } from "../shared/lib/AuthContext";
import { logoutUser } from "./data/comptes.service";
import { useProfil } from "./logic/profil.hook";
import { User as UserIcon, LogOut, Mail, Lock, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ComptePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const { 
    pseudo, setPseudo, 
    email, setEmail, 
    password, setPassword, 
    loadingUpdate, message, 
    handleUpdateProfile 
  } = useProfil();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-sm font-medium text-neutral-400">
        Chargement de votre espace...
      </div>
    );
  }

  // 🟢 SI CONNECTÉ : Profil éditable directement
  if (user) {
    const handleLogout = async () => {
      await logoutUser();
      router.push('/');
    };

    return (
      <div className="min-h-screen flex flex-col items-center p-6 bg-neutral-50 pt-24 pb-24">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Mon Profil</h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium">Gérez votre identité et vos paramètres.</p>
        </div>

        {/* 👇 On est passé sur max-w-2xl pour plus de largeur */}
        <div className="w-full max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-4xl shadow-sm border border-neutral-200 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
            <UserIcon size={32} strokeWidth={2.5} />
          </div>

          {message.text && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl mb-8 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Formulaire de modification */}
          <form onSubmit={handleUpdateProfile} className="mb-8">
            
            {/* 👇 Grille pour mettre Pseudo et Email côte à côte sur PC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pseudo</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><UserIcon size={18} /></div>
                  <input 
                    type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 text-sm font-bold text-neutral-900 border border-neutral-200 rounded-2xl outline-none focus:border-neutral-900 transition-colors bg-neutral-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><Mail size={18} /></div>
                  <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 text-sm font-bold text-neutral-900 border border-neutral-200 rounded-2xl outline-none focus:border-neutral-900 transition-colors bg-neutral-50 focus:bg-white"
                  />
                </div>
              </div>

            </div>

            {/* Le mot de passe reste sur toute la largeur en dessous */}
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Nouveau mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"><Lock size={18} /></div>
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Laisser vide pour ne pas changer"
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-medium border border-neutral-200 rounded-2xl outline-none focus:border-neutral-900 transition-colors bg-neutral-50 focus:bg-white"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loadingUpdate}
              className="flex items-center justify-center gap-2 w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-2xl transition-colors disabled:opacity-50"
            >
              <Save size={18} /> {loadingUpdate ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>

          {/* Ligne de séparation */}
          <div className="h-px w-full bg-neutral-100 mb-8"></div>

          {/* Bouton de déconnexion seul */}
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-red-100 hover:bg-red-50 text-red-600 text-sm font-bold rounded-2xl transition-colors"
          >
            <LogOut size={18} /> Se déconnecter
          </button>

        </div>
      </div>
    );
  }

  // 🔴 SI NON CONNECTÉ : On affiche le formulaire d'authentification
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 relative top-0 z-40 pt-16">
      <FormulaireAuth />
    </div>
  );
}