"use client";
import Carte from "./ui/Carte";
import MapFilters from "./ui/Filtre";
import QuickStats from "./ui/MiniStats";
import FloatingSearch from "./ui/Recherche";
import { usePrincipale } from "./logic/principale.hook";

export default function PrincipalePage() {
  const { 
    viewState, setViewState, 
    popupInfo, setPopupInfo,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D,
    userStats // <-- Récupéré depuis le hook
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
        
        {/* On passe les stats calculées ici ! */}
        <QuickStats stats={userStats} />
        
        <FloatingSearch />
      </div>

    </div>
  );
}