"use client";
// 1. On importe le composant (et non l'interface)
import Carte from "./principale/ui/Carte";
import MapFilters from "./principale/ui/Filtre";
import QuickStats from "./principale/ui/MiniStats";
import FloatingSearch from "./principale/ui/Recherche";

// 2. On importe notre hook logique qui contient toute l'intelligence !
import { usePrincipale } from "./principale/logic/principale.hook";

export default function Home() {
  // 3. On récupère toutes nos données et actions depuis le hook
  const { 
    viewState, setViewState, 
    sommetsFormates, 
    popupInfo, setPopupInfo,
    handleZoomIn, handleZoomOut, handleResetNorth, handleToggle3D 
  } = usePrincipale();

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-100">
      
      {/* L'arrière-plan interactif (La Carte) avec TOUTES ses props */}
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
      
      {/* La couche UI superposée (Overlays) */}
      {/* L'ajout de pointer-events-none ici permet de pouvoir cliquer sur la carte en dessous des composants */}
      <div className="pointer-events-none absolute inset-0 z-40 *:pointer-events-auto">
        <MapFilters />
        <QuickStats />
        <FloatingSearch />
      </div>

    </div>
  );
}