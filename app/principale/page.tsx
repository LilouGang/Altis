"use client";
import Carte from "./ui/Carte";
import QuickStats from "./ui/MiniStats";
import FloatingSearch from "./ui/Recherche";
import { usePrincipale } from "./logic/principale.hook";

export default function PrincipalePage() {
  const { 
    viewState, setViewState, 
    popupInfo, setPopupInfo,
    userStats,
    handleSelectSearchResult,
    mesSommets,
    handleAddSummitToProfile
  } = usePrincipale();

  return (
    <div className="w-full h-full relative overflow-hidden bg-neutral-100">
      
      <Carte 
        viewState={viewState}
        setViewState={setViewState}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
        mesSommets={mesSommets}
        onAddSummit={handleAddSummitToProfile}
      />
      
      <div className="pointer-events-none absolute inset-0 z-40 *:pointer-events-auto">
        
        {/* ✅ On affiche les statistiques en haut à droite */}
       <QuickStats sommets={mesSommets} />
        
        {/* ✅ La barre de recherche en bas */}
        <FloatingSearch onSelectSommet={handleSelectSearchResult} />

      </div>

    </div>
  );
}