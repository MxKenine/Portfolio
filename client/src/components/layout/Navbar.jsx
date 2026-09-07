import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Accueil", path: "/" },
    { label: "CV", path: "/cv" },
    { label: "Projets", path: "/projets" },
    { label: "Contact", path: "/contact" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
    { label: "Dashboard", path: "/admin" },
  ];

  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-gray-900 underline decoration-emerald-500 decoration-2 underline-offset-5"
      : "hover:text-emerald-600";

  return (
    <header className="bg-gray-100 px-6 md:px-12 py-5">
      {/* Ligne principale */}
      <div className="grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Logo */}
        <span className="text-xl font-semibold text-gray-900 justify-self-start">
          KenineCorp
        </span>

        {/* Nav desktop, caché en mobile */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-gray-700">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className={getLinkClass(link.path)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bouton CV, caché en mobile */}
        <a
          href="/cv.pdf"
          download
          className="hidden md:inline-flex btn bg-emerald-500 hover:bg-emerald-600 text-white border-none btn-sm justify-self-end"
        >
          Télécharger CV
        </a>

        {/* Bouton burger, visible seulement en mobile */}
        <button
          className="md:hidden justify-self-end"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <nav className="md:hidden flex flex-col gap-4 mt-4 text-gray-700">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={getLinkClass(link.path)}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <a
            href="/cv.pdf"
            download
            className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none btn-sm w-fit"
          >
            Télécharger CV
          </a>
        </nav>
      )}
    </header>
  );
}