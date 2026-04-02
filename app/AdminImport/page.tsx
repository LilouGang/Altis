"use client";
import { useImportTest } from "./logic/import.hook";

export default function AdminImportPage() {
  const { results, loading, error, handleTestImport } = useImportTest();

  return (
    <div className="min-h-screen bg-neutral-50 p-10 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-neutral-900 mb-6">Laboratoire d'Import Wikidata</h1>
        
        <button 
          onClick={handleTestImport}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mb-8"
        >
          {loading ? "Interrogation de Wikidata..." : "Lancer le test à blanc"}
        </button>

        {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6">{error}</div>}

        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 bg-neutral-900 text-white font-bold">
              {results.length} Sommets trouvés (Aperçu brut)
            </div>
            <pre className="p-6 text-xs text-neutral-700 overflow-x-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}