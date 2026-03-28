// src/components/layout/Header.tsx
import Link from "next/link";
import { Mountain, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-50 shrink-0">
      
      {/* Gauche : Logo */}
      <div className="flex items-center gap-2 w-1/3">
        <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
          <Mountain size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-900">Altis.</span>
      </div>

      {/* Centre : Navigation */}
      <nav className="flex items-center justify-center gap-8 w-1/3">
        <Link href="/" className="text-sm font-bold text-emerald-600">Explorateur</Link>
        <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Dashboard</Link>
        <Link href="/profil" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Profil</Link>
      </nav>

      {/* Droite : Profil & Recherche */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button className="text-neutral-400 hover:text-neutral-900"><Search size={20} /></button>
        <div className="h-8 w-8 bg-neutral-100 rounded-full border border-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-500 cursor-pointer hover:bg-neutral-200">
          K
        </div>
      </div>

    </header>
  );
}