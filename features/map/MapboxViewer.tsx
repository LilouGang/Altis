"use client";
import { useState, useEffect } from 'react';
import Map, { Source, Marker, Popup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { Plus, Minus, Compass, Mountain, Flag, TrendingUp, MountainSnow, MousePointerClick } from 'lucide-react'; // Ajout des nouveaux icônes

// IMPORTS FIREBASE
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Sommet } from '../summits/summitTypes';

export default function MapboxViewer() {
  const [viewState, setViewState] = useState({ longitude: 6.8694, latitude: 45.4, zoom: 8, pitch: 45, bearing: 0 });
  const [popupInfo, setPopupInfo] = useState<Sommet | null>(null); // Type précisé
  
  const [sommets, setSommets] = useState<Sommet[]>([]);

  useEffect(() => {
    async function fetchSommets() {
      try {
        const querySnapshot = await getDocs(collection(db, "sommets"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Sommet[];
        setSommets(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des sommets:", error);
      }
    }
    fetchSommets();
  }, []);

  const handleZoomIn = () => setViewState(prev => ({ ...prev, zoom: prev.zoom + 1 }));
  const handleZoomOut = () => setViewState(prev => ({ ...prev, zoom: prev.zoom - 1 }));
  const handleResetNorth = () => setViewState(prev => ({ ...prev, bearing: 0 }));
  const handleToggle3D = () => setViewState(prev => ({ ...prev, pitch: prev.pitch === 0 ? 60 : 0 }));

  return (
    <section className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

        {/* MARQUEURS */}
        {sommets.map((sommet) => (
          <Marker key={sommet.id} longitude={sommet.coordonnees.longitude} latitude={sommet.coordonnees.latitude} anchor="bottom">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setPopupInfo(sommet);
              }} 
              className={`cursor-pointer relative z-10 h-5 w-5 rounded-full border-2 shadow-lg hover:scale-125 transition-transform bg-white border-neutral-300`}
            />
          </Marker>
        ))}

        {/* --- LE NOUVEAU POPUP "FICHE TECHNIQUE" --- */}
        {popupInfo && (
          <Popup 
            longitude={popupInfo.coordonnees.longitude} 
            latitude={popupInfo.coordonnees.latitude} 
            anchor="bottom" 
            offset={[-50, -15]} 
            
            closeButton={false} 
            onClose={() => setPopupInfo(null)} 
            className="altis-popup z-20"
          >
            {/* Le cadre principal cliquable */}
            <Link 
              href={`/sommets/${popupInfo.id}`} 
              // On le met en 'relative' pour positionner l'icône de souris en absolu
              className="block w-[340px] p-2.5 bg-white rounded-2xl shadow-xl border border-neutral-200 hover:border-emerald-500 transition-colors group cursor-pointer relative"
            >
              
              {/* NOUVEAU : Petit icône de clic discret en haut à droite */}
              <div className="absolute top-2.5 right-2.5 text-neutral-400 group-hover:text-emerald-500 transition-colors">
                <MousePointerClick size={14} />
              </div>

              <div className="flex gap-3 items-center">
                
                {/* Petite photo à gauche (Image BD) */}
                <div 
                  className="w-14 h-14 rounded-xl bg-neutral-100 flex-shrink-0" 
                  style={{ backgroundImage: `url(${popupInfo.image_couverture_url || 'https://images.unsplash.com/photo-1549880338-65dd4bc8a202?q=80&w=200'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                
                {/* Contenu à droite */}
                <div className="flex flex-col flex-grow overflow-hidden pr-3">
                  
                  {/* Titre (Légèrement plus petit pour l'icône) */}
                  <h3 className="font-bold text-neutral-900 text-sm leading-tight mb-1.5 truncate group-hover:text-emerald-600 transition-colors">
                    {popupInfo.nom}
                  </h3>
                  
                  {/* Les 4 valeurs en ligne, avec ABRÉVIATIONS */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col">
                      {/* NOUVEAU LABEL : Alti. */}
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Alti.</span>
                      <span className="text-xs font-semibold text-neutral-800">{popupInfo.altitude}m</span>
                    </div>
                    
                    <div className="flex flex-col">
                      {/* NOUVEAU LABEL : Proé. */}
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Proé.</span>
                      <span className="text-xs font-semibold text-neutral-800">{popupInfo.prominence ? `${popupInfo.prominence}m` : '-'}</span>
                    </div>
                    
                    <div className="flex flex-col overflow-hidden">
                      {/* NOUVEAU LABEL : Massif */}
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Massif</span>
                      <span className="text-xs font-semibold text-neutral-800 truncate w-full" title={popupInfo.massif_principal}>{popupInfo.massif_principal}</span>
                    </div>
                    
                    <div className="flex flex-col overflow-hidden">
                      {/* NOUVEAU LABEL : Pays */}
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Pays</span>
                      {/* On n'affiche que le premier pays pour la compacité */}
                      <span className="text-xs font-semibold text-neutral-800 truncate w-full" title={popupInfo.pays.join(', ')}>{popupInfo.pays[0]}</span>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          </Popup>
        )}

        {/* BOUTONS DE CONTRÔLE DE CAMÉRA */}
        <div className="absolute bottom-60 right-4 flex flex-col gap-3 z-30">
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
            <button onClick={handleZoomIn} className="p-2.5 hover:bg-neutral-100 border-b border-neutral-200 text-neutral-600 transition-colors">
              <Plus size={18} strokeWidth={2.5} />
            </button>
            <button onClick={handleZoomOut} className="p-2.5 hover:bg-neutral-100 text-neutral-600 transition-colors">
              <Minus size={18} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
            <button onClick={handleResetNorth} className="p-2.5 hover:bg-neutral-100 border-b border-neutral-200 text-neutral-600 transition-colors flex justify-center items-center" title="Remettre au Nord">
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