"use client";
import { usePrincipale } from "./logic/principale.hook";
import Carte from "./ui/Carte";
import Filtre from "./ui/Filtre";
import MiniStats from "./ui/MiniStats";
import Recherche from "./ui/Recherche";

export default function PrincipalePage() {
  const { 
    viewState, setViewState, 
    sommetsFormates, 
    popupInfo, setPopupInfo,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D 
  } = usePrincipale();

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-100">
      
      {/* 1. L'arrière-plan interactif (La Carte) */}
      <Carte 
        viewState={viewState}
        setViewState={setViewState}
        sommets={sommetsFormates}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetNorth={handleResetNorth}
        onToggle3D={handleToggle3D}
      />
      
      {/* 2. La couche UI superposée (Overlays) */}
      <div className="pointer-events-none absolute inset-0 z-40 *:pointer-events-auto">
        <Filtre />
        <MiniStats />
        <Recherche />
      </div>

    </div>
  );
}