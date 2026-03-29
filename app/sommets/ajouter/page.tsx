"use client";
import AddSummitForm from "@/features/summits/AddSummitForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { importSommetsFromOSM } from "@/features/summits/importService";
import { useState } from "react";

export default function AjouterSommetPage() {
  // 1. La logique et le state sont bien À L'INTÉRIEUR du composant
  const [isImporting, setIsImporting] = useState(false);

  const handleMassImport = async () => {
    setIsImporting(true);
    try {
      const count = await importSommetsFromOSM();
      alert(`Succès ! ${count} sommets importés depuis OpenStreetMap.`);
    } catch (error) {
      alert("Erreur lors de l'importation. Regarde la console.");
    } finally {
      setIsImporting(false);
    }
  };

  // 2. Le return englobe TOUT dans une seule grande div (le fond gris)
  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-6 overflow-y-auto">
      
      {/* --- LE BLOC OUTIL ADMIN (L'import OSM) --- */}
      <div className="max-w-3xl mx-auto mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-blue-900">Importation de masse (Outil Admin)</h3>
          <p className="text-sm text-blue-700">Aspire 20 sommets autour du Mont Blanc via OpenStreetMap.</p>
        </div>
        <button 
          onClick={handleMassImport} 
          disabled={isImporting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          {isImporting ? "Importation..." : "Lancer le script"}
        </button>
      </div>

      {/* --- L'EN-TÊTE DU FORMULAIRE MANUEL --- */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={16} />
          Retour à la carte
        </Link>
        <h1 className="text-3xl font-black text-black mt-4 tracking-tight">Ajouter un sommet</h1>
        <p className="text-neutral-500 mt-1 font-medium">Enregistrez un nouveau point d'intérêt dans la base de données globale.</p>
      </div>

      {/* --- LE COMPOSANT FORMULAIRE --- */}
      <AddSummitForm />
      
    </div>
  );
}