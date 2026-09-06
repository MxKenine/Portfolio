import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function getAdminData() {
    try {
      const response = await fetch(`http://localhost:3000/admin`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Accès refusé");
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }

  useEffect(() => {
    getAdminData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tableau de bord</h2>
      {user && (
        <p>Bienvenue, {user.firstname || user.email} 👋</p>
      )}
      {/* Ici tu peux ajouter des stats: nb de projets, nb d'expériences, etc. */}
    </div>
  );
}