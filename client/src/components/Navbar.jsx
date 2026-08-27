import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='flex justify-end'>
    <ul className='flex justify-around w-5/6 pt-4'>
    <li>
        <Link to="/accueil">Accueil</Link>
    </li>
    <li>
        <Link to="/register">Register</Link>
    </li>
    <li>
        <Link to="/login">Login</Link>
    </li>
    </ul>
    </nav>
  )
}
