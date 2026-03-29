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
          placeholder="Rechercher..." 
          className="w-full bg-white/55 backdrop-blur-sm backdrop-saturate-200 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full py-4 pl-14 pr-16 text-neutral-800 font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>
    </div>
  );
}