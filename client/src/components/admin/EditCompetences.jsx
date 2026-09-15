import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const emptySkill = { name: "", level: 50 };

export default function EditCompetences({ onCancel, onUpdated }) {
  const [skills, setSkills] = useState([]);
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
            setSkills([]);
            return;
          }
          throw new Error("Erreur lors du chargement du CV");
        }
        const data = await response.json();
        setSkills(data.cv?.skills || []);
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

  function updateSkill(index, field, value) {
    const updated = [...skills];
    updated[index] = {
      ...updated[index],
      [field]: field === "level" ? Number(value) : value,
    };
    setSkills(updated);
    markDirty();
  }

  function addSkill() {
    setSkills([...skills, { ...emptySkill }]);
    markDirty();
  }

  function removeSkill(index) {
    setSkills(skills.filter((_, i) => i !== index));
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
        body: JSON.stringify({ skills }),
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Échec de la mise à jour des compétences");
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
        <h2 className="card-title text-2xl mb-1">Mes compétences</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ces informations alimentent la page CV publique de ton portfolio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                placeholder="Nom"
                value={skill.name}
                onChange={(e) => updateSkill(i, "name", e.target.value)}
                className="input input-bordered w-40 shrink-0"
              />
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

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          {success && !error && (
            <div className="alert alert-success text-sm py-2">
              <span>Compétences mises à jour avec succès.</span>
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