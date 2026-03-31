import { useState } from "react";
import { Star, MapPin, Check, Edit2 } from "lucide-react";

interface EnregistrementProps {
  actionState: 'prompt' | 'form' | 'done';
  setActionState: (state: 'prompt' | 'form' | 'done') => void;
  dateAscension: string;
  setDateAscension: (v: string) => void;
  rating: number;
  setRating: (v: number) => void;
  comment: string;
  setComment: (v: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  myAscensionId: string | null;
}

export default function Enregistrement({
  actionState, setActionState, dateAscension, setDateAscension, rating, setRating,
  comment, setComment, isSubmitting, onSubmit, myAscensionId
}: EnregistrementProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="bg-white rounded-4xl border border-neutral-200 shadow-sm p-8 mb-8 transition-all">
      
      {actionState === 'prompt' && (
        <div className="text-center">
          <MapPin size={32} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-bold text-neutral-900 mb-1">Avez-vous gravi ce sommet ?</h3>
          <p className="text-sm text-neutral-500 mb-6">Ajoutez-le à votre carnet pour sauvegarder vos souvenirs.</p>
          <button onClick={() => setActionState('form')} className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-colors">
            Oui, enregistrer mon ascension
          </button>
        </div>
      )}

      {actionState === 'form' && (
        <form onSubmit={onSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-3">Détails de l'ascension</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-4 md:w-1/2">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Date</label>
                <input required type="date" value={dateAscension} onChange={(e) => setDateAscension(e.target.value)} className="w-full p-2.5 text-sm font-medium border border-neutral-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Note globale</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={24} onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} className={`cursor-pointer transition-colors ${s <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Votre récit / Avis</label>
            <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full p-3 text-sm font-medium border border-neutral-200 rounded-xl outline-none resize-none" placeholder="Partagez les conditions..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setActionState(myAscensionId ? 'done' : 'prompt')} className="px-5 py-2.5 text-sm font-bold text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50">
              {isSubmitting ? "Enregistrement..." : myAscensionId ? "Mettre à jour" : "Publier"}
            </button>
          </div>
        </form>
      )}

      {actionState === 'done' && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0"><Check size={20} className="text-emerald-500" /></div>
            <div>
              <h3 className="font-bold text-neutral-900">Ascension enregistrée</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Fait le {new Date(dateAscension).toLocaleDateString('fr-FR')} • Évalué {rating}/5</p>
            </div>
          </div>
          <button onClick={() => setActionState('form')} className="flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm font-bold rounded-xl transition-colors">
            <Edit2 size={14} /> Modifier mon avis
          </button>
        </div>
      )}
    </div>
  );
}