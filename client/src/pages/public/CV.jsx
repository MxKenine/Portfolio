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

  if (error) {
    return <p className="text-center text-red-500 py-20">{error}</p>;
  }

  if (!cv) {
    return <p className="text-center text-gray-500 py-20">Chargement...</p>;
  }

  const user = cv.user; // infos de profil ramenées via populate côté backend

  return (
    <div data-theme="light" className=" bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="border border-blue-300 rounded-lg overflow-hidden">
          {/* Bandeau profil */}
          <div className="bg-gray-200 px-8 py-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              src={
                user.avatar
                  ? `http://localhost:3000/${user.avatar}`
                  : "http://localhost:3000/uploads/1788435999097.jpeg"
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover shrink-0"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstname} {user.lastname}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
                {user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {user.email}
                  </span>
                )}
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {user.phone}
                  </span>
                )}
                {user.where && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {user.where}
                  </span>
                )}
              </div>

              <a
                href="/contact"
                className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none mt-4"
              >
                Contactez-moi
              </a>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}