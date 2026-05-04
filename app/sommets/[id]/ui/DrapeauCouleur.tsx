"use client";
import { useState, useRef, useEffect } from "react";
import { Flag } from "lucide-react";

interface DrapeauCouleurProps {
  color: string;
  onChangeColor: (color: string) => void;
}

const PALETTE_ETENDUE = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'
];

export default function DrapeauCouleur({ color, onChangeColor }: DrapeauCouleurProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center transition-transform hover:scale-110 drop-shadow-sm ml-1"
        title="Changer la couleur du marqueur"
      >
        <Flag size={28} fill={color} stroke={color} strokeWidth={1} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 p-3 bg-white rounded-2xl shadow-xl border border-neutral-100 z-50 animate-in fade-in zoom-in-95 w-42">
          <h4 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">Couleur</h4>
          <div className="grid grid-cols-4 gap-2">
            {PALETTE_ETENDUE.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onChangeColor(c);
                  setIsOpen(false);
                }}
                className={`w-7 h-7 rounded-full transition-transform ${c === color ? 'scale-110 ring-2 ring-offset-2 ring-neutral-800' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}