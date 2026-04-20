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
  const currentUserId = "user_test_123";
  const [viewState, setViewState] = useState<ViewState>({ 
    longitude: 2.2137, 
    latitude: 46.2276, 
    zoom: 4, 
    pitch: 0, 
    bearing: 0 
  });
  
  const [popupInfo, setPopupInfo] = useState<(SommetCarte & { dejaEnregistre?: boolean }) | null>(null);
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

  const handleSelectSearchResult = (sommetRecherche: SommetCarte) => {
    // 1. L'extracteur absolu : coupe tout ce qui est avant le dernier "_" et enlève les lettres
    const getPureId = (rawId: string | number) => {
      const stringId = String(rawId);
      // On prend le dernier morceau (ex: user_123_456 -> 456)
      const lastPart = stringId.split('_').pop() || stringId;
      // On enlève tout ce qui n'est pas un chiffre (au cas où il reste "peak" ou "osm")
      return lastPart.replace(/\D/g, ''); 
    };

    const pureRechercheId = getPureId(sommetRecherche.id);
    
    // 2. On compare avec la racine pure de nos sommets sauvegardés
    const estDejaDansLeCarnet = mesSommets.some(s => 
      getPureId(s.id) === pureRechercheId
    );
    
    setPopupInfo({
      ...sommetRecherche,
      id: pureRechercheId, // On force l'ID pur
      dejaEnregistre: estDejaDansLeCarnet
    });
  };

  const handleAddSummitToProfile = async (sommetAAjouter: SommetCarte) => {
    const cleanId = sommetAAjouter.id.replace(/^(peak_|osm_)/, '');
    const sommetPropre = { ...sommetAAjouter, id: cleanId };

    const success = await addSummitToUser(currentUserId, sommetPropre);
    
    if (success) {
      // Met à jour la liste globale des points sur la carte
      setMesSommets(prev => [...prev, sommetPropre]);
      
      // ✨ SOLUTION POINT 1 : Met à jour le popup actuellement ouvert
      setPopupInfo(prev => prev ? { ...prev, dejaEnregistre: true } : null);
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