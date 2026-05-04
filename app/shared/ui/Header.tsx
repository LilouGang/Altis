"use client";
import Link from "next/link";
import { Mountain, UserCircle } from 'lucide-react';
import { useAuth } from "../lib/AuthContext";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-50">
      
      {/* 🏔️ Logo */}
      <Link href="/" className="flex items-center gap-2 w-1/3 hover:opacity-80 transition-opacity">
        <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm">
          <Mountain size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-900">Altis.</span>
      </Link>

      {/* 🧭 Navigation Centrale */}
      <nav className="flex items-center justify-center gap-8 w-1/3">
        <Link href="/" className="text-sm font-bold text-emerald-600">Carte</Link>
        <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Dashboard</Link>
        <Link href="/trophees" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5">
           Trophées
        </Link>
      </nav>

      {/* 👤 Section Compte (Bouton Unique) */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        {!loading && (
          <Link 
            href="/compte" 
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-bold rounded-xl transition-colors"
          >
            <UserCircle size={18} />
            {user ? "Mon Compte" : "Connexion"}
          </Link>
        )}
      </div>
      
    </header>
  );
}