"use client";
import { useDashboard } from "./logic/dashboard.hook";
import Statistiques from "./ui/Statistiques";
import Journal from "./ui/Journal";

export default function DashboardPage() {
  const { carnet, stats, loading } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6 flex justify-center items-center text-sm font-medium text-neutral-400">
        Lecture de votre carnet...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 px-2">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Carnet de bord</h1>
          <p className="text-sm text-neutral-500 mt-1 font-medium">Résumé de vos expéditions et statistiques globales.</p>
        </div>

        <Statistiques stats={stats} />
        <Journal carnet={carnet} />

      </div>
    </div>
  );
}