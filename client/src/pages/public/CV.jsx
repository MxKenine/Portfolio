import { useEffect, useState } from "react";
import {
  Briefcase,
  Award,
  Languages as LanguagesIcon,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function CV() {
  const [cv, setCv] = useState(null);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);

  async function getData() {
    try {
      const response = await fetch(`http://localhost:3000/cv/public`);
      if (!response.ok) throw new Error("Erreur de chargement");

      const data = await response.json();
      setCv(data.cv);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function revealContact() {
    setLoadingContact(true);
    try {
      const response = await fetch(`http://localhost:3000/cv/public/contact`);
      if (!response.ok) throw new Error("Impossible de récupérer les coordonnées");
      const data = await response.json();
      setRevealed(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingContact(false);
    }
  }

  if (error) {
    return <p className="text-center text-red-500 py-20">{error}</p>;
  }

  if (!cv) {
    return <p className="text-center text-gray-500 py-20">Chargement...</p>;
  }

  const user = cv.user;

  return (
    <main data-theme="light" className="bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <article className="border border-blue-300 rounded-lg overflow-hidden">
          {/* Bandeau profil */}
          <header className="bg-gray-200 px-5 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-6 items-center md:items-center text-center md:text-left">
            <img
              src={
                user.avatar
                  ? `http://localhost:3000/${user.avatar}`
                  : "http://localhost:3000/uploads/1788435999097.jpeg"
              }
              alt={`Photo de profil de ${user.firstname} ${user.lastname}`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h1>

              <address className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 text-sm text-gray-700 not-italic">
                {revealed ? (
                  <>
                    {revealed.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} aria-hidden="true" />
                        <a href={`mailto:${revealed.email}`} className="break-all">
                          {revealed.email}
                        </a>
                      </span>
                    )}
                    {revealed.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} aria-hidden="true" />
                        <a href={`tel:${revealed.phone}`}>{revealed.phone}</a>
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={revealContact}
                    disabled={loadingContact}
                    className="text-emerald-700 underline text-sm cursor-pointer"
                  >
                    {loadingContact ? "Chargement..." : "Afficher les coordonnées"}
                  </button>
                )}

                {user.where && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} aria-hidden="true" /> {user.where}
                  </span>
                )}
              </address>

              <a
                href="/contact"
                className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none mt-4"
              >
                Contactez-moi
              </a>
            </div>
          </header>

          <div className="grid md:grid-cols-3">
            {/* Expériences */}
            <section
              aria-labelledby="experiences-heading"
              className="md:col-span-2 px-5 sm:px-8 py-6 border-t border-blue-200"
            >
              <h2
                id="experiences-heading"
                className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5"
              >
                <Briefcase size={18} aria-hidden="true" /> Expériences
              </h2>

              <ul className="space-y-6">
                {cv.experiences?.map((exp, i) => (
                  <li key={i}>
                    <article>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {exp.title}
                        </h3>
                        <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1 whitespace-nowrap w-fit">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        {exp.description}
                      </p>

                      {exp.tags?.length > 0 && (
                        <ul className="flex flex-wrap gap-2 mt-3">
                          {exp.tags.map((tag, j) => (
                            <li
                              key={j}
                              className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            </section>

            {/* Compétences + Langues */}
            <div className="border-t md:border-t-0 md:border-l border-blue-200 bg-gray-50">
              <section aria-labelledby="skills-heading" className="px-5 sm:px-6 py-6">
                <h2
                  id="skills-heading"
                  className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5"
                >
                  <Award size={18} aria-hidden="true" /> Compétences
                </h2>

                <ul className="space-y-4">
                  {cv.skills?.map((skill, i) => (
                    <li key={i}>
                      <p className="text-sm text-gray-800 mb-1">
                        {skill.name}
                      </p>
                      <div
                        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={skill.level}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Niveau en ${skill.name}`}
                      >
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="languages-heading"
                className="px-5 sm:px-6 py-6 border-t border-gray-200"
              >
                <h2
                  id="languages-heading"
                  className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5"
                >
                  <LanguagesIcon size={18} aria-hidden="true" /> Langues
                </h2>

                <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                  {cv.languages?.map((lang, i) => (
                    <li key={i} className="bg-white rounded-md p-3">
                      <p className="text-sm font-medium text-gray-900">
                        {lang.name}
                      </p>
                      {lang.label && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {lang.label}
                        </p>
                      )}
                      <div
                        className="flex gap-1 mt-2"
                        role="img"
                        aria-label={`Niveau ${lang.level} sur 6`}
                      >
                        {[0, 1, 2, 3, 4, 5].map((dot) => (
                          <span
                            key={dot}
                            aria-hidden="true"
                            className={`w-2 h-2 rounded-full ${dot < lang.level ? "bg-emerald-500" : "bg-gray-300"}`}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}