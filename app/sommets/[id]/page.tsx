"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useSommets } from "./logic/sommets.hook";
import Details from "./ui/Details";
import Enregistrement from "./ui/Enregistrement";
import Notes from "./ui/Notes";

export default function SommetsPage() {
  const params = useParams();
  const summitId = params.id as string;
  
  const logic = useSommets(summitId);

  if (logic.loading) return <div className="p-20 text-center text-sm font-medium text-neutral-400">Chargement des données...</div>;
  if (!logic.sommet) return <div className="p-20 text-center text-sm font-medium text-neutral-400">Sommet introuvable.</div>;

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={14} /> Retour à la carte
          </Link>
        </div>

       <Details 
          sommet={logic.sommet} 
          wiki={logic.wikiData || { description: "Chargement...", image: "" }}
        />

        <Enregistrement 
          actionState={logic.actionState} setActionState={logic.setActionState}
          dateAscension={logic.dateAscension} setDateAscension={logic.setDateAscension}
          rating={logic.rating} setRating={logic.setRating}
          comment={logic.comment} setComment={logic.setComment}
          isSubmitting={logic.isSubmitting} onSubmit={logic.handleSubmitAscension}
          myAscensionId={logic.myAscensionId}
        />

        <Notes 
          stats={logic.stats}
          sortedAscensions={logic.sortedAscensions}
          sortBy={logic.sortBy} setSortBy={logic.setSortBy}
        />

      </div>
    </div>
  );
}