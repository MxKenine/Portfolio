import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  // Boutons de la navBar dans l'ordre d'affichage
  const location = useLocation();
  const links = [
    { label: "Accueil", path: "/" },
    { label: "CV", path: "/cv" },
    { label: "Projets", path: "/projets" },
    { label: "Contact", path: "/contact" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
    { label: "Dashboard", path: "/admin" },
  ];

  return (
    // Structure du Nav Conteiner en trois
    <header className="bg-gray-100 px-6 md:px-12 py-5 grid grid-cols-3 items-center">
      {/* Logo */}
      <span className="text-xl font-semibold text-gray-900 justify-self-start">
        KenineCorp
      </span>

      {/* Génaration des liens de manière dynamique  */}
      <nav className="flex items-center gap-8 text-gray-700">
        {links.map((link) => {
          // compare la position et la page actuel pour, souligner la position, simplement hover
          const isActive = location.pathname === link.path;
          const linkClass = isActive
            ? "text-gray-900 underline decoration-emerald-500 decoration-2 underline-offset-5"
            : "hover:text-emerald-600";

          return (
            <Link key={link.path} to={link.path} className={linkClass}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <a
        to="/cv.pdf"
        download
        className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none btn-sm justify-self-end"
      >
        Télécharger CV
      </a>
    </header>
  );
}
