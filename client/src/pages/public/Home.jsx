import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <main className="flex min-h-full bg-white">
      <div className="flex justify-center mx-auto px-6 py-12 md:py-32">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Colonne avatar : passe en premier sur mobile */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <img
              src={`${import.meta.env.VITE_BACK_URL}uploads/1788435999097.jpeg`}
              alt="Avatar"
              className="w-48 h-48 md:w-72 md:h-72 rounded-full object-cover shadow-lg"
            />
          </div>

          <div className="flex flex-col order-2 md:order-1 text-center md:text-left items-center md:items-start">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Disponible pour de nouvelles opportunités
            </span>

            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Quentin DUPREY
            </h1>

            <p className="mt-4 text-xl md:text-2xl text-gray-800 leading-snug">
              Développeur Full Stack |<br />
              Web et Web Mobile
            </p>

            <p className="mt-6 text-gray-600 leading-relaxed max-w-md">
              En formation de Développeur Web/Web Mobile, avec pour objectif
              d'évoluer vers la Conception d'Applications. Passionné par
              l'innovation et la créativité, je souhaite concevoir des outils
              ergonomiques et intelligents, accessibles aux entreprises comme
              aux particuliers, pour s'adapter à un monde en constante
              évolution.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/projets"
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
              >
                Voir mes projets
              </Link>
              <Link
                to="/contact"
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none"
              >
                Contactez-moi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}