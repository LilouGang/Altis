// app/principale/logic/principale.hook.ts
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '../../shared/lib/firebase';
import { UserStats, Ascension } from '../../shared/types/index';
import { calculateDashboardStats } from '../../dashboard/logic/dashboard.selectors';
import { addSummitToUser, fetchUserSummits } from '../data/principale.service';
import { zoomIn, zoomOut, resetNorth, toggle3D, ViewState } from './principale.actions';
import { SommetCarte } from './principale.selectors';

export function usePrincipale() {
  // 1. Position initiale : Zoom 6.5 au centre de la France
  const [viewState, setViewState] = useState<ViewState>({ 
    longitude: 2.2137, 
    latitude: 46.2276, 
    zoom: 4, 
    pitch: 0, 
    bearing: 0 
  });
  
  const [popupInfo, setPopupInfo] = useState<SommetCarte | null>(null);
  const [mesSommets, setMesSommets] = useState<SommetCarte[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // 2. Centrage automatique sur l'utilisateur à l'ouverture
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewState(prev => ({
          ...prev,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: 10,
          transitionDuration: 2000 // Petit effet de glissement au démarrage
        }));
      });
    }

    async function loadData() {
      try {
        const currentUserId = "user_test_123"; 
        
        // 1. Charger tes sommets personnels
        const sommets = await fetchUserSummits(currentUserId);
        setMesSommets(sommets);

        // 2. Charger les stats... (existant)
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    }
    loadData();
  }, []);

  const handleZoomIn = () => setViewState(zoomIn);
  const handleZoomOut = () => setViewState(zoomOut);
  const handleResetNorth = () => setViewState(resetNorth);
  const handleToggle3D = () => setViewState(toggle3D);

  const handleSelectSearchResult = (sommet: SommetCarte) => {
    setPopupInfo(sommet);
  };

  const handleAddSummitToProfile = async (sommetAAjouter: SommetCarte) => {
    const currentUserId = "user_test_123"; // TODO: Ton vrai ID
    
    // 1. Sauvegarde dans Firebase
    const success = await addSummitToUser(currentUserId, sommetAAjouter);
    
    if (success) {
      // 2. On l'ajoute à l'état local pour que le point bleu apparaisse immédiatement !
      setMesSommets(prev => [...prev, sommetAAjouter]);
      
      // 3. Optionnel : Fermer la popup ou afficher une petite notification
      console.log(`${sommetAAjouter.nom} ajouté avec succès !`);
    }
  };

  return {
    viewState, setViewState,
    popupInfo, setPopupInfo,
    mesSommets,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D,
    userStats,
    handleSelectSearchResult,
    handleAddSummitToProfile // 👈 N'oublie pas de l'exporter !
  };
}