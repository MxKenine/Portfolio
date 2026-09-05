import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Package, Briefcase } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/profil", label: "Profil", icon: User },
  { to: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { to: "/admin/projets", label: "Projets", icon: Package },
];

export default function AdminSideNav() {
  const location = useLocation();

  return (
    <div data-theme="light" className="flex h-screen">
      <aside className="w-64 bg-gray-200 flex flex-col p-4">
        <div className="mb-8 mt-2">
          <Link to="/">
          <h1 className="text-2xl font-bold text-gray-900">KenineCorp</h1>
          </Link>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-400/50 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>©</span>
          <span className="font-semibold">KenineCorp</span>
        </div>
      </aside>

      <main className="flex-1 p-5 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}