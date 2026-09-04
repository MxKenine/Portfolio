import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserPlus } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [where, setWhere] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [age, setAge] = useState("");

  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("phone", phone);
      formData.append("age", age);
      formData.append("where", where);
      formData.append("role", role);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        console.log("Détail de l'erreur :", errorBody);
        throw new Error(errorBody?.message || "Erreur lors de l'inscription");
      }

      await response.json();
      navigate("/login");
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-theme="light" className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="px-6 md:px-12 py-6">
        <span className="text-xl font-semibold text-gray-900">KenineCorp</span>
      </header>

      {/* Formulaire centré */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-gray-100 rounded-lg p-10">

          <div className="flex flex-col items-center mb-8">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white mb-3">
              <ShieldCheck size={22} />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Inscription</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-gray-600">E-mail</span>
              </label>
              <input
                type="email"
                placeholder="adresse@mail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-gray-600">Mot de passe</span>
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-gray-600">Prénom</span>
                </label>
                <input
                  type="text"
                  placeholder="Jean"
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="input input-bordered w-full bg-white"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-gray-600">Nom</span>
                </label>
                <input
                  type="text"
                  placeholder="Dupont"
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="input input-bordered w-full bg-white"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-gray-600">Numéro de téléphone</span>
              </label>
              <input
                type="text"
                placeholder="01 02 03 04 05"
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-gray-600">Lieu</span>
                </label>
                <input
                  type="text"
                  placeholder="64800, France"
                  onChange={(e) => setWhere(e.target.value)}
                  required
                  className="input input-bordered w-full bg-white"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-gray-600">Âge</span>
                </label>
                <input
                  type="number"
                  placeholder="25"
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="input input-bordered w-full bg-white"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-gray-600">Avatar</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="file-input file-input-bordered w-full bg-white"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none px-8"
              >
                {loading ? "Inscription..." : "S'inscrire"}
                <UserPlus size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}