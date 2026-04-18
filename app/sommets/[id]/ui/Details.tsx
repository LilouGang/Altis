"use client";
import { useState, useEffect, useRef } from "react";
import Map from 'react-map-gl/mapbox';
import { ChevronLeft, ChevronRight, Mountain, MapPin, Info } from "lucide-react";
import { SommetCarte } from "../../../principale/logic/principale.selectors";

interface DetailsProps {
  sommet: SommetCarte;
  wiki: { description: string; image: string };
}

export default function Details({ sommet, wiki }: DetailsProps) {
  const [activeTab, setActiveTab] = useState<'3d' | 'photo'>('3d');
  const mapRef = useRef<any>(null);
  
  // 🔍 On vérifie si une image existe
  const hasImage = !!(wiki?.image || sommet?.image_couverture_url);

  useEffect(() => {
    let animationFrame: number;
    const rotate = () => {
      if (mapRef.current && activeTab === '3d') {
        const map = mapRef.current.getMap();
        map.setBearing((map.getBearing() + 0.15) % 360);
      }
      animationFrame = requestAnimationFrame(rotate);
    };
    if (activeTab === '3d') animationFrame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animationFrame);
  }, [activeTab]);

  return (
    <div className="bg-white rounded-[40px] border border-neutral-200 shadow-sm overflow-hidden mb-8">
      <div className="h-112.5 w-full relative bg-neutral-100">
        {activeTab === '3d' || !hasImage ? (
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: sommet.coordonnees.longitude,
              latitude: sommet.coordonnees.latitude,
              zoom: 13.5,
              pitch: 65,
              bearing: 0
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/outdoors-v12"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            interactive={false}
          />
        ) : (
          <div 
            className="w-full h-full animate-in fade-in duration-500"
            style={{ backgroundImage: `url(${wiki.image || sommet.image_couverture_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}

        {/* 🔘 BOUTONS ET INDICATEURS : Seulement si on a une image */}
        {hasImage && (
          <>
            <button onClick={() => setActiveTab(activeTab === '3d' ? 'photo' : '3d')} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <button onClick={() => setActiveTab(activeTab === '3d' ? 'photo' : '3d')} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              <div className={`h-1.5 rounded-full transition-all ${activeTab === '3d' ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
              <div className={`h-1.5 rounded-full transition-all ${activeTab === 'photo' ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
            </div>
          </>
        )}
      </div>

      <div className="p-8">
        <div className="mb-8 border-b border-neutral-100 pb-8">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">{sommet.nom}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
              <Mountain size={14} /> {sommet.altitude} m
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm font-bold">
              <MapPin size={14} /> {sommet.pays}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-neutral-800">
            <Info size={18} strokeWidth={2.5} />
            <h2 className="font-bold text-lg">À propos du sommet</h2>
          </div>
          <p className="text-neutral-600 leading-relaxed font-medium text-lg">{wiki.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-px bg-neutral-100 grow" />
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Source Wikipédia</span>
          </div>
        </div>
      </div>
    </div>
  );
}