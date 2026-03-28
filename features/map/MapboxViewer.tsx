// src/features/map/MapboxViewer.tsx
"use client";
import { useState } from 'react';
import Map, { Source, Marker, Popup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { sommetsDb } from '@/lib/data'; 

export default function MapboxViewer() {
  const [viewState, setViewState] = useState({ longitude: 6.8694, latitude: 45.4, zoom: 8, pitch: 45 });
  const [popupInfo, setPopupInfo] = useState<any>(null);

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

        {/* POPUP ULTRA-DESIGN (Ton code, inchangé car déjà top !) */}
        {popupInfo && (
          <Popup longitude={popupInfo.lng} latitude={popupInfo.lat} anchor="bottom" offset={24} closeButton={false} onClose={() => setPopupInfo(null)} className="z-20">
            <div className="w-64 flex flex-col p-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/40">
              <div className="h-28 w-full bg-neutral-200 rounded-xl mb-3 relative overflow-hidden" style={{ backgroundImage: `url(${popupInfo.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700 block leading-none">{popupInfo.massif}</span>
                </div>
              </div>
              
              <div className="px-2 pb-2">
                <h3 className="font-bold text-neutral-900 text-lg leading-tight truncate">{popupInfo.nom}</h3>
                <p className="text-sm font-medium text-neutral-500 mb-4">{popupInfo.altitude}m • Cotation {popupInfo.difficulte}</p>
                
                <Link href={`/sommets/${popupInfo.id}`} className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold rounded-xl transition-colors flex justify-center items-center">
                  Voir le sommet
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* CURSEUR D'ANGLE 3D - Mis à jour avec Glassmorphism */}
      <div className="absolute bottom-8 right-8 bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 w-48 z-10">
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-3 flex items-center justify-between">
          Caméra <span className="text-emerald-700 bg-white/50 px-2 py-0.5 rounded-md">{Math.round(viewState.pitch)}°</span>
        </label>
        <input type="range" min="0" max="85" value={viewState.pitch} onChange={(e) => setViewState({ ...viewState, pitch: Number(e.target.value) })} className="w-full accent-emerald-600" />
      </div>
    </section>
  );
}