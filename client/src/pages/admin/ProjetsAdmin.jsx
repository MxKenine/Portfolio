import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editprojet from "../../components/admin/Editprojet";

export default function getProjets() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function getProjets() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}admin/projets`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Impossible de récupérer les projets");
      }
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProjets();
  }, []);

  if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Aucun projet trouvé</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <h2 className="text-xl font-bold mb-4">Mes projets</h2>
      <Editprojet
        user={user}
        onCancel={() => navigate("/admin")}
        onUpdated={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}
