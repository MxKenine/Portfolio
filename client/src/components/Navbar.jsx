import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'

export default function Navbar() {

  const location = useLocation()
  const links = [
        { label: 'Accueil', path: '/' },
        { label: 'Contact', path: '/contact' },
        { label: 'Register', path: '/register' },
        { label: 'Login', path: '/login' },
        { label: 'Hotpot', path: '/hotpot' },
        { label: 'Dashboard', path: '/admin' },
        { label: 'Projets', path: '/projets' },
    ]

  return (
    <header className="bg-gray-100 px-6 md:px-12 py-5 grid grid-cols-3 items-center">
      <span className="text-xl font-semibold text-gray-900 justify-self-start">
        KenineCorp
    </span>
      <nav className="hidden md:flex items-center gap-8 text-gray-700">
       {links.map(link => {
                    const isActive = location.pathname === link.path
                    const linkClass = isActive
                        ? "text-gray-900 underline decoration-emerald-500 underline-offset-4"
                        : "hover:text-gray-900"

                    return <a key={link.path} href={link.path} className={linkClass}>{link.label}</a>
                })}
      </nav>
        <a
          href="/cv.pdf"
          download
          className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none btn-sm justify-self-end"
        >
          Télécharger CV
        </a>
    </header>
  );
}
