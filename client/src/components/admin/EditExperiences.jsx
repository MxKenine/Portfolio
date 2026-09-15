import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyExperience = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
  tags: [],
};

export default function EditExperiences({ onCancel, onUpdated }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCv() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACK_URL}cv/me`, {
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            navigate("/login");
            return;
          }
          if (response.status === 404) {
            setExperiences([]); // pas encore de CV créé
            return;
          }
          throw new Error("Erreur lors du chargement du CV");
        }
        const data = await response.json();
        setExperiences(data.cv?.experiences || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCv();
  }, [navigate]);

  function markDirty() {
    setSuccess(false);
  }

  function updateExperience(index, field, value) {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
    markDirty();
  }

  function updateExperienceTags(index, value) {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateExperience(index, "tags", tags);
  }

  function addExperience() {
    setExperiences([...experiences, { ...emptyExperience }]);
    markDirty();
  }

  function removeExperience(index) {
    setExperiences(experiences.filter((_, i) => i !== index));
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
        body: JSON.stringify({ experiences }),
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Échec de la mise à jour des expériences");
      }
      const data = await response.json();
      onUpdated?.(data.cv);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md max-w-4xl mx-auto">
        <div className="card-body">
          <p className="text-center text-gray-500 py-10">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md max-w-4xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-1">Mes expériences</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ces informations alimentent la page CV publique de ton portfolio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="border border-base-300 rounded-lg p-4 flex flex-col gap-3 relative"
            >
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  placeholder="Intitulé du poste"
                  value={exp.title}
                  onChange={(e) => updateExperience(i, "title", e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  placeholder="Entreprise"
                  value={exp.company}
                  onChange={(e) => updateExperience(i, "company", e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  placeholder="Début (ex: 2024)"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  placeholder="Fin (ex: Actuellement)"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => updateExperience(i, "description", e.target.value)}
                className="textarea textarea-bordered w-full"
                rows={3}
              />

              <input
                placeholder="Tags séparés par des virgules (ex: React, Node.js)"
                value={exp.tags?.join(", ") || ""}
                onChange={(e) => updateExperienceTags(i, e.target.value)}
                className="input input-bordered w-full"
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

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {success && !error && (
            <div className="alert alert-success text-sm py-2">
              <span>Expériences mises à jour avec succès.</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-base-200">
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn btn-ghost">
                Annuler
              </button>
            )}
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