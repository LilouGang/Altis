import { useState, useEffect } from 'react';
import { fetchUserSummits } from '../../principale/data/principale.service';
import { calculerTrophees, Trophee } from './trophees.selectors';
import { useAuth } from '../../shared/lib/AuthContext';

export function useTrophees() {
  const { user, loading: authLoading } = useAuth();
  const currentUserId = user?.uid || "non_connecte";

  const [tropheesGroupes, setTropheesGroupes] = useState<Record<string, Trophee[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (currentUserId === "non_connecte") {
        setTropheesGroupes(calculerTrophees([]));
        setLoading(false);
        return;
      }

      try {
        const sommets = await fetchUserSummits(currentUserId);
        setTropheesGroupes(calculerTrophees(sommets));
      } catch (error) {
        console.error("Erreur trophées:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (!authLoading) loadData();
  }, [currentUserId, authLoading]);

  return { tropheesGroupes, loading: loading || authLoading, isPreview: !user };
}