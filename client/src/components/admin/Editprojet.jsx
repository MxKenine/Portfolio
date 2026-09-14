import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

export default function EditProjet() {
  const { projetId } = useParams(); // présent = édition, absent = création
  const navigate = useNavigate();
  const isEdit = Boolean(projetId);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    tags: "",
    description: "",
    link: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    async function fetchProjet() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_URL}projets/${projetId}`);
        if (!res.ok) throw new Error("Projet introuvable");
        const data = await res.json();
        setFormData({
          title: data.projet.title || "",
          image: data.projet.image || "",
          tags: (data.projet.tags || []).join(", "),
          description: data.projet.description || "",
          link: data.projet.link || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjet();
  }, [projetId, isEdit]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = `${import.meta.env.VITE_BACK_URL}projets${isEdit ? `/${projetId}` : ""}`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      const data = await res.json();

      setSuccess(true);
      setTimeout(() => {
        navigate(`/projets/${isEdit ? projetId : data.projet._id}`);
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

    function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // aperçu immédiat avant envoi
    setSuccess(false);
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce projet ?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}projets/${projetId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      navigate("/projets");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate(isEdit ? `/projets/${projetId}` : "/projets");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <p className="text-center text-gray-500 py-20">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-2">
              {isEdit ? "Modifier le projet" : "Nouveau projet"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Ces informations sont affichées sur la page publique des projets.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Aperçu image */}
              <div className="flex items-center gap-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-base-200 ring ring-emerald-500 ring-offset-base-100 ring-offset-2 flex items-center justify-center">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Aperçu</span>
                  )}
                </div>
                 <div>
              <label className="btn btn-sm btn-outline">
                Changer la photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG — 2 Mo max</p>
            </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-control sm:col-span-2">
                  <label className="label">
                    <span className="label-text">Titre</span>
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                    placeholder="Nom du projet"
                  />
                </div>

                <div className="form-control sm:col-span-2">
                  <label className="label">
                    <span className="label-text">Image (URL)</span>
                  </label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full"
                    placeholder="https://..."
                  />
                </div>

                <div className="form-control sm:col-span-2">
                  <label className="label">
                    <span className="label-text">Tags</span>
                  </label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="React, Node, MongoDB"
                  />
                </div>

                <div className="form-control sm:col-span-2">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="textarea textarea-bordered w-full"
                    placeholder="Décris le projet..."
                  />
                </div>

                <div className="form-control sm:col-span-2">
                  <label className="label">
                    <span className="label-text">Lien</span>
                  </label>
                  <input
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error text-sm py-2">
                  <span>{error}</span>
                </div>
              )}

              {success && !error && (
                <div className="alert alert-success text-sm py-2">
                  <span>Projet enregistré avec succès.</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-base-200">
                {isEdit ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Supprimer
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={handleCancel} className="btn btn-ghost">
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : isEdit ? (
                      "Enregistrer"
                    ) : (
                      "Créer"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}