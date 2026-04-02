"use client";

import Carte from "./principale/ui/Carte";
import MapFilters from "./principale/ui/Filtre";
import QuickStats from "./principale/ui/MiniStats";
import FloatingSearch from "./principale/ui/Recherche";
import { usePrincipale } from "./principale/logic/principale.hook";

export default function Home() {
  const { 
    viewState, setViewState, 
    popupInfo, setPopupInfo,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D,
    userStats // <-- 1. ON RÉCUPÈRE LES STATS ICI
  } = usePrincipale();

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-100">
      
      <Carte 
        viewState={viewState}
        setViewState={setViewState}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetNorth={handleResetNorth}
        onToggle3D={handleToggle3D}
      />
      
      <div className="pointer-events-none absolute inset-0 z-40 *:pointer-events-auto">
        <MapFilters />
        
        {/* 2. ON PASSE LES STATS AU COMPOSANT ICI */}
        <QuickStats stats={userStats} />
        
        <FloatingSearch />
      </div>

    </div>
  );
}