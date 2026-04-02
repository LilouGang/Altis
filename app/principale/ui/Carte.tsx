"use client";
import Map, { Source, Marker, Popup as MapboxPopup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import { SommetCarte } from '../logic/principale.selectors';
import { ViewState } from '../logic/principale.actions';
import Boutons from './Boutons';
import PopupFiche from './Popup';
import { useCallback } from 'react';

interface CarteProps {
  viewState: ViewState;
  setViewState: (viewState: any) => void;
  sommets: SommetCarte[];
  popupInfo: SommetCarte | null;
  setPopupInfo: (sommet: SommetCarte | null) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetNorth: () => void;
  onToggle3D: () => void;
}

export default function Carte({
  viewState, setViewState, sommets, popupInfo, setPopupInfo,
  onZoomIn, onZoomOut, onResetNorth, onToggle3D
}: CarteProps) {

  // NOUVEAU : La fonction qui intercepte les clics sur la carte
  const handleMapClick = useCallback((event: any) => {
    // 1. On vérifie si l'utilisateur a cliqué sur un élément des couches interactives
    const feature = event.features && event.features[0];

    if (feature) {
      // 2. Mapbox nous donne les infos brutes de ce qu'on a cliqué !
      const nom = feature.properties.name || feature.properties.name_fr;
      const altitude = feature.properties.ele || feature.properties.elevation;
      const lngLat = event.lngLat;

      // 3. On crée un "Faux" sommet à la volée pour nourrir ton PopupFiche
      const sommetCliqueNatifs: SommetCarte = {
        // On génère un ID temporaire basé sur les coordonnées
        id: `native_${lngLat.lat.toFixed(4)}_${lngLat.lng.toFixed(4)}`, 
        nom: nom || "Sommet inconnu",
        altitude: altitude ? Number(altitude) : 0,
        coordonnees: { latitude: lngLat.lat, longitude: lngLat.lng },
        pays: [], // À déduire plus tard ou à demander à l'utilisateur
        massif_principal: "Inconnu", 
        markerColor: "#3b82f6" // Bleu par défaut pour l'interface
      };

      // 4. On ouvre le popup !
      setPopupInfo(sommetCliqueNatifs);
    } else {
      // Si on clique dans le vide, on ferme le popup
      setPopupInfo(null);
    }
  }, [setPopupInfo]);

  // NOUVEAU : Change le curseur en "pointer" 👆 si on survole une montagne
  const onMouseEnter = useCallback(() => (document.body.style.cursor = 'pointer'), []);
  const onMouseLeave = useCallback(() => (document.body.style.cursor = 'default'), []);

  return (
    <section className="w-full h-full relative z-0">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/lilougang/cmngafjby006t01s74kuldauy"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
        interactiveLayerIds={['poi-label', 'natural-point-label']} // Les couches Mapbox cliquables
        onClick={handleMapClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
              style={{ backgroundColor: sommet.markerColor }}
              className="cursor-pointer relative z-10 h-5 w-5 rounded-full border-[2.5px] border-white shadow-md hover:scale-125 transition-transform"
            />
          </Marker>
        ))}

        {/* POPUP MAPBOX */}
        {popupInfo && (
          <MapboxPopup 
            longitude={popupInfo.coordonnees.longitude} 
            latitude={popupInfo.coordonnees.latitude} 
            anchor="bottom" offset={[-50, -15]} closeButton={false} 
            className="altis-popup z-20"
          >
            <PopupFiche sommet={popupInfo} />
          </MapboxPopup>
        )}

        {/* BOUTONS DE CONTRÔLES */}
        <Boutons 
          onZoomIn={onZoomIn} onZoomOut={onZoomOut} 
          onResetNorth={onResetNorth} onToggle3D={onToggle3D} 
          bearing={viewState.bearing} pitch={viewState.pitch} 
        />
      </Map>
    </section>
  );
}