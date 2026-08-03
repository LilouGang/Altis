"use client";
import Link from "next/link";
import { Mountain, UserCircle, Map, LayoutDashboard, Trophy } from 'lucide-react';
import { useAuth } from "../lib/AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Petite fonction pour colorer le bouton selon la page active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between px-4 md:px-6 z-50">
      
      <Link href="/" className="flex items-center gap-2 shrink-0 relative z-10 hover:opacity-80 transition-opacity">
        <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm">
          <Mountain size={18} strokeWidth={2.5} />
        </div>
        <span className="font-black text-xl tracking-tight text-neutral-900">Altis.</span>
      </Link>

      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 md:gap-8">
        <Link 
          href="/" 
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/') ? 'text-emerald-600' : 'text-neutral-400 hover:text-neutral-900'}`}
          title="Carte"
        >
          {/* 📱 Affiche l'icône sur mobile, la cache sur PC */}
          <Map size={22} className="md:hidden" />
          {/* 📱 Cache le texte sur mobile, l'affiche sur PC */}
          <span className="hidden md:inline">Carte</span>
        </Link>
        
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/dashboard') ? 'text-emerald-600' : 'text-neutral-400 hover:text-neutral-900'}`}
          title="Dashboard"
        >
          <LayoutDashboard size={22} className="md:hidden" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        
        <Link 
          href="/trophees" 
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${isActive('/trophees') ? 'text-emerald-600' : 'text-neutral-400 hover:text-neutral-900'}`}
          title="Trophées"
        >
          <Trophy size={22} className="md:hidden" />
          <span className="hidden md:inline">Trophées</span>
        </Link>
      </nav>

      <div className="flex items-center justify-end shrink-0 relative z-10">
        {!loading && (
          <Link 
            href="/compte" 
            // 📱 Sur mobile : w-10 h-10 arrondi parfait. Sur PC : padding normal et texte.
            className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-bold rounded-full md:rounded-xl transition-colors"
            title={user ? "Mon Compte" : "Connexion"}
          >
            <UserCircle size={20} />
            <span className="hidden md:inline">{user ? "Mon Compte" : "Connexion"}</span>
          </Link>
        )}
      </div>
      
    </header>
  );
}