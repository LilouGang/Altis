import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/shared/lib/firebase";

import { SommetCarte } from "../../../principale/logic/principale.selectors";
import { getSummitFromCarnet, getCommunityReviews, fetchWikipediaData } from "../data/sommets.service";
import { calculateSummitStats, sortAscensions } from "./sommets.selectors";

export function useSommets(summitId: string) {
  const cleanSummitId = summitId.replace(/^(peak_|osm_)/, '');
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
      if (!cleanSummitId) return;

      try {
        // On cherche avec l'ID propre uniquement
        const monSommet = await getSummitFromCarnet(currentUserId, cleanSummitId);
        let baseData = monSommet;

        // Fallback URL si pas dans le carnet
        if (!baseData) {
          const urlRaw = searchParams.get('data');
          if (urlRaw) baseData = JSON.parse(decodeURIComponent(urlRaw));
        }

        if (baseData) {
          setSommet(baseData);
          
          // ✨ RECONNAISSANCE DE L'ASCENSION : On vérifie si une note existe
          if (monSommet && monSommet.note && monSommet.note > 0) {
            setActionState('done'); // Déjà noté -> Récap
            setRating(monSommet.note);
            setComment(monSommet.commentaire || "");
            setDateAscension(monSommet.dateAjout?.split('T')[0] || "");
          } else if (monSommet) {
            setActionState('form'); // Dans le carnet mais pas noté -> Formulaire
          }

          // Enrichissement Wikipédia
          const wiki = await fetchWikipediaData(baseData.nom);
          setWikiData({ description: wiki.description, image: wiki.image_wiki || "" });
        }

       const allReviews = await getCommunityReviews(cleanSummitId);
        setReviews(allReviews);

      } catch (error) {
        console.error("Erreur chargement page sommet:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, [cleanSummitId, searchParams]);

  const handleSubmitAscension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sommet || rating === 0) return alert("Veuillez donner une note.");
    setIsSubmitting(true);

    try {
      const cleanSummitId = summitId.replace(/^(peak_|osm_)/, '');
      const docId = `${currentUserId}_${cleanSummitId}`;
      const summitRef = doc(db, 'user_summits', docId);
      
      const newSummitData: SommetCarte = {
        ...sommet,
        id: cleanSummitId,
        userId: currentUserId,
        dateAjout: new Date(dateAscension).toISOString(),
        statut: 'fait',
        couleur: markerColor,
        note: rating,
        commentaire: comment
      };

      await setDoc(summitRef, newSummitData, { merge: true });

      setMyAscensionId(docId);
      setActionState('done');
      
      // ✨ LA SOLUTION ICI : On ajoute instantanément notre avis au carnet de la communauté !
      setReviews(prev => {
        // On enlève notre ancien avis s'il y en avait un, et on met le nouveau en premier
        const autresAvis = prev.filter(r => r.userId !== currentUserId);
        return [newSummitData, ...autresAvis];
      });

    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mappedReviews = reviews
    .filter(r => r.note && r.note > 0) // 👈 FILTRE ICI
    .map(r => ({
      id: r.id,
      userId: r.userId || 'Alpiniste',
      rating: r.note || 0,
      comment: r.commentaire || "",
      dateAscension: r.dateAjout || new Date().toISOString(),
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