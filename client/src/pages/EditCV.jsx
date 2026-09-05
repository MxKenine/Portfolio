import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Valeurs par défaut utilisées quand on ajoute une nouvelle entrée
// (expérience, compétence, langue) au formulaire
const emptyExperience = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
  tags: [],
};
const emptySkill = { name: "", level: 50 };
const emptyLanguage = { name: "", level: 1, label: "" };

export default function EditCv({ cv, onCancel, onUpdated }) {
  // Initialisation du formulaire à partir du CV existant (s'il y en a un),
  // sinon on part sur des tableaux vides
  const [formData, setFormData] = useState({
    experiences: cv?.experiences?.length ? cv.experiences : [],
    skills: cv?.skills?.length ? cv.skills : [],
    languages: cv?.languages?.length ? cv.languages : [],
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false); // désactive le bouton pendant l'enregistrement
  const [success, setSuccess] = useState(false); // affiche un message de confirmation après enregistrement
  const navigate = useNavigate();

  // Réinitialise le message de succès dès qu'un champ est modifié après un enregistrement
  function markDirty() {
    setSuccess(false);
  }

  // --- Expériences ---

  // Met à jour un champ précis (title, company, ...) d'une expérience à l'index donné
  function updateExperience(index, field, value) {
    const experiences = [...formData.experiences];
    experiences[index] = { ...experiences[index], [field]: value };
    setFormData({ ...formData, experiences });
    markDirty();
  }
  // Transforme la saisie "React, Node.js" en tableau ["React", "Node.js"]
  // et met à jour le champ tags de l'expérience concernée
  function updateExperienceTags(index, value) {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean); // retire les entrées vides (ex: virgule en trop)
    updateExperience(index, "tags", tags);
  }
  // Ajoute une nouvelle expérience vide au formulaire
  function addExperience() {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { ...emptyExperience }],
    });
  }
  // Supprime l'expérience à l'index donné
  function removeExperience(index) {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index),
    });
  }

  // --- Compétences ---

  // Met à jour un champ (name ou level) d'une compétence à l'index donné
  // Le niveau est converti en Number car il vient d'un <input type="range">
  function updateSkill(index, field, value) {
    const skills = [...formData.skills];
    skills[index] = {
      ...skills[index],
      [field]: field === "level" ? Number(value) : value,
    };
    setFormData({ ...formData, skills });
    markDirty();
  }
  // Ajoute une nouvelle compétence vide (niveau par défaut 50%)
  function addSkill() {
    setFormData({
      ...formData,
      skills: [...formData.skills, { ...emptySkill }],
    });
  }
  // Supprime la compétence à l'index donné
  function removeSkill(index) {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  }

  // --- Langues ---

  // Met à jour un champ (name, level ou label) d'une langue à l'index donné
  function updateLanguage(index, field, value) {
    const languages = [...formData.languages];
    languages[index] = {
      ...languages[index],
      [field]: field === "level" ? Number(value) : value,
    };
    setFormData({ ...formData, languages });
    markDirty();
  }
  // Ajoute une nouvelle langue vide au formulaire
  function addLanguage() {
    setFormData({
      ...formData,
      languages: [...formData.languages, { ...emptyLanguage }],
    });
  }
  // Supprime la langue à l'index donné
  function removeLanguage(index) {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  }

  // Soumission du formulaire : envoie l'ensemble du CV au backend en une seule requête PATCH
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { ...formData };
      const response = await fetch(`http://localhost:3000/cv/me`, {
        method: "PATCH",
        credentials: "include", // envoie le cookie de session (JWT)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // Session invalide ou expirée → redirection vers la connexion
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Échec de la mise à jour du CV");
      }
      const data = await response.json();
      // Remonte le CV mis à jour au composant parent (ex: pour rafraîchir l'affichage)
      onUpdated(data.cv);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-md max-w-4xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-1">Mon CV</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ces informations alimentent la page CV publique de ton portfolio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Expériences */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Expériences</h3>
            <div className="flex flex-col gap-4">
              {formData.experiences.map((exp, i) => (
                <div
                  key={i}
                  className="border border-base-300 rounded-lg p-4 flex flex-col gap-3 relative"
                >
              

                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Intitulé du poste"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(i, "title", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                    <input
                      placeholder="Entreprise"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(i, "company", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                    <input
                      placeholder="Début (ex: 2024)"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(i, "startDate", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                    <input
                      placeholder="Fin (ex: Actuellement)"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(i, "endDate", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  </div>

                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(i, "description", e.target.value)
                    }
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />

                  
                  <div className="flex justify-end pt-1">
      <button
        type="button"
        onClick={() => removeExperience(i)}
        className="btn btn-error btn-outline btn-sm"
      >
        Supprimer cette expérience
      </button>
    </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="btn btn-outline btn-sm w-fit"
              >
                + Ajouter une expérience
              </button>
            </div>
          </section>

          <div className="divider m-0" />

          {/* Compétences */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Compétences</h3>
            <div className="flex flex-col gap-3">
              {formData.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    placeholder="Nom"
                    value={skill.name}
                    onChange={(e) => updateSkill(i, "name", e.target.value)}
                    className="input input-bordered w-40 shrink-0"
                  />
                  {/* Niveau de compétence en pourcentage (0-100) */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => updateSkill(i, "level", e.target.value)}
                    className="range range-sm range-success flex-1"
                  />
                  <span className="text-sm w-10 text-right shrink-0">
                    {skill.level}%
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="btn btn-ghost btn-xs btn-circle text-error"
                    aria-label="Retirer cette compétence"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-outline btn-sm w-fit"
              >
                + Ajouter une compétence
              </button>
            </div>
          </section>

          <div className="divider m-0" />

          {/* Langues */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Langues</h3>
            <div className="flex flex-col gap-3">
              {formData.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-3 flex-wrap">
                  <input
                    placeholder="Nom"
                    value={lang.name}
                    onChange={(e) =>
                      updateLanguage(i, "name", e.target.value)
                    }
                    className="input input-bordered w-32 shrink-0"
                  />
                  <input
                    placeholder="ex: Langue maternelle, Niveau B2"
                    value={lang.label}
                    onChange={(e) =>
                      updateLanguage(i, "label", e.target.value)
                    }
                    className="input input-bordered flex-1 min-w-40"
                  />
                  {/* Niveau de langue sur une échelle de 0 à 6 */}
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={lang.level}
                    onChange={(e) =>
                      updateLanguage(i, "level", e.target.value)
                    }
                    className="range range-sm range-success w-32 shrink-0"
                  />
                  <span className="text-sm w-10 text-right shrink-0">
                    {lang.level}/6
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLanguage(i)}
                    className="btn btn-ghost btn-xs btn-circle text-error"
                    aria-label="Retirer cette langue"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLanguage}
                className="btn btn-outline btn-sm w-fit"
              >
                + Ajouter une langue
              </button>
            </div>
          </section>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {success && !error && (
            <div className="alert alert-success text-sm py-2">
              <span>CV mis à jour avec succès.</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-base-200">
            <button type="button" onClick={onCancel} className="btn btn-ghost">
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
            >
              {saving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}