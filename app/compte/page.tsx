"use client";
import FormulaireAuth from "./ui/FormulaireAuth";
import { useComptes } from "./logic/comptes.hook";

export default function ComptesPage() {
  const authLogic = useComptes();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-6">
      <FormulaireAuth {...authLogic} />
    </div>
  );
}