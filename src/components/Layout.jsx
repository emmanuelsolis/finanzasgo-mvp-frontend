import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-6">FinanzasGo</h1>
          
          {user && (
            <div className="mb-6 pb-6 border-b border-slate-700">
              <p className="text-sm text-slate-300">Bienvenido</p>
              <p className="font-medium">{user.email || user.username}</p>
            </div>
          )}

          <nav className="space-y-2">
            <Link to="/" className="block hover:bg-slate-700 rounded px-3 py-2">
              Dashboard
            </Link>
            <Link
              to="/movimientos"
              className="block hover:bg-slate-700 rounded px-3 py-2"
            >
              Movimientos
            </Link>
            <Link
              to="/kpis"
              className="block hover:bg-slate-700 rounded px-3 py-2"
            >
              KPIs
            </Link>
          </nav>
        </div>

        {/* Botón de logout al final */}
        <button
          onClick={logout}
          className="mt-auto w-full bg-red-600 hover:bg-red-700 rounded px-3 py-2 font-medium"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
