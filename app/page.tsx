import MapboxViewer from "@/features/map/MapboxViewer";
import MapFilters from "@/features/map/MapFilters";
import QuickStats from "@/features/user/QuickStats";
import FloatingSearch from "@/features/search/FloatingSearch";

export default function Home() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* L'arrière-plan interactif */}
      <MapboxViewer />
      
      {/* La couche UI (User Interface) superposée */}
      <MapFilters />
      <QuickStats />
      <FloatingSearch />
    </div>
  );
}