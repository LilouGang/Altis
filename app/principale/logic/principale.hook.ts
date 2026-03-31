import { useState, useEffect } from 'react';
import { Sommet } from '../../shared/types/index';
import { fetchSommets, fetchUserMarkers } from '../data/principale.service';
import { mergeSommetsAndColors, SommetCarte } from './principale.selectors';
import { zoomIn, zoomOut, resetNorth, toggle3D, ViewState } from './principale.actions';

export function usePrincipale() {
  const [viewState, setViewState] = useState<ViewState>({ longitude: 6.8694, latitude: 45.4, zoom: 8, pitch: 45, bearing: 0 });
  const [popupInfo, setPopupInfo] = useState<SommetCarte | null>(null);
  
  const [sommets, setSommets] = useState<Sommet[]>([]);
  const [markerColors, setMarkerColors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const currentUserId = "user_test_123"; // À remplacer par le vrai user ID plus tard
        const [sommetsData, colorsData] = await Promise.all([
          fetchSommets(),
          fetchUserMarkers(currentUserId)
        ]);
        
        setSommets(sommetsData);
        setMarkerColors(colorsData);
      } catch (error) {
        console.error("Erreur de chargement de la carte:", error);
      }
    }
    loadData();
  }, []);

  // Application du sélecteur pour obtenir les données prêtes pour l'UI
  const sommetsFormates = mergeSommetsAndColors(sommets, markerColors);

  // Wrappers pour les actions de la caméra
  const handleZoomIn = () => setViewState(zoomIn);
  const handleZoomOut = () => setViewState(zoomOut);
  const handleResetNorth = () => setViewState(resetNorth);
  const handleToggle3D = () => setViewState(toggle3D);

  return {
    viewState, setViewState,
    sommetsFormates,
    popupInfo, setPopupInfo,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D
  };
}