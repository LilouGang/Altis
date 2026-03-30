"use client";
import FormulaireAuth from "./ui/FormulaireAuth";
import { useComptes } from "./logic/comptes.hook";

export default function ComptesPage() {
  // On récupère toute la logique depuis notre hook
  const authLogic = useComptes();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-6">
      {/* On passe toute la logique au composant UI qui est "bête" */}
      <FormulaireAuth {...authLogic} />
    </div>
  );
}