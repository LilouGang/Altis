import { useState, useEffect } from "react";
import { Ascension } from "../../shared/types/index";
import { fetchUserAscensions, fetchUserColors } from "../data/dashboard.service";
import { formatAndSortAscensions, calculateDashboardStats } from "./dashboard.selectors";

export function useDashboard() {
  const [ascensions, setAscensions] = useState<Ascension[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dans un vrai cas, tu récupéreras ça via ton AuthContext
  const currentUserId = "user_test_123";

  useEffect(() => {
    async function loadData() {
      try {
        const [ascensionsData, colorsData] = await Promise.all([
          fetchUserAscensions(currentUserId),
          fetchUserColors(currentUserId)
        ]);

        // On utilise le sélecteur pour formater et trier directement
        const sortedData = formatAndSortAscensions(ascensionsData, colorsData);
        setAscensions(sortedData);

      } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [currentUserId]);

  // On utilise le sélecteur pour générer les stats à la volée
  const stats = calculateDashboardStats(ascensions);

  return {
    ascensions,
    stats,
    loading
  };
}