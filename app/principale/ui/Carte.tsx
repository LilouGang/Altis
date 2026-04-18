"use client";
import Map, { Source, Layer, Popup as MapboxPopup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import { SommetCarte } from '../logic/principale.selectors';
import { ViewState } from '../logic/principale.actions';
import Boutons from './Boutons';
import PopupFiche from './Popup';
import { useCallback, useRef, useEffect, useMemo, useState } from 'react';

interface CarteProps {
  viewState: ViewState;
  setViewState: (viewState: any) => void;
  popupInfo: SommetCarte | null;
  setPopupInfo: (sommet: SommetCarte | null) => void;
  mesSommets: SommetCarte[];
  onAddSummit: (sommet: SommetCarte) => void;
}

export default function Carte({
  viewState, setViewState, popupInfo, setPopupInfo, mesSommets, onAddSummit
}: CarteProps) {
  
  const mapRef = useRef<any>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  // 1. 📍 POINT BLEU GPS : Récupère la position en temps réel
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        setUserCoords([pos.coords.longitude, pos.coords.latitude]);
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // 2. 🎮 BOUTONS SMOOTH : On force le flyTo/easeTo interne
  const handleZoomIn = () => mapRef.current?.flyTo({ zoom: viewState.zoom + 1, duration: 400 });
  const handleZoomOut = () => mapRef.current?.flyTo({ zoom: viewState.zoom - 1, duration: 400 });
  const handleResetNorth = () => mapRef.current?.easeTo({ bearing: 0, duration: 800 });
  const handleToggle3D = () => mapRef.current?.easeTo({ pitch: viewState.pitch === 0 ? 60 : 0, duration: 800 });

  // 3. 🖱️ CLIC SUR UN SOMMET : Pour ouvrir la fiche
  const handleMapClick = useCallback((event: any) => {
    const feature = event.features && event.features[0];
    
    if (!feature || feature.layer.id !== 'mes-sommets-layer') {
      setPopupInfo(null);
      return;
    }

    const props = feature.properties;
    setPopupInfo({
      id: props.id,
      nom: props.nom,
      altitude: Number(props.altitude),
      pays: props.pays,
      image_couverture_url: props.image_couverture_url,
      coordonnees: {
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1]
      }
    });

    mapRef.current?.flyTo({
      center: feature.geometry.coordinates,
      zoom: Math.max(viewState.zoom, 11),
      duration: 600
    });
  }, [setPopupInfo, viewState.zoom]);

  const onMouseEnter = useCallback((e: any) => { e.target.getCanvas().style.cursor = 'pointer'; }, []);
  const onMouseLeave = useCallback((e: any) => { e.target.getCanvas().style.cursor = ''; }, []);

  // 4. 🚁 ANIMATION DE RECHERCHE : Vole vers le sommet tapé dans la barre
  useEffect(() => {
    if (popupInfo && mapRef.current) {
      mapRef.current.flyTo({
        center: [popupInfo.coordonnees.longitude, popupInfo.coordonnees.latitude],
        zoom: Math.max(viewState.zoom, 10.5),
        duration: 2000,
        essential: true 
      });
    }
  }, [popupInfo]);

  // 5. 🔄 FORMATAGE GEOJSON
  const geojsonSommets = useMemo(() => ({
    type: 'FeatureCollection',
    features: (mesSommets || []).map(s => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [Number(s.coordonnees.longitude), Number(s.coordonnees.latitude)] },
      properties: { ...s }
    }))
  }), [mesSommets]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        interactiveLayerIds={['mes-sommets-layer']}
        onClick={handleMapClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        terrain={{ source: 'mapbox-dem', exaggeration: 1 }}
      >
        <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} />

        {/* 🔵 POINT BLEU GPS (Utilisateur) */}
        {userCoords && (
          <Source id="user-pos" type="geojson" data={{
            type: 'Feature',
            geometry: { type: 'Point', coordinates: userCoords },
            properties: {}
          }}>
            <Layer id="user-halo" type="circle" paint={{
              'circle-radius': 18,
              'circle-color': '#3b82f6',
              'circle-opacity': 0.2,
              'circle-stroke-width': 0
            }} />
            <Layer id="user-point" type="circle" paint={{
              'circle-radius': 7,
              'circle-color': '#3b82f6',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff'
            }} />
          </Source>
        )}

        {/* 🏔️ TES SOMMETS (Vert Émeraude) */}
        <Source id="mes-sommets-source" type="geojson" data={geojsonSommets as any}>
          <Layer id="mes-sommets-layer" type="circle" paint={{
            'circle-color': '#10b981', 
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }} />
        </Source>

        {popupInfo && (
          <MapboxPopup 
            longitude={popupInfo.coordonnees.longitude} 
            latitude={popupInfo.coordonnees.latitude} 
            anchor="bottom" offset={[-50, -15]} closeButton={false} 
            className="altis-popup z-20"
          >
            <PopupFiche 
               sommet={popupInfo} 
               dejaEnregistre={(mesSommets || []).some(s => s.id === popupInfo.id)}
               onAdd={() => onAddSummit(popupInfo)} 
            />
          </MapboxPopup>
        )}

        <Boutons 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut} 
          onResetNorth={handleResetNorth} 
          onToggle3D={handleToggle3D} 
          is3D={viewState.pitch > 0}
          bearing={viewState.bearing}
          pitch={viewState.pitch}
        />
      </Map>
    </div>
  );
}