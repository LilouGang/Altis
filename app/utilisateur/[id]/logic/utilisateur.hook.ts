import { useState, useEffect } from "react";
import { fetchUtilisateurSummits } from "../data/utilisateur.service";
import { SommetCarte } from "../../../principale/logic/principale.selectors";
import { calculerTrophees } from "../../../trophees/logic/trophees.selectors";
import { calculateDashboardStats } from "../../../dashboard/logic/dashboard.selectors";

export function useUtilisateur(userId: string) {
  const [sommets, setSommets] = useState<SommetCarte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUtilisateurSummits(userId);
        setSommets(data);
      } catch (error) {
        console.error("Erreur chargement profil public:", error);
      } finally {
        setLoading(false);
      }
    }
    if (userId) loadData();
  }, [userId]);

  const stats = calculateDashboardStats(sommets);
  const tropheesGroupes = calculerTrophees(sommets);
  
  // Calcul de l'altitude max manuellement ici
  const altitudeMax = sommets.length > 0 
    ? Math.max(...sommets.map(s => s.altitude || 0)) 
    : 0;

  const pseudo = sommets.find(s => (s as any).userPseudo)?.userPseudo || "Utilisateur";

  return { 
    sommets, 
    stats: { ...stats, altitudeMax }, 
    tropheesGroupes, 
    loading, 
    pseudo 
  };
}