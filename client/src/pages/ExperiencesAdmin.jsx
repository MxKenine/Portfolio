import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditCv from "./EditCV";

export default function ExperiencesAdmin() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function getCv() {
    try {
      const response = await fetch(`http://localhost:3000/cv/me`, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 404) {
        setCv(null); // pas encore de CV → formulaire vide
      } else if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error("Impossible de récupérer le CV");
      } else {
        const data = await response.json();
        setCv(data.cv);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCv();
  }, []);

  if (loading) return <p>Chargement du CV...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mes expériences</h2>
      <EditCv
        cv={cv}
        onCancel={() => navigate("/admin")}
        onUpdated={(updatedCv) => setCv(updatedCv)}
      />
    </div>
  );
}