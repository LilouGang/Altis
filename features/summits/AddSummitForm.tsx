"use client";
import { useState } from "react";
import { addSummit } from "./summitService";

export default function AddSummitForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // L'état local du formulaire (avec des valeurs par défaut vides)
  const [formData, setFormData] = useState({
    nom: "",
    noms_alternatifs: "", // On stocke en texte temporairement (séparé par des virgules)
    altitude: "",
    lat: "",
    lng: "",
    pays: "", // Séparé par des virgules
    massif_principal: "",
    prominence: "",
    difficulte_moyenne: "F",
    image_couverture_url: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // On formate les données pour qu'elles correspondent exactement à ton type "Sommet"
      const formattedData = {
        nom: formData.nom,
        noms_alternatifs: formData.noms_alternatifs.split(",").map(s => s.trim()).filter(Boolean),
        altitude: Number(formData.altitude),
        coordonnees: {
          latitude: Number(formData.lat),
          longitude: Number(formData.lng)
        },
        pays: formData.pays.split(",").map(s => s.trim()).filter(Boolean),
        massif_principal: formData.massif_principal,
        prominence: formData.prominence ? Number(formData.prominence) : undefined,
        difficulte_moyenne: formData.difficulte_moyenne as any,
        image_couverture_url: formData.image_couverture_url,
      };

      await addSummit(formattedData);
      setSuccess(true);
      // Optionnel : on peut vider le formulaire ici
    } catch (error) {
      alert("Erreur lors de l'ajout. Regarde la console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-8">
      
      {/* SECTION 1 : Identité */}
      <section>
        <h2 className="text-lg font-bold text-black border-b border-neutral-100 pb-2 mb-4">1. Identité & Géographie</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-black mb-1">Nom du sommet *</label>
            <input required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Mont Blanc" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Altitude (m) *</label>
            <input required type="number" name="altitude" value={formData.altitude} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="Ex: 4807" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Pays (séparés par des virgules)</label>
            <input type="text" name="pays" value={formData.pays} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="Ex: France, Italie" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Latitude *</label>
            <input required type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="Ex: 45.8326" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Longitude *</label>
            <input required type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="Ex: 6.8652" />
          </div>
        </div>
      </section>

      {/* SECTION 2 : Topographie */}
      <section>
        <h2 className="text-lg font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-4">2. Topographie</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Massif principal *</label>
            <input required type="text" name="massif_principal" value={formData.massif_principal} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="Ex: Massif du Mont-Blanc" />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Prominence (m)</label>
            <input type="number" name="prominence" value={formData.prominence} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="Ex: 4695" />
          </div>
        </div>
      </section>

      {/* SECTION 3 : Gamification & Image */}
      <section>
        <h2 className="text-lg font-bold text-neutral-800 border-b border-neutral-100 pb-2 mb-4">3. Informations complémentaires</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Cotation / Difficulté</label>
            <select name="difficulte_moyenne" value={formData.difficulte_moyenne} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none cursor-pointer">
              <option value="F">F (Facile)</option>
              <option value="PD">PD (Peu Difficile)</option>
              <option value="AD">AD (Assez Difficile)</option>
              <option value="D">D (Difficile)</option>
              <option value="TD">TD (Très Difficile)</option>
              <option value="ED">ED (Extrêmement Difficile)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">URL de l'image de couverture</label>
            <input type="url" name="image_couverture_url" value={formData.image_couverture_url} onChange={handleChange} className="w-full p-3 bg-black border border-neutral-200 rounded-xl outline-none" placeholder="https://..." />
          </div>
        </div>
      </section>

      {success && <div className="p-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-center">Sommet ajouté avec succès à la base de données !</div>}

      <button disabled={loading} type="submit" className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-colors disabled:opacity-50 mt-4">
        {loading ? "Ajout en cours..." : "Ajouter le sommet"}
      </button>
    </form>
  );
}