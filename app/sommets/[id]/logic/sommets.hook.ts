import { useState, useEffect } from "react";
import { Sommet, Ascension } from "../../../shared/types";
import { getSummitById, getSummitAscensions, getMarkerColor } from "../data/sommets.service";
import { calculateSummitStats, sortAscensions } from "./sommets.selectors";
import { submitAscensionData, updateMarkerColor } from "./sommets.actions";
import { incrementSummitView } from '../../../principale/data/principale.service';

export function useSommets(summitId: string) {
  const [sommet, setSommet] = useState<Sommet | null>(null);
  const [ascensions, setAscensions] = useState<Ascension[]>([]);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [actionState, setActionState] = useState<'prompt' | 'form' | 'done'>('prompt');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myAscensionId, setMyAscensionId] = useState<string | null>(null);
  
  const [markerColor, setMarkerColor] = useState("#3b82f6");
  const [dateAscension, setDateAscension] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const currentUserId = "user_test_123"; // Plus tard via AuthContext

  useEffect(() => {
    async function fetchData() {
      if (!summitId) return;

      // NOUVEAU : On lance l'incrémentation de la vue en tâche de fond (Fire and Forget)
      // Le .catch permet juste d'éviter une erreur silencieuse si l'utilisateur perd sa connexion
      incrementSummitView(summitId).catch(console.error);

      try {
        // Le reste de ton code ne change pas et charge les données vitales à l'affichage
        const [summitData, ascensionsData, colorData] = await Promise.all([
          getSummitById(summitId),
          getSummitAscensions(summitId),
          getMarkerColor(currentUserId, summitId)
        ]);
        
        setSommet(summitData);
        setAscensions(ascensionsData);
        setMarkerColor(colorData);

        const existingAscension = ascensionsData.find(a => a.userId === currentUserId);
        if (existingAscension) {
          setActionState('done');
          setMyAscensionId(existingAscension.id);
          setDateAscension(existingAscension.dateAscension);
          setRating(existingAscension.rating);
          setComment(existingAscension.comment);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [summitId, currentUserId]);

  const handleColorChange = async (color: string) => {
    setMarkerColor(color);
    await updateMarkerColor(currentUserId, summitId, color);
  };

  const handleSubmitAscension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sommet || rating === 0) return alert("Veuillez donner une note.");
    setIsSubmitting(true);

    try {
      let finalColor = markerColor;
      if (markerColor === "#3b82f6") {
        finalColor = "#10b981"; // Passe au vert si on l'a gravi
        await handleColorChange(finalColor);
      }

      const ascensionData = {
        userId: currentUserId,
        summitId,
        summitName: sommet.nom,
        altitude: sommet.altitude,
        dateAscension,
        rating,
        comment,
        customColor: finalColor
      };

      const id = await submitAscensionData(!!myAscensionId, myAscensionId, ascensionData);
      
      if (myAscensionId) {
        setAscensions(prev => prev.map(a => a.id === id ? { id, ...ascensionData } : a));
      } else {
        setMyAscensionId(id);
        setAscensions([{ id, ...ascensionData }, ...ascensions]);
      }
      setActionState('done');
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = calculateSummitStats(ascensions);
  const sortedAscensions = sortAscensions(ascensions, sortBy);

  return {
    sommet, loading,
    stats, sortedAscensions, sortBy, setSortBy,
    actionState, setActionState,
    markerColor, handleColorChange,
    dateAscension, setDateAscension,
    rating, setRating,
    comment, setComment,
    isSubmitting, handleSubmitAscension,
    myAscensionId
  };
}