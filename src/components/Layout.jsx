import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">FinanzasGo</h1>
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
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
