import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firebase imports
import { db } from '../../shared/lib/firebase';
import { UserStats, Ascension } from '../../shared/types/index';
import { calculateDashboardStats } from '../../dashboard/logic/dashboard.selectors'; // Ton sélecteur !
import { fetchUserMarkers } from '../data/principale.service';
import { zoomIn, zoomOut, resetNorth, toggle3D, ViewState } from './principale.actions';
import { SommetCarte } from './principale.selectors';

export function usePrincipale() {
  const [viewState, setViewState] = useState<ViewState>({ longitude: 6.8694, latitude: 45.4, zoom: 8, pitch: 45, bearing: 0 });
  const [popupInfo, setPopupInfo] = useState<SommetCarte | null>(null);
  const [markerColors, setMarkerColors] = useState<Record<string, string>>({});
  
  // NOUVEAU: Le State pour les stats
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUserId = "user_test_123"; // TODO: À remplacer par le vrai ID via ton AuthContext
        
        // 1. Charger les couleurs personnalisées (existant)
        const colorsData = await fetchUserMarkers(currentUserId);
        setMarkerColors(colorsData);

        // 2. Charger les ascensions pour calculer les stats (NOUVEAU)
        const qAscensions = query(collection(db, "ascensions"), where("userId", "==", currentUserId));
        const snap = await getDocs(qAscensions);
        const ascensions = snap.docs.map(doc => doc.data() as Ascension);
        
        // On utilise ta logique du dashboard !
        setUserStats(calculateDashboardStats(ascensions));

      } catch (error) {
        console.error("Erreur de chargement des données:", error);
      }
    }
    loadData();
  }, []);

  const handleZoomIn = () => setViewState(zoomIn);
  const handleZoomOut = () => setViewState(zoomOut);
  const handleResetNorth = () => setViewState(resetNorth);
  const handleToggle3D = () => setViewState(toggle3D);

  return {
    viewState, setViewState,
    popupInfo, setPopupInfo,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D,
    userStats // <-- On l'envoie à la page !
  };
}