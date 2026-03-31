import { Plus, Minus, Compass } from 'lucide-react';

interface BoutonsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetNorth: () => void;
  onToggle3D: () => void;
  bearing: number;
  pitch: number;
}

export default function Boutons({ onZoomIn, onZoomOut, onResetNorth, onToggle3D, bearing, pitch }: BoutonsProps) {
  return (
    <div className="absolute bottom-60 right-4 flex flex-col gap-3 z-30">
      <div className="flex flex-col bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <button onClick={onZoomIn} className="p-2.5 hover:bg-neutral-100 border-b border-neutral-200 text-neutral-600 transition-colors">
          <Plus size={18} strokeWidth={2.5} />
        </button>
        <button onClick={onZoomOut} className="p-2.5 hover:bg-neutral-100 text-neutral-600 transition-colors">
          <Minus size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex flex-col bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <button onClick={onResetNorth} className="p-2.5 hover:bg-neutral-100 border-b border-neutral-200 text-neutral-600 transition-colors flex justify-center items-center" title="Remettre au Nord">
          <Compass size={18} strokeWidth={2.5} style={{ transform: `rotate(${-bearing || 0}deg)`, transition: 'transform 0.3s ease' }} />
        </button>
        <button onClick={onToggle3D} className="p-2.5 hover:bg-neutral-100 text-neutral-700 font-black text-[10px] tracking-wider transition-colors h-9.5 flex justify-center items-center" title="Basculer 2D/3D">
          {pitch > 0 ? '2D' : '3D'}
        </button>
      </div>
    </div>
  );
}