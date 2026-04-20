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
  const [actionState, setActionState] = useState<'prompt' | 'form' | 'done'>('prompt');
  const [dateAscension, setDateAscension] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [markerColor, setMarkerColor] = useState("#10b981");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myAscensionId, setMyAscensionId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const currentUserId = "user_test_123"; 

  useEffect(() => {
    async function loadAllData() {
      if (!cleanSummitId) return;

      try {
        const monSommet = await getSummitFromCarnet(currentUserId, cleanSummitId);
        let baseData = monSommet;

        if (!baseData) {
          const urlRaw = searchParams.get('data');
          if (urlRaw) baseData = JSON.parse(decodeURIComponent(urlRaw));
        }

        if (baseData) {
          setSommet(baseData);

          if (monSommet && monSommet.note && monSommet.note > 0) {
            setActionState('done');
            setRating(monSommet.note);
            setComment(monSommet.commentaire || "");
            setDateAscension(monSommet.dateAjout?.split('T')[0] || "");
          } else if (monSommet) {
            setActionState('form');
          }

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
      setReviews(prev => {
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
    .filter(r => r.note && r.note > 0)
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