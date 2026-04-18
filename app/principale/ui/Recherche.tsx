"use client";
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { SommetCarte } from '../logic/principale.selectors';

interface FloatingSearchProps {
  onSelectSommet: (sommet: SommetCarte) => void;
}

export default function FloatingSearch({ onSelectSommet }: FloatingSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SommetCarte[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 🧠 RECHERCHE HYBRIDE : PHOTON (Localisation) + OPEN-METEO (Topographie)
  const searchAPI = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 3) return;

    try {
      // 1. RECHERCHE DE LA LOCALISATION (Photon)
      // On ajoute &lang=fr pour avoir "Cervin" au lieu de "Matterhorn"
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchTerm)}&osm_tag=natural:peak&limit=15&lang=fr`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data || !data.features || data.features.length === 0) {
        setResults([]);
        return;
      }

      // On formate les données de base (sans exiger l'altitude cette fois !)
      let baseResults: SommetCarte[] = data.features
        .filter((feature: any) => feature.properties.name && feature.geometry?.coordinates?.length >= 2)
        .map((feature: any) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          
          return {
            id: `peak_osm_${props.osm_id}`,
            nom: props.name,
            altitude: props.elevation ? Number(props.elevation) : 0, // Fallback initial
            pays: props.country || props.state,
            coordonnees: { longitude: coords[0], latitude: coords[1] }
          };
        });

      if (baseResults.length === 0) {
        setResults([]);
        return;
      }

      // 2. 🪄 MAGIE NOIRE : RÉCUPÉRATION DES ALTITUDES EXACTES (Open-Meteo)
      // On regroupe toutes les latitudes et longitudes pour faire une seule requête groupée
      const lats = baseResults.map(s => s.coordonnees.latitude).join(',');
      const lons = baseResults.map(s => s.coordonnees.longitude).join(',');

      try {
        // On demande l'altitude exacte de ces points aux satellites ! (Gratuit, sans clé)
        const topoUrl = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`;
        const topoResponse = await fetch(topoUrl);
        const topoData = await topoResponse.json();

        if (topoData.elevation && topoData.elevation.length === baseResults.length) {
          // On fusionne les vraies altitudes topographiques dans nos résultats
          baseResults = baseResults.map((sommet, index) => ({
            ...sommet,
            // On arrondit l'altitude topographique au mètre près
            altitude: topoData.elevation[index] !== undefined && topoData.elevation[index] !== null 
              ? Math.round(topoData.elevation[index]) 
              : sommet.altitude
          }));
        }
      } catch (topoError) {
        console.warn("Erreur avec l'API Topographique, utilisation des données de secours", topoError);
      }

      // 3. TRI FINAL (Maintenant qu'on a toutes les altitudes, le vrai sommet sera toujours 1er)
      const finalResults = baseResults
        .sort((a, b) => b.altitude - a.altitude)
        .slice(0, 10);

      setResults(finalResults);
      
    } catch (error) {
      console.error("Erreur API Globale :", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length < 3) {
      setIsOpen(false);
      setResults([]);
      setIsLoading(false);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      return;
    }

    // On affiche immédiatement le menu avec les Skeletons dès qu'on tape
    setIsLoading(true);
    setIsOpen(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchAPI(value);
    }, 400);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (sommet: SommetCarte) => {
    setQuery(""); 
    setIsOpen(false);
    onSelectSommet(sommet);
  };

  const showScrollHint = !isLoading && results.length > 5;
  // Le menu s'affiche s'il y a des résultats OU si ça charge (pour voir le skeleton)
  const showMenu = isOpen && (results.length > 0 || isLoading);

  return (
    <div ref={searchRef} className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-40">
      <div className="relative flex flex-col justify-end">
        
        {/* MENU DES RÉSULTATS */}
        <div 
          className={`absolute bottom-[calc(100%+8px)] left-0 w-full bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden origin-bottom transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showMenu 
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="max-h-55 overflow-y-auto p-2 relative pb-4">
            
            {/* ⏳ SKELETON SCREEN */}
            {isLoading ? (
              <div className="flex flex-col gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full px-3 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-neutral-200/60 animate-pulse shrink-0" />
                    <div className="flex flex-col gap-2 w-full">
                      <div className="h-3.5 bg-neutral-200/60 rounded-md animate-pulse w-1/2" />
                      <div className="h-2.5 bg-neutral-200/60 rounded-md animate-pulse w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              
              /* ✅ RÉSULTATS RÉELS */
              <ul>
                {results.map((sommet) => (
                  <li key={sommet.id}>
                    <button
                      onClick={() => handleSelect(sommet)}
                      className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-100/80 rounded-2xl transition-colors group/item"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="bg-neutral-100 p-1.5 rounded-full group-hover/item:bg-white group-hover/item:shadow-sm transition-all shrink-0">
                          <MapPin size={14} className="text-neutral-500 group-hover/item:text-emerald-600" />
                        </div>
                        <div className="font-bold text-neutral-800 text-sm truncate">{sommet.nom}</div>
                      </div>
                      
                      {/* 🏔️ AFFICHAGE DE L'ALTITUDE ET DU PAYS */}
                      <div className="text-[11px] text-neutral-500 font-semibold whitespace-nowrap pl-2 flex items-center gap-1">
                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          {sommet.altitude} m
                        </span>
                        {sommet.pays && <span>• {sommet.pays}</span>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {showScrollHint && (
            <div className="absolute bottom-0 left-0 w-full h-8 bg-linear-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-1">
              <ChevronDown size={16} className="text-neutral-400 animate-bounce" />
            </div>
          )}
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative group z-10">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            {isLoading ? (
               <Loader2 size={20} className="text-emerald-500 animate-spin" />
            ) : (
               <Search size={20} className="text-neutral-500 group-focus-within:text-emerald-600 transition-colors" />
            )}
          </div>
          <input 
            type="text" 
            value={query}
            onChange={handleInputChange}
            placeholder="Chercher n'importe quel sommet dans le monde..." 
            className="w-full bg-white/90 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full py-4 pl-14 pr-6 text-neutral-800 font-medium placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

      </div>
    </div>
  );
}