"use client";
import { Mountain } from "lucide-react";
import { useCompte } from "../logic/comptes.hook";

export default function FormulaireAuth() {
  const { 
    isLogin, toggleMode, 
    email, setEmail, 
    password, setPassword, 
    pseudo, setPseudo, 
    loading, error, 
    handleGoogleAuth, handleSubmit 
  } = useCompte();

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-sm mb-4">
          <Mountain size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-neutral-900">
          {isLogin ? "Bon retour sur Altis" : "Rejoindre l'aventure"}
        </h1>
        <p className="text-neutral-500 mt-1 text-sm font-medium">
          {isLogin ? "Connectez-vous pour voir votre carnet." : "Créez votre carnet de sommets."}
        </p>
      </div>

      <button 
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-neutral-700 font-bold py-3 px-4 rounded-xl hover:bg-neutral-50 transition-colors mb-6"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
        Continuer avec Google
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-neutral-200 flex-1"></div>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">ou par email</span>
        <div className="h-px bg-neutral-200 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Votre pseudo (ex: Alpiniste_Du_74)" 
            value={pseudo} 
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            required
          />
        )}
        <input 
          type="email" 
          placeholder="Adresse email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          required
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
          required
        />

        {error && <p className="text-red-500 text-sm font-bold text-center mt-2">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2"
        >
          {loading ? "Chargement..." : (isLogin ? "Se connecter" : "S'inscrire")}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button onClick={toggleMode} className="text-sm font-bold text-neutral-500 hover:text-emerald-600 transition-colors">
          {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}