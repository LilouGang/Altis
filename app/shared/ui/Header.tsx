"use client";
import Link from "next/link";
import { Mountain, LogOut } from 'lucide-react';
import { useAuth } from "../lib/AuthContext";
import { logoutUser } from "../../compte/data/comptes.service";

export default function Header() {
  const { user } = useAuth(); // On récupère l'utilisateur connecté !

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-50">
      
      {/* Gauche : Logo */}
      <Link href="/" className="flex items-center gap-2 w-1/3 hover:opacity-80 transition-opacity">
        <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm">
          <Mountain size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-900">Altis.</span>
      </Link>

      {/* Centre : Navigation */}
      <nav className="flex items-center justify-center gap-8 w-1/3">
        <Link href="/" className="text-sm font-bold text-emerald-600">Explorateur</Link>
        {user && (
          <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Dashboard</Link>
        )}
      </nav>

      {/* Droite : Profil / Auth */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-neutral-400 hidden md:block">{user.email}</span>
            <button 
              onClick={() => logoutUser()} 
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-colors">
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
}