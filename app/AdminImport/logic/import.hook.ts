import { useState } from "react";
import { fetchWikidataTest } from "../data/wikidata.service";

export function useImportTest() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestImport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWikidataTest();
      setResults(data);
      console.log("Résultats bruts dans la console :", data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, handleTestImport };
}