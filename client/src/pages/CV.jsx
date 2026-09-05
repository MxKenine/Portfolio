import { useEffect, useState } from "react";
import {
  Briefcase,
  Award,
  Languages as LanguagesIcon,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

export default function CV() {
  const [user, setUser] = useState(null);
  const [cv, setCv] = useState(null);
  const [revealed, setRevealed] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [error, setError] = useState(null);

  async function getData() {
    try {
      const [usersRes, cvsRes] = await Promise.all([
        fetch(`http://localhost:3000/members`),
        fetch(`http://localhost:3000/cvs`),
      ]);
      if (!usersRes.ok || !cvsRes.ok) throw new Error("Erreur de chargement");

      const usersData = await usersRes.json();
      const cvsData = await cvsRes.json();

      setUser(usersData.users[0] || null);
      setCv(cvsData.cvs[0] || null);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  async function revealContact() {
    if (!user) return;
    setLoadingContact(true);
    try {
      const response = await fetch(
        `http://localhost:3000/members/${user._id}/contact`,
      );
      if (!response.ok)
        throw new Error("Impossible de récupérer les coordonnées");
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

  if (!user) {
    return <p className="text-center text-gray-500 py-20">Chargement...</p>;
  }

  return (
    <div data-theme="light" className=" bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="border border-blue-300 rounded-lg overflow-hidden">
          {/* Bandeau profil */}
          <div className="bg-gray-200 px-8 py-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              src="http://localhost:3000/uploads/1788435999097.jpeg"
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover shrink-0"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h1>
              {cv?.title && (
                <p className="mt-1 text-lg text-gray-800">{cv.title}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                {revealed ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} /> {revealed.email}
                    </span>
                    {revealed.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} /> {revealed.phone}
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    onClick={revealContact}
                    disabled={loadingContact}
                    className="text-emerald-700 underline text-sm"
                  >
                    {loadingContact
                      ? "Chargement..."
                      : "Afficher les coordonnées"}
                  </button>
                )}

                {user.where && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {user.where}
                  </span>
                )}

                {cv?.links?.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 underline"
                  >
                    <LinkIcon size={14} /> {link.replace(/^https?:\/\//, "")}
                  </a>
                ))}
              </div>

              <a
                href="/contact"
                className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none mt-4"
              >
                Contactez-moi
              </a>
            </div>
          </div>

          {!cv ? (
            <p className="text-center text-gray-400 text-sm py-8">
              Aucun CV renseigné pour le moment.
            </p>
          ) : (
            <div className="grid md:grid-cols-3">
              {/* Expériences */}
              <div className="md:col-span-2 px-8 py-6 border-t border-blue-200">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5">
                  <Briefcase size={18} /> Expériences
                </h2>

                <div className="space-y-6">
                  {cv.experiences?.map((exp, i) => (
                    <div key={i}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {exp.title}
                        </h3>
                        <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1 whitespace-nowrap">
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
                        <div className="flex flex-wrap gap-2 mt-3">
                          {exp.tags.map((tag, j) => (
                            <span
                              key={j}
                              className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compétences + Langues */}
              <div className="border-t md:border-t-0 md:border-l border-blue-200 bg-gray-50">
                <div className="px-6 py-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5">
                    <Award size={18} /> Compétences
                  </h2>

                  <div className="space-y-4">
                    {cv.skills?.map((skill, i) => (
                      <div key={i}>
                        <p className="text-sm text-gray-800 mb-1">
                          {skill.name}
                        </p>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-6 border-t border-gray-200">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5">
                    <LanguagesIcon size={18} /> Langues
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {cv.languages?.map((lang, i) => (
                      <div key={i} className="bg-white rounded-md p-3">
                        <p className="text-sm font-medium text-gray-900">
                          {lang.name}
                        </p>
                        {lang.label && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {lang.label}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2">
                          {[0, 1, 2, 3, 4, 5].map((dot) => (
                            <span
                              key={dot}
                              className={`w-2 h-2 rounded-full ${dot < lang.level ? "bg-emerald-500" : "bg-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
