import { Mountain } from "lucide-react";

// On définit ce que l'UI attend comme données pour fonctionner
interface FormulaireAuthProps {
  isLogin: boolean;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  error: string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  toggleMode: () => void;
}

export default function FormulaireAuth({
  isLogin, email, setEmail, password, setPassword, error, loading, handleSubmit, toggleMode
}: FormulaireAuthProps) {
  return (
    <div className="w-full max-w-md bg-white rounded-4xl border border-neutral-200 shadow-sm p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-sm mb-4">
          <Mountain size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-neutral-900">
          {isLogin ? "Bon retour sur Altis" : "Rejoignez l'aventure"}
        </h1>
        <p className="text-sm font-medium text-neutral-500 mt-2 text-center">
          {isLogin ? "Connectez-vous pour retrouver votre carnet d'ascensions." : "Créez un compte pour suivre vos sommets."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Email</label>
          <input 
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3.5 text-sm font-medium border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-colors" 
            placeholder="alpiniste@altis.com" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Mot de passe</label>
          <input 
            required type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3.5 text-sm font-medium border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-colors" 
            placeholder="••••••••" 
          />
        </div>

        <button disabled={loading} type="submit" className="w-full mt-2 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
          {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
        <p className="text-sm text-neutral-500 font-medium">
          {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
        </p>
        <button type="button" onClick={toggleMode} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 mt-1 transition-colors">
          {isLogin ? "Créer un compte gratuitement" : "Connectez-vous ici"}
        </button>
      </div>
    </div>
  );
}