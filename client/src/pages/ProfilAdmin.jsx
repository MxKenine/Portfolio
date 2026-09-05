import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfil from "./Editprofil";

export default function ProfilAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function getProfil() {
    try {
      const response = await fetch(`http://localhost:3000/admin/profil`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Impossible de récupérer le profil");
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
    getProfil();
  }, []);

  if (loading) return <p>Chargement du profil...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Aucun profil trouvé</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mon profil</h2>
      <EditProfil
        user={user}
        onCancel={() => navigate("/admin")}
        onUpdated={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}