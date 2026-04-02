"use client";
import Map, { Source, Layer, Popup as MapboxPopup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import { SommetCarte } from '../logic/principale.selectors';
import { ViewState } from '../logic/principale.actions';
import Boutons from './Boutons';
import PopupFiche from './Popup';
import { useCallback, useRef } from 'react';

interface CarteProps {
  viewState: ViewState;
  setViewState: (viewState: any) => void;
  popupInfo: SommetCarte | null;
  setPopupInfo: (sommet: SommetCarte | null) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetNorth?: () => void;
  onToggle3D?: () => void;
}

export default function Carte({
  viewState, setViewState, popupInfo, setPopupInfo
}: CarteProps) {
  
  const mapRef = useRef<any>(null);

  const handleZoomIn = () => mapRef.current?.flyTo({ zoom: viewState.zoom + 1, duration: 500 });
  const handleZoomOut = () => mapRef.current?.flyTo({ zoom: viewState.zoom - 1, duration: 500 });
  const handleResetNorth = () => mapRef.current?.easeTo({ bearing: 0, pitch: 0, duration: 700 });
  const handleToggle3D = () => mapRef.current?.easeTo({ pitch: viewState.pitch === 0 ? 60 : 0, duration: 800 });

  const handleMapClick = useCallback((event: any) => {
    const feature = event.features && event.features[0];

    if (!feature || feature.layer.id !== 'sommets-layer') {
      setPopupInfo(null);
      return;
    }

    const props = feature.properties;
      
    const sommetClique: SommetCarte = {
      id: props.id,
      nom: props.nom_fr || props.nom_officiel || 'Sommet inconnu',
      altitude: props.altitude ? Number(props.altitude) : 0,
      prominence: props.prominence ? Number(props.prominence) : undefined,
      massif_principal: props.massif,
      pays: props.pays,
      image_couverture_url: props.image_url,
      coordonnees: {
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1]
      }
    };

    setPopupInfo(sommetClique);

    mapRef.current?.flyTo({
      center: feature.geometry.coordinates,
      zoom: Math.max(viewState.zoom, 11),
      duration: 600
    });

  }, [setPopupInfo, viewState.zoom]);

  const onMouseEnter = useCallback((e: any) => { e.target.getCanvas().style.cursor = 'pointer'; }, []);
  const onMouseLeave = useCallback((e: any) => { e.target.getCanvas().style.cursor = ''; }, []);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      interactiveLayerIds={['sommets-layer']}
      onClick={handleMapClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />

      {/* ON CHANGE LE TYPE DE SOURCE ET L'URL */}
      <Source 
        id="sommets-source" 
        type="vector" 
        url="mapbox://lilougang.a3my8flj" // <-- Remplace par ton Tileset ID
      >
        <Layer 
          id="sommets-layer"
          type="circle"
          source-layer="sommets" // <-- OBLIGATOIRE en "vector", met le nom vu dans Studio (ex: "sommets")
          paint={{
            'circle-color': '#3b82f6',
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              2, ['case', ['>=', ['to-number', ['get', 'altitude'], 0], 4000], 3, 0],
              5, ['case', ['>=', ['to-number', ['get', 'altitude'], 0], 2500], 4, 0],
              8, ['case', ['>=', ['to-number', ['get', 'altitude'], 0], 1000], 5, 0],
              11, ['case', ['>=', ['to-number', ['get', 'altitude'], 0], 500], 5, 2],
              13, 6 
            ],
            'circle-stroke-width': ['step', ['zoom'], 0, 10, 1.5], 
            'circle-stroke-color': '#ffffff'
          }}
        />
      </Source>

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
  );
}