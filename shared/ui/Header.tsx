import Link from "next/link";
import { Mountain } from 'lucide-react';

export default function Header() {
  return (
    // Navbar classique : top-0, left-0, right-0, fond blanc pur et bordure en bas
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-50">
      
      {/* Gauche : Logo */}
      <div className="flex items-center gap-2 w-1/3">
        <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm">
          <Mountain size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-900">Altis.</span>
      </div>

      {/* Centre : Navigation */}
      <nav className="flex items-center justify-center gap-8 w-1/3">
        <Link href="/" className="text-sm font-bold text-emerald-600">Explorateur</Link>
        <Link href="/dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Dashboard</Link>
        <Link href="/trophees" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Trophées</Link>
      </nav>

      {/* Droite : Profil */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <div className="h-9 w-9 bg-neutral-100 hover:bg-neutral-200 rounded-full border border-neutral-200 flex items-center justify-center text-xs font-bold text-emerald-700 cursor-pointer transition-all">
          K
        </div>
      </div>
    </header>
  );
}