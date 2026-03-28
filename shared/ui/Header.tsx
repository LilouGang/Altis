// src/shared/ui/Header.tsx
import Link from "next/link";
import { Mountain, Search } from 'lucide-react';

export default function Header() {
  return (
    // On la rend "fixed", on la centre, on décolle du haut (top-6) et on applique le glassmorphism
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl h-16 bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl flex items-center justify-between px-6 z-50">
      
      {/* Gauche : Logo */}
      <div className="flex items-center gap-2 w-1/3">
        <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm">
          <Mountain size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-900">Altis.</span>
      </div>

      {/* Centre : Navigation */}
      <nav className="flex items-center justify-center gap-8 w-1/3">
        <Link href="/" className="text-sm font-bold text-emerald-600 drop-shadow-sm">Explorateur</Link>
        <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Dashboard</Link>
        <Link href="/profil" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Profil</Link>
      </nav>

      {/* Droite : Profil & Recherche */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        {/* On retire l'icône de recherche d'ici, car tu veux une barre dédiée en bas ! */}
        <div className="h-9 w-9 bg-gradient-to-tr from-emerald-100 to-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-700 cursor-pointer hover:shadow-md transition-all">
          K
        </div>
      </div>
    </header>
  );
}