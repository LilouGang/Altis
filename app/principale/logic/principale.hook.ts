import { useState, useEffect, useMemo } from 'react';
import { db } from '../../shared/lib/firebase';
import { UserStats, Ascension } from '../../shared/types/index';
import { calculateDashboardStats } from '../../dashboard/logic/dashboard.selectors';
import { addSummitToUser, fetchUserSummits } from '../data/principale.service';
import { zoomIn, zoomOut, resetNorth, toggle3D, ViewState } from './principale.actions';
import { SommetCarte } from './principale.selectors';
import { useAuth } from '../../shared/lib/AuthContext'; 

export function usePrincipale() {
  const { user } = useAuth(); 
  const currentUserId = user?.uid || "non_connecte";

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

  const [filtreAltitude, setFiltreAltitude] = useState<number>(0);
  const [filtrePays, setFiltrePays] = useState<string>("Tous");
  const [filtreCouleur, setFiltreCouleur] = useState<string>("Toutes");

  const optionsPays = useMemo(() => {
    const pays = new Set(mesSommets.map(s => s.pays).filter(Boolean));
    return ["Tous", ...Array.from(pays)] as string[];
  }, [mesSommets]);

  const optionsCouleurs = useMemo(() => {
    const couleurs = new Set(mesSommets.map(s => s.couleur || "#10b981"));
    return ["Toutes", ...Array.from(couleurs)] as string[];
  }, [mesSommets]);

  const sommetsFiltres = useMemo(() => {
    return mesSommets.filter(s => {
      if (filtreAltitude > 0 && (s.altitude || 0) < filtreAltitude) return false;
      if (filtrePays !== "Tous" && s.pays !== filtrePays) return false;
      if (filtreCouleur !== "Toutes" && (s.couleur || "#10b981") !== filtreCouleur) return false;
      return true;
    });
  }, [mesSommets, filtreAltitude, filtrePays, filtreCouleur]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewState(prev => ({
          ...prev,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          zoom: 10,
          transitionDuration: 2000
        }));
      }, (error) => {
        console.warn("Géolocalisation refusée ou ignorée :", error);
      });
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      if (currentUserId !== "non_connecte") {
        try {
          const sommets = await fetchUserSummits(currentUserId);
          setMesSommets(sommets);
        } catch (error) {
          console.error("Erreur de chargement:", error);
        }
      } else {
        setMesSommets([]);
      }
    }
    loadData();
  }, [currentUserId]);

  const handleZoomIn = () => setViewState(zoomIn);
  const handleZoomOut = () => setViewState(zoomOut);
  const handleResetNorth = () => setViewState(resetNorth);
  const handleToggle3D = () => setViewState(toggle3D);

  const handleSelectSearchResult = (sommetRecherche: SommetCarte) => {
    const getPureId = (rawId: string | number) => {
      const stringId = String(rawId);
      const lastPart = stringId.split('_').pop() || stringId;
      return lastPart.replace(/\D/g, ''); 
    };

    const pureRechercheId = getPureId(sommetRecherche.id);
    
    const estDejaDansLeCarnet = mesSommets.some(s => 
      getPureId(s.id) === pureRechercheId
    );
    
    setPopupInfo({
      ...sommetRecherche,
      id: pureRechercheId,
      dejaEnregistre: estDejaDansLeCarnet
    });
  };

  const handleAddSummitToProfile = async (sommetAAjouter: SommetCarte) => {
    if (currentUserId === "non_connecte") {
      alert("Vous devez être connecté pour ajouter un sommet à votre carnet.");
      return;
    }

    const cleanId = String(sommetAAjouter.id).replace(/^(peak_|osm_)/, '');
    const sommetPropre = { ...sommetAAjouter, id: cleanId };

    const success = await addSummitToUser(currentUserId, sommetPropre);
    
    if (success) {
      setMesSommets(prev => [...prev, sommetPropre]);
      setPopupInfo(prev => prev ? { ...prev, dejaEnregistre: true } : null);
    }
  };

  return {
    viewState, setViewState,
    popupInfo, setPopupInfo,
    mesSommets,
    sommetsFiltres,
    filtres: {
      altitude: filtreAltitude, setAltitude: setFiltreAltitude,
      pays: filtrePays, setPays: setFiltrePays,
      couleur: filtreCouleur, setCouleur: setFiltreCouleur,
      optionsPays, optionsCouleurs
    },
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D,
    userStats,
    handleSelectSearchResult,
    handleAddSummitToProfile
  };
}