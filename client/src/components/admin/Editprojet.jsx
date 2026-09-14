import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

export default function Editprojet() {
  const { projetId } = useParams(); // présent = édition, absent = création
  const navigate = useNavigate();
  const isEdit = Boolean(projetId);

  const [form, setForm] = useState({
    title: "",
    image: "",
    tags: "",
    description: "",
    link: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    async function fetchProjet() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACK_URL}projets/${projetId}`);
        if (!res.ok) throw new Error("Projet introuvable");
        const data = await res.json();
        setForm({
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
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const payload = {
      ...form,
      tags: form.tags
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

      navigate(`/projets/${isEdit ? projetId : data.projet._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}projets/${projetId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      navigate("/projets");
    } catch (err) {
      setError(err.message);
    }
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
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? "Modifier le projet" : "Nouveau projet"}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (URL)
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="React, Node, MongoDB"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien
            </label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {isEdit ? "Enregistrer" : "Créer"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-500 px-5 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}