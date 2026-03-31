"use client";
import Map, { Source, Marker, Popup as MapboxPopup } from 'react-map-gl/mapbox'; 
import 'mapbox-gl/dist/mapbox-gl.css';
import { SommetCarte } from '../logic/principale.selectors';
import { ViewState } from '../logic/principale.actions';
import Boutons from './Boutons';
import PopupFiche from './Popup';

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
  return (
    <section className="w-full h-full relative z-0">
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
              style={{ backgroundColor: sommet.markerColor }}
              className={`cursor-pointer relative z-10 h-5 w-5 rounded-full border-[2.5px] border-white shadow-md hover:scale-125 transition-transform`}
            />
          </Marker>
        ))}

        {/* POPUP MAPBOX */}
        {popupInfo && (
          <MapboxPopup 
            longitude={popupInfo.coordonnees.longitude} 
            latitude={popupInfo.coordonnees.latitude} 
            anchor="bottom" offset={[-50, -15]} closeButton={false} 
            onClose={() => setPopupInfo(null)} 
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