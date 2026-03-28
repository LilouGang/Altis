// src/features/search/FloatingSearch.tsx
import { Search, Command } from 'lucide-react';

export default function FloatingSearch() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-40">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search size={20} className="text-neutral-500 group-focus-within:text-emerald-600 transition-colors" />
        </div>
        
        <input 
          type="text" 
          placeholder="Rechercher un sommet, un massif..." 
          className="w-full bg-white/80 backdrop-blur-md backdrop-saturate-200 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full py-4 pl-14 pr-16 text-neutral-800 font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
        
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/50 backdrop-blur-md rounded-lg border border-white/40 text-neutral-500 text-xs font-bold shadow-sm">
            <Command size={12} /> K
          </div>
        </div>
      </div>
    </div>
  );
}