import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [where, setWhere] = useState("");
  const [avatar, setAvatar] = useState("");
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

      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        console.log("Détail de l'erreur 400 :", errorBody);
        throw new Error("Erreur lors de l'inscription");
      }
      const data = await response.json();
      navigate("/login");
    } catch (err) {
      setError(err.message || "Une erreur es survenue");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main>
      <div className="h-screen justify-center items-center flex">
        <form
          onSubmit={handleSubmit}
          className="w-150 p-5 flex flex-col gap-5 bg-emerald-800"
        >
          <input
            type="email"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="text"
            placeholder="Prénom..."
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="text"
            placeholder="Nom..."
            onChange={(e) => setLastname(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="text"
            placeholder="Numéro de téléphone..."
            onChange={(e) => setPhone(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="text"
            placeholder="Lieux..."
            onChange={(e) => setWhere(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="number"
            placeholder="Age..."
            onChange={(e) => setAge(e.target.value)}
            required
            className="input input-accent w-full"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="bg-emerald-950 flex justify-center p-2 hover:cursor-pointer"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </main>
  );
}
