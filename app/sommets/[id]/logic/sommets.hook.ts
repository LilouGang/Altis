import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";

import { SommetCarte } from "../../../principale/logic/principale.selectors";
import { getSummitFromCarnet, getCommunityReviews, fetchWikipediaData } from "../data/sommets.service";
import { calculateSummitStats, sortAscensions } from "./sommets.selectors";

export function useSommets(summitId: string) {
  const searchParams = useSearchParams();
  const [sommet, setSommet] = useState<SommetCarte | null>(null);
  const [reviews, setReviews] = useState<SommetCarte[]>([]);
  const [wikiData, setWikiData] = useState({ description: "", image: "" });
  const [loading, setLoading] = useState(true);

  // 1. ÉTATS DU FORMULAIRE
  const [actionState, setActionState] = useState<'prompt' | 'form' | 'done'>('prompt');
  const [dateAscension, setDateAscension] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [markerColor, setMarkerColor] = useState("#10b981");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myAscensionId, setMyAscensionId] = useState<string | null>(null);

  // 2. ÉTATS DES STATISTIQUES (Notes)
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');

  const currentUserId = "user_test_123"; 

  useEffect(() => {
    async function loadAllData() {
      if (!summitId) return;

      try {
        const monSommet = await getSummitFromCarnet(currentUserId, summitId);
        let baseData: SommetCarte | null = monSommet;

        if (!baseData) {
          const urlRaw = searchParams.get('data');
          if (urlRaw) baseData = JSON.parse(decodeURIComponent(urlRaw));
        }

        if (baseData) {
          setSommet(baseData);
          if (monSommet) {
            setActionState('done');
            setDateAscension(monSommet.dateAjout?.split('T')[0] || "");
            setRating(monSommet.note || 0);
            setComment(monSommet.commentaire || "");
            setMarkerColor(monSommet.couleur || "#10b981");
            setMyAscensionId(`${currentUserId}_${summitId}`); // On sait qu'on l'a déjà !
          }

          const wiki = await fetchWikipediaData(baseData.nom);
          setWikiData({ description: wiki.description, image: wiki.image_wiki || "" });
        }

        const allReviews = await getCommunityReviews(summitId);
        setReviews(allReviews);

      } catch (error) {
        console.error("Erreur chargement page sommet:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, [summitId, searchParams]);

  // 3. SOUMISSION DU FORMULAIRE (Vers la nouvelle base user_summits)
  const handleSubmitAscension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sommet || rating === 0) return alert("Veuillez donner une note.");
    setIsSubmitting(true);

    try {
      const docId = `${currentUserId}_${summitId}`;
      const summitRef = doc(db, 'user_summits', docId);
      
      // On sauvegarde toutes les infos au même endroit
      await setDoc(summitRef, {
        ...sommet,
        userId: currentUserId,
        dateAjout: new Date(dateAscension).toISOString(),
        statut: 'fait',
        couleur: markerColor,
        note: rating,
        commentaire: comment
      }, { merge: true });

      setMyAscensionId(docId);
      setActionState('done');
      
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. ADAPTATION POUR LES STATS
  // On transforme nos Sommets de Firebase au format attendu par tes composants de stats
  const mappedReviews = reviews.map(r => ({
    id: r.id,
    userId: r.userId || 'inconnu',
    summitId: r.id,
    summitName: r.nom,
    altitude: r.altitude,
    dateAscension: r.dateAjout || new Date().toISOString(),
    rating: r.note || 0,
    comment: r.commentaire || "",
    customColor: r.couleur || "#10b981"
  }));

  const stats = calculateSummitStats(mappedReviews as any);
  const sortedAscensions = sortAscensions(mappedReviews as any, sortBy);

  // 5. ON EXPORTE TOUT CE DONT PAGE.TSX A BESOIN
  return {
    sommet, wikiData, loading,
    actionState, setActionState,
    dateAscension, setDateAscension,
    rating, setRating,
    comment, setComment,
    isSubmitting, handleSubmitAscension,
    myAscensionId,
    stats, sortedAscensions, sortBy, setSortBy
  };
}