"use client";
import { useState, useEffect, useMemo } from "react";
import DashboardStats from "@/features/user/DashboardStats";
import RecentAscensions from "@/features/user/RecentAscensions";
import { UserStats, Ascension } from "@/features/user/userTypes";
import { getUserAscensions } from "@/features/user/userService";

export default function DashboardPage() {
  const [ascensions, setAscensions] = useState<Ascension[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ID Temporaire en attendant le vrai système de connexion
  const currentUserId = "user_test_123";

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await getUserAscensions(currentUserId);
        
        // On trie les ascensions de la plus récente à la plus ancienne
        const sortedData = data.sort((a, b) => new Date(b.dateAscension).getTime() - new Date(a.dateAscension).getTime());
        setAscensions(sortedData);
      } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [currentUserId]);

  // Calcul dynamique des statistiques en fonction des vraies ascensions
  const stats = useMemo<UserStats>(() => {
    if (ascensions.length === 0) return { totalSummits: 0, totalAscent: 0, maxAltitude: 0 };
    
    return {
      totalSummits: ascensions.length,
      totalAscent: ascensions.reduce((acc, curr) => acc + curr.altitude, 0),
      // Math.max permet de trouver la plus haute altitude dans le tableau
      maxAltitude: Math.max(...ascensions.map(a => a.altitude))
    };
  }, [ascensions]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6 flex justify-center items-center font-bold text-neutral-400">Chargement de votre carnet...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Mon Espace</h1>
          <p className="text-neutral-500 mt-1 font-medium">Retrouvez toutes vos statistiques et ascensions.</p>
        </div>

        {/* On passe les VRAIES données calculées */}
        <DashboardStats stats={stats} />
        <RecentAscensions ascensions={ascensions} />

      </div>
    </div>
  );
}