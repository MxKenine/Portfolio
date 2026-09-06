import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfil({ user, onCancel, onUpdated }) {
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    lastname: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    where: user.where || "",
    age: user.age || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar ? `http://localhost:3000/${user.avatar}` : null
  );
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // aperçu immédiat avant envoi
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // FormData nécessaire pour envoyer un fichier + du texte en même temps
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      const response = await fetch(`http://localhost:3000/admin/profil`, {
        method: "PATCH",
        credentials: "include",
        body: payload, // pas de Content-Type manuel : le navigateur le gère avec FormData
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Échec de la mise à jour");
      }
      const data = await response.json();
      onUpdated(data.user);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-md max-w-2xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-2">Modifier mon profil</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ces informations sont utilisées sur ton portfolio public.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full ring ring-emerald-500 ring-offset-base-100 ring-offset-2">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" />
                ) : (
                  <div className="bg-base-200 w-full h-full flex items-center justify-center text-2xl text-gray-400">
                    ?
                  </div>
                )}
              </div>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Prénom</span>
              </label>
              <input
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Quentin"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom</span>
              </label>
              <input
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Duprey"
              />
            </div>

            <div className="form-control sm:col-span-2">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="contact@keninecorp.dev"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Téléphone</span>
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Âge</span>
              </label>
              <input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control sm:col-span-2">
              <label className="label">
                <span className="label-text">Lieu</span>
              </label>
              <input
                name="where"
                value={formData.where}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Toulouse, France"
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
              <span>Profil mis à jour avec succès.</span>
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