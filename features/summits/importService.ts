import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";

export async function importSommetsFromOSM() {
  // 1. La requête sur une seule ligne pour éviter les bugs d'encodage
  const query = '[out:json];node["natural"="peak"](45.75, 6.75, 45.95, 7.05);out 20;';

  try {
    console.log("Interrogation d'OpenStreetMap...");
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);

    // --- LE NOUVEAU BOUCLIER DE SÉCURITÉ ---
    // Si l'API renvoie une erreur (ex: 429 Too Many Requests, ou 400 Bad Request)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur serveur API:", errorText);
      throw new Error(`L'API a refusé la requête (Statut ${response.status})`);
    }

    // On lit d'abord la réponse en texte brut
    const responseText = await response.text();

    // On vérifie si le texte commence par <?xml (ce qui causait ton crash)
    if (responseText.trim().startsWith("<?xml")) {
      console.error("L'API a renvoyé du XML au lieu du JSON. Message :", responseText);
      throw new Error("L'API Overpass a renvoyé une erreur XML.");
    }

    // Si tout va bien, on transforme le texte en JSON manuellement
    const data = JSON.parse(responseText);
    // --------------------------------------

    if (!data.elements || data.elements.length === 0) {
      console.log("Aucun sommet trouvé.");
      return 0;
    }

    // 2. Préparation du Batch Firebase
    const batch = writeBatch(db);
    const sommetsRef = collection(db, "sommets");
    let count = 0;

    data.elements.forEach((element: any) => {
      if (element.tags && element.tags.name && element.tags.ele) {
        const nouveauSommet = {
          nom: element.tags.name,
          altitude: Number(element.tags.ele),
          coordonnees: {
            latitude: element.lat,
            longitude: element.lon
          },
          pays: ["France"], 
          massif_principal: "Massif du Mont-Blanc", 
          difficulte_moyenne: "F",
          noms_alternatifs: [],
        };

        const newDocRef = doc(sommetsRef);
        batch.set(newDocRef, nouveauSommet);
        count++;
      }
    });

    // 3. Envoi à Firebase
    if (count > 0) {
      await batch.commit();
      console.log(`${count} sommets importés avec succès !`);
      return count;
    } else {
      return 0;
    }

  } catch (error) {
    console.error("Erreur lors de l'importation :", error);
    throw error;
  }
}