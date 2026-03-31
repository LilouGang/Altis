"use client";
import { useDashboard } from "./logic/dashboard.hook";
import Statistiques from "./ui/Statistiques";
import Journal from "./ui/Journal";

export default function DashboardPage() {
  const { ascensions, stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6 flex justify-center items-center text-sm font-bold text-neutral-400">
        Chargement de votre carnet...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Mon Espace</h1>
          <p className="text-neutral-500 mt-1 font-medium">Retrouvez toutes vos statistiques et ascensions.</p>
        </div>

        {/* L'UI est totalement "bête", elle ne fait qu'afficher ce qu'on lui donne */}
        <Statistiques stats={stats} />
        <Journal ascensions={ascensions} />

      </div>
    </div>
  );
}