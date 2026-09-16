import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const emptyForm = {
  title: "",
  tags: "",
  description: "",
  link: "",
};

export default function EditProjet() {
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function fetchProjets() {
    setLoadingList(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}projets`);
      if (!response.ok) throw new Error("Erreur de chargement des projets");
      const data = await response.json();
      setProjets(data.projets);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchProjets();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(false);
    setView("form");
  }

  function openEditForm(projet) {
    setEditingId(projet._id);
    setFormData({
      title: projet.title || "",
      tags: (projet.tags || []).join(", "),
      description: projet.description || "",
      link: projet.link || "",
    });
    setImageFile(null);
    setImagePreview(projet.image || null);
    setError(null);
    setSuccess(false);
    setView("form");
  }

  function backToList() {
    setView("list");
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const isEdit = Boolean(editingId);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("link", formData.link);
      formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((tag) => payload.append("tags", tag));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const url = `${import.meta.env.VITE_BACK_URL}projets${isEdit ? `/${editingId}` : ""}`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: payload,
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Erreur lors de l'enregistrement");
      }

      setSuccess(true);
      await fetchProjets();
      setTimeout(() => {
        setView("list");
      }, 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce projet ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}projets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Échec de la suppression");
      }
      setProjets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setListError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (view === "list") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des projets
              </h1>
              <p className="text-gray-600">
                Ajout, modification ou suppression des projets.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
            >
              + Nouveau projet
            </button>
          </div>

          {listError && (
            <div className="alert alert-error text-sm py-2 mb-6">
              <span>{listError}</span>
            </div>
          )}

          {loadingList ? (
            <p className="text-center text-gray-500 py-20">Chargement...</p>
          ) : projets.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Aucun projet pour le moment.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projets.map((projet) => (
                <div
                  key={projet._id}
                  className="border border-gray-200 rounded-lg overflow-hidden flex"
                >
                  <div className="w-32 shrink-0 bg-gray-100">
                    <img
                      src={projet.image}
                      alt={projet.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {projet.title}
                      </h2>
                      {projet.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {projet.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => openEditForm(projet)}
                        className="btn btn-outline btn-sm flex-1"
                      >
                        Éditer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(projet._id)}
                        disabled={deletingId === projet._id}
                        className="btn btn-outline btn-error btn-sm flex-1"
                      >
                        {deletingId === projet._id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          "Supprimer"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const isEdit = Boolean(editingId);

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
              {/* Image */}
              <div className="flex items-center gap-4">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-base-200 ring ring-emerald-500 ring-offset-base-100 ring-offset-2 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
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
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, JPEG, WEBP — 2 Mo max
                  </p>
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
                    onClick={() => handleDelete(editingId)}
                    disabled={saving}
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Supprimer
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={backToList}
                    className="btn btn-ghost"
                  >
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
