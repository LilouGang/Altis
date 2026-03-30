"use client";
import { useState, useEffect, useMemo } from "react";
import DashboardStats from "@/features/user/DashboardStats";
import RecentAscensions from "@/features/user/RecentAscensions";
import { UserStats, Ascension } from "@/features/user/userTypes";
import { getUserAscensions } from "@/features/user/userService";

// NOUVEAUX IMPORTS : Pour aller lire la table des drapeaux
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";

export default function DashboardPage() {
  const [ascensions, setAscensions] = useState<Ascension[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUserId = "user_test_123";

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. On interroge les ascensions ET les couleurs en parallèle
        const qColors = query(collection(db, "user_markers"), where("userId", "==", currentUserId));
        
        const [ascensionsData, colorsSnap] = await Promise.all([
          getUserAscensions(currentUserId),
          getDocs(qColors)
        ]);

        // 2. On crée le dictionnaire des couleurs { "id_sommet": "#couleur" }
        const colorsMap: Record<string, string> = {};
        colorsSnap.docs.forEach(doc => {
          colorsMap[doc.data().summitId] = doc.data().color;
        });

        // 3. On injecte la couleur du drapeau dans les données de l'ascension
        const ascensionsWithColors = ascensionsData.map(asc => ({
          ...asc,
          customColor: colorsMap[asc.summitId] || "#10b981" // Vert par défaut au cas où
        }));
        
        // 4. On trie et on sauvegarde dans l'état
        const sortedData = ascensionsWithColors.sort((a, b) => new Date(b.dateAscension).getTime() - new Date(a.dateAscension).getTime());
        setAscensions(sortedData);

      } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [currentUserId]);

  const stats = useMemo<UserStats>(() => {
    if (ascensions.length === 0) return { totalSummits: 0, totalAscent: 0, maxAltitude: 0 };
    
    return {
      totalSummits: ascensions.length,
      totalAscent: ascensions.reduce((acc, curr) => acc + curr.altitude, 0),
      maxAltitude: Math.max(...ascensions.map(a => a.altitude))
    };
  }, [ascensions]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6 flex justify-center items-center text-sm font-bold text-neutral-400">Chargement de votre carnet...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Mon Espace</h1>
          <p className="text-neutral-500 mt-1 font-medium">Retrouvez toutes vos statistiques et ascensions.</p>
        </div>

        <DashboardStats stats={stats} />
        <RecentAscensions ascensions={ascensions} />

      </div>
    </div>
  );
}