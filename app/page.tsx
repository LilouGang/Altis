"use client";
import Carte from "./principale/ui/Carte";
import QuickStats from "./principale/ui/MiniStats";
import FloatingSearch from "./principale/ui/Recherche";
import { usePrincipale } from "./principale/logic/principale.hook";

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
        <QuickStats sommets={mesSommets} />
        <FloatingSearch onSelectSommet={handleSelectSearchResult} />
      </div>
    </div>
  );
}