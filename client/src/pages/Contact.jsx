import React, { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch(`http://localhost:3000/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Échec de l'envoi");
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <section data-theme="light" className="h-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Colonne gauche */}
        <div>
          <h2 className="text-4xl font-medium text-gray-900 leading-tight">
            Travaillons
            <br />
            ensemble
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed max-w-sm">
            Je suis actuellement disponible pour des missions en freelance et du
            conseil en architecture d'entreprise. Si vous avez un projet qui
            nécessite précision et scalabilité, discutons-en.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="text-gray-900">adresse@mail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white">
                <MapPin size={18} />
              </span>
              <div>
                <p className="text-sm text-gray-500">Localisation</p>
                <p className="text-gray-900">64800, France</p>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-gray-600">Nom</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
                className="input input-bordered w-full bg-white"
              />
            </div>
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-gray-600">E-mail</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="adresse@mail.com"
                required
                className="input input-bordered w-full bg-white"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-gray-600">Sujet</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Demande de projet"
              required
              className="input input-bordered w-full bg-white"
            />
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-gray-600">Message</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Écrivez votre message ici..."
              required
              rows={5}
              className="textarea textarea-bordered w-full bg-white resize-none"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={sending}
              className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none px-8"
            >
              {sending ? "Envoi..." : "Envoyer"}
              <Send size={16} />
            </button>
          </div>

          {status === "success" && (
            <p className="text-emerald-600 text-sm text-center">
              Message envoyé avec succès.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 text-sm text-center">
              Une erreur est survenue, réessayez.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
