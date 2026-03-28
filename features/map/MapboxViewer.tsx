// src/features/map/MapboxViewer.tsx
"use client";
import { useState } from 'react';
import Map, { Source, Marker, Popup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { sommetsDb } from '@/shared/lib/data'; 
import { ArrowUpDown, Compass, Minus, MousePointerClick, Plus } from 'lucide-react';

export default function MapboxViewer() {
  const [viewState, setViewState] = useState({ longitude: 6.8694, latitude: 45.4, zoom: 8, pitch: 45, bearing: 0 });
  const [popupInfo, setPopupInfo] = useState<any>(null);

  // 2. Ajoute ces fonctions de contrôle
  const handleZoomIn = () => setViewState(prev => ({ ...prev, zoom: prev.zoom + 1 }));
  const handleZoomOut = () => setViewState(prev => ({ ...prev, zoom: prev.zoom - 1 }));
  const handleResetNorth = () => setViewState(prev => ({ ...prev, bearing: 0 }));
  const handleToggle3D = () => setViewState(prev => ({ ...prev, pitch: prev.pitch === 0 ? 60 : 0 }));

  return (
    <section className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v12" // On pourra passer sur un style satellite 3D plus tard
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

        {/* MARQUEURS */}
        {sommetsDb.map((sommet) => (
          <Marker key={sommet.id} longitude={sommet.lng} latitude={sommet.lat} anchor="bottom">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setPopupInfo(sommet);
              }} 
              // Style ultra-clean pour les points
              className={`cursor-pointer relative z-10 h-5 w-5 rounded-full border-2 shadow-lg hover:scale-125 transition-transform ${sommet.fait ? 'bg-emerald-500 border-white' : 'bg-white/80 backdrop-blur-sm border-neutral-300'}`}
            />
          </Marker>
        ))}

        {/* POPUP ULTRA-DESIGN AMÉLIORÉ */}
        {popupInfo && (
        <Popup longitude={popupInfo.lng} latitude={popupInfo.lat} anchor="bottom" offset={24} closeButton={false} onClose={() => setPopupInfo(null)} className="z-20">
            <div className="w-64 flex flex-col p-2 bg-white/90 backdrop-blur-xl rounded-[1.25rem] shadow-2xl border border-white/50">
            
            {/* Image avec dégradé intégré pour l'immersion */}
            <div 
                className="h-32 w-full rounded-2xl mb-3 relative overflow-hidden group flex items-end p-3" 
                style={{ backgroundImage: `url(${popupInfo.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Voile sombre pour la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Tag Massif en haut à gauche */}
                <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md border border-white/30 px-2 py-1 rounded-md">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white block leading-none drop-shadow-sm">{popupInfo.massif}</span>
                </div>

                {/* Info superposée sur l'image */}
                <div className="relative z-10 w-full">
                    <h3 className="font-bold text-white text-lg leading-tight truncate drop-shadow-md">{popupInfo.nom}</h3>
                    <p className="text-xs font-medium text-neutral-200">{popupInfo.altitude}m • Diff. {popupInfo.difficulte}</p>
                </div>
            </div>
            
            {/* Bouton d'action */}
            <div className="px-1 pb-1">
                <Link href={`/sommets/${popupInfo.id}`} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all flex justify-center items-center shadow-md hover:shadow-lg shadow-emerald-500/20">
                Explorer ce sommet
                </Link>
            </div>
            </div>
        </Popup>
        )}

        <div className="absolute bottom-48 right-4 flex flex-col gap-3 z-30">
          {/* Groupe Zoom */}
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
            <button onClick={handleZoomIn} className="p-2.5 hover:bg-neutral-100 border-b border-neutral-200 text-neutral-600 transition-colors">
              <Plus size={18} strokeWidth={2.5} />
            </button>
            <button onClick={handleZoomOut} className="p-2.5 hover:bg-neutral-100 text-neutral-600 transition-colors">
              <Minus size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Groupe Boussole / 3D */}
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
            <button onClick={handleResetNorth} className="p-2.5 hover:bg-neutral-100 border-b border-neutral-200 text-neutral-600 transition-colors flex justify-center items-center" title="Remettre au Nord">
              {/* Petite astuce visuelle : la boussole tourne en fonction de l'angle de la carte ! */}
              <Compass size={18} strokeWidth={2.5} style={{ transform: `rotate(${-viewState.bearing || 0}deg)`, transition: 'transform 0.3s ease' }} />
            </button>
            <button onClick={handleToggle3D} className="p-2.5 hover:bg-neutral-100 text-neutral-700 font-black text-[10px] tracking-wider transition-colors h-[38px] flex justify-center items-center" title="Basculer 2D/3D">
              {viewState.pitch > 0 ? '2D' : '3D'}
            </button>
          </div>
        </div>
      </Map>
    </section>
  );
}