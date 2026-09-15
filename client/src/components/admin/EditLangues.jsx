import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyLanguage = { name: "", level: 1, label: "" };

export default function EditLangues({ cv, onCancel, onUpdated }) {
  const [languages, setLanguages] = useState(
    cv?.languages?.length ? cv.languages : []
  );
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function markDirty() {
    setSuccess(false);
  }

  function updateLanguage(index, field, value) {
    const updated = [...languages];
    updated[index] = {
      ...updated[index],
      [field]: field === "level" ? Number(value) : value,
    };
    setLanguages(updated);
    markDirty();
  }

  function addLanguage() {
    setLanguages([...languages, { ...emptyLanguage }]);
    markDirty();
  }

  function removeLanguage(index) {
    setLanguages(languages.filter((_, i) => i !== index));
    markDirty();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}cv/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languages }),
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Échec de la mise à jour des langues");
      }
      const data = await response.json();
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
        <h2 className="card-title text-2xl mb-1">Mes langues</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ces informations alimentent la page CV publique de ton portfolio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {languages.map((lang, i) => (
            <div key={i} className="flex items-center gap-3 flex-wrap">
              <input
                placeholder="Nom"
                value={lang.name}
                onChange={(e) => updateLanguage(i, "name", e.target.value)}
                className="input input-bordered w-32 shrink-0"
              />
              <input
                placeholder="ex: Langue maternelle, Niveau B2"
                value={lang.label}
                onChange={(e) => updateLanguage(i, "label", e.target.value)}
                className="input input-bordered flex-1 min-w-40"
              />
              <input
                type="range"
                min="0"
                max="6"
                value={lang.level}
                onChange={(e) => updateLanguage(i, "level", e.target.value)}
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

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {success && !error && (
            <div className="alert alert-success text-sm py-2">
              <span>Langues mises à jour avec succès.</span>
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