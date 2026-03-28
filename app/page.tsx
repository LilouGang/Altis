// src/app/page.tsx
import MapboxViewer from "@/features/map/MapboxViewer";

export default function Home() {
  return (
    // La div prend toute la place, le header flottant sera par-dessus grâce au layout
    <div className="w-full h-full relative">
      <MapboxViewer />
    </div>
  );
}