import { useState, useEffect } from 'react';
import { fetchUserSummits } from '../../principale/data/principale.service';
import { calculateDashboardStats } from './dashboard.selectors';
import { SommetCarte } from '../../principale/logic/principale.selectors';
import { useAuth } from '../../shared/lib/AuthContext';

export function useDashboard() {
  const { user } = useAuth();
  const currentUserId = user?.uid || "non_connecte";

  const [carnet, setCarnet] = useState<SommetCarte[]>([]);
  // 👇 On initialise directement avec les stats d'un carnet vide (donc des zéros !)
  const [stats, setStats] = useState<any>(calculateDashboardStats([])); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      // 🔒 S'il n'est pas connecté, on lui laisse les zéros et on arrête le chargement
      if (currentUserId === "non_connecte") {
        setCarnet([]);
        setStats(calculateDashboardStats([]));
        setLoading(false);
        return;
      }

      try {
        const sommets = await fetchUserSummits(currentUserId);
        setCarnet(sommets);
        setStats(calculateDashboardStats(sommets));
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [currentUserId]);

  return { carnet, stats, loading };
}