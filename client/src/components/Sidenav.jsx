import { Outlet, Link } from 'react-router-dom'

export default function AdminSideNav() {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-emerald-950 text-white p-5 flex flex-col gap-3">
                <h2 className="text-xl font-bold mb-5">Admin</h2>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/edit-profil">Profil</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="">Accueil</Link>
            </aside>
            <main className="flex-1 p-5 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}