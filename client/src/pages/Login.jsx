import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Identifiants incorrects");
      }
      const data = await response.json();
      console.log(data);
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
    <main data-theme="light" className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-gray-100 rounded-lg p-10">
        <div className="flex flex-col items-center mb-8">
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white mb-3">
            <ShieldCheck size={22} />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        </div>

        <form
        
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-gray-600">E-mail</span>
            </label>

            <input
              type="email"
              placeholder="Email..."
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white"
            />
          </div>
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-gray-600">Mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="Mot de passe..."
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white"
            />
          </div>
          <div className="text-right mt-1">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <div className="flex justify-center pt-2">
            <button
              disabled={loading}
className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none px-8"            >
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </div>
        </form>
      </div>
    </main>
    </div>
  );
}
