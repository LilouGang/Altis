import Link from "next/link";
import { Mountain, LayoutDashboard, Map as MapIcon, Award, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col z-20">
      {/* Logo Altis */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-emerald-600 p-2.5 rounded-xl text-white">
          <Mountain size={22} strokeWidth={2.5} />
        </div>
        <h1 className="font-bold text-2xl tracking-tight text-neutral-900">Altis.</h1>
      </div>

      {/* Navigation façon Apple (très plate, hover gris très clair) */}
      <nav className="flex-1 px-4 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors font-medium">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-700 bg-emerald-50 transition-colors font-medium">
          <MapIcon size={20} />
          <span>Explorateur</span>
        </Link>
        <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors font-medium">
          <User size={20} />
          <span>Profil & Succès</span>
        </Link>
      </nav>

      <div className="p-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}