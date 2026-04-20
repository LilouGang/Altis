const formatNom = (str: string) => {
  if (!str) return "Inconnu";
  return str.replace(/\b(mont|aiguille|dôme|pic|pointe|tête|tour|grand|petit|rocher)\b/gi, (match) => {
    return match.charAt(0).toUpperCase() + match.slice(1);
  });
};

const formatMassif = (str: string) => {
  if (!str) return "Inconnu";
  const cleaned = str.replace(/^(massif|chaîne|groupe|les|le|la)\s+(d[eu'es]*\s*)?/gi, "").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export async function fetchWikidataTest() {
  const sparqlQuery = `
    SELECT ?sommet ?sommetLabel ?nomFR ?nomNatif ?altitude ?prominence ?massifLabel ?paysLabel ?coords WHERE {
      SERVICE wikibase:box {
        ?sommet wdt:P625 ?coords.
        # ZONE DE TEST : Autour du Mont-Blanc (à retirer plus tard pour faire par pays)
        bd:serviceParam wikibase:cornerWest "Point(6.75 45.75)"^^geo:wktLiteral.
        bd:serviceParam wikibase:cornerEast "Point(7.05 45.95)"^^geo:wktLiteral.
      }
      ?sommet wdt:P31 wd:Q8502. 
      ?sommet wdt:P2044 ?altitude.
      
      OPTIONAL { ?sommet wdt:P2660 ?prominence. }
      OPTIONAL { ?sommet wdt:P4552 ?massif. }
      OPTIONAL { ?sommet wdt:P17 ?pays. }
      
      # On demande explicitement le NOM NATIF (langue locale officielle)
      OPTIONAL { ?sommet wdt:P1705 ?nomNatif. }
      # On demande le nom français
      OPTIONAL { ?sommet rdfs:label ?nomFR. FILTER(LANG(?nomFR) = "fr") }
      
      # Fallback général si aucun des deux n'est trouvé
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    LIMIT 300
  `;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  
  const response = await fetch(url, { headers: { "Accept": "application/sparql-results+json" } });
  if (!response.ok) throw new Error("Erreur de l'API Wikidata");

  const data = await response.json();
  const results = data.results.bindings;

  const sommetsMap = new Map();

  results.forEach((item: any) => {
    const wikidataId = item.sommet.value;
    
    const labelBase = item.sommetLabel?.value;
    if (!labelBase || labelBase.match(/^Q\d+$/)) return;

    const nomOriginal = item.nomNatif?.value || labelBase;
    const nomFrancais = item.nomFR?.value || nomOriginal;
    const pays = item.paysLabel?.value;

    if (sommetsMap.has(wikidataId)) {
      const existing = sommetsMap.get(wikidataId);
      if (pays && !existing.pays.includes(pays)) {
        existing.pays.push(pays);
      }
    } else {
      const pointStr = item.coords.value.replace("Point(", "").replace(")", "");
      const [lon, lat] = pointStr.split(" ").map(Number);

      sommetsMap.set(wikidataId, {
        wikidata_id: wikidataId.split('/').pop(),
        nom_officiel: formatNom(nomOriginal), 
        nom_fr: formatNom(nomFrancais),
        altitude: item.altitude ? Number(item.altitude.value) : null,
        prominence: item.prominence ? Number(item.prominence.value) : null,
        massif: formatMassif(item.massifLabel?.value),
        pays: pays ? [pays] : ["Inconnu"],
        latitude: lat,
        longitude: lon
      });
    }
  });

  return Array.from(sommetsMap.values()).sort((a, b) => (b.altitude || 0) - (a.altitude || 0));
}