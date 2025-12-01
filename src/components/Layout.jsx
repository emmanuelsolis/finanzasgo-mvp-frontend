import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import theme from "../styles/theme";

function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ) 
    },
    { 
      path: "/movimientos", 
      label: "Movimientos", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ) 
    },
    { 
      path: "/kpis", 
      label: "KPIs", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ) 
    },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: theme.colors.neutral[50] }}>
      {/* Sidebar */}
      <aside 
        className="w-64 flex flex-col transition-all duration-300"
        style={{
          background: `linear-gradient(180deg, ${theme.colors.neutral[900]} 0%, ${theme.colors.neutral[800]} 100%)`,
          boxShadow: theme.shadows.xl
        }}
      >
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center justify-center w-10 h-10 transition-transform duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%)`,
                borderRadius: theme.borderRadius.lg
              }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 
              className="font-bold text-white"
              style={{ 
                fontSize: theme.typography.sizes.xl,
                fontFamily: theme.typography.fontFamily.sans
              }}
            >
              FinanzasGo
            </h1>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div 
            className="mx-4 p-4 mb-6 transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: `${theme.colors.neutral[800]}`,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.neutral[700]}`
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="flex items-center justify-center w-10 h-10 text-white font-semibold"
                style={{
                  backgroundColor: theme.colors.primary[600],
                  borderRadius: theme.borderRadius.full
                }}
              >
                {user.email?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: theme.colors.neutral[400] }}
                >
                  Bienvenido
                </p>
                <p 
                  className="font-medium truncate"
                  style={{ 
                    color: theme.colors.neutral[100],
                    fontSize: theme.typography.sizes.sm
                  }}
                >
                  {user.email || user.username}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 transition-all duration-200 group"
                style={{
                  backgroundColor: isActive ? `${theme.colors.primary[600]}20` : 'transparent',
                  borderRadius: theme.borderRadius.lg,
                  borderLeft: isActive ? `3px solid ${theme.colors.primary[500]}` : '3px solid transparent',
                  color: isActive ? theme.colors.primary[400] : theme.colors.neutral[300]
                }}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <span 
                  className="font-medium"
                  style={{ fontSize: theme.typography.sizes.sm }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.error[600]} 0%, ${theme.colors.error[700]} 100%)`,
              borderRadius: theme.borderRadius.lg,
              color: 'white',
              fontSize: theme.typography.sizes.sm
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
