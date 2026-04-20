import { useState, useEffect } from "react";
import { SommetCarte } from "../../principale/logic/principale.selectors";
import { fetchUserCarnet } from "../data/dashboard.service";
import { sortCarnet, calculateDashboardStats } from "./dashboard.selectors";

export function useDashboard() {
  const [carnet, setCarnet] = useState<SommetCarte[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentUserId = "user_test_123";

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUserCarnet(currentUserId);
        setCarnet(sortCarnet(data));
      } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUserId]);

  const stats = calculateDashboardStats(carnet);

  return { carnet, stats, loading };
}