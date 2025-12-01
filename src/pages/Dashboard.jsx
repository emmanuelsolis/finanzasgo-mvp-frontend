import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";
import theme from "../styles/theme";

/**
 * Dashboard Component
 * 
 * @codesyncer-context Main dashboard showing user info and financial metrics
 */
function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalKPIsMarketing: 0,
    totalKPIsVentas: 0,
    totalKPIsFinanzas: 0,
    totalOKRs: 0,
    totalPeriodos: 0,
    latestKPIs: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hacer peticiones en paralelo
        const [
          kpisMarketingRes,
          kpisVentasRes,
          kpisFinanzasRes,
          okrsRes,
          periodosRes
        ] = await Promise.all([
          api.get("/kpis/marketing/"),
          api.get("/kpis/ventas/"),
          api.get("/kpis/finanzas/"),
          api.get("/okrs/objetivos"),
          api.get("/periodos/")
        ]);

        // Calcular totales
        const marketingData = kpisMarketingRes.data;
        const ventasData = kpisVentasRes.data;
        const finanzasData = kpisFinanzasRes.data;

        setStats({
          totalKPIsMarketing: marketingData.length,
          totalKPIsVentas: ventasData.length,
          totalKPIsFinanzas: finanzasData.length,
          totalOKRs: okrsRes.data.length,
          totalPeriodos: periodosRes.data.length,
          latestKPIs: {
            marketing: marketingData[marketingData.length - 1] || null,
            ventas: ventasData[ventasData.length - 1] || null,
            finanzas: finanzasData[finanzasData.length - 1] || null
          }
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto"
            style={{ borderColor: theme.colors.primary[600] }}
          ></div>
          <p 
            className="mt-6 font-medium"
            style={{ 
              color: theme.colors.neutral[600],
              fontSize: theme.typography.sizes.lg
            }}
          >
            Cargando dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="p-6 transition-all duration-300"
        style={{
          backgroundColor: theme.colors.error[50],
          borderLeft: `4px solid ${theme.colors.error[500]}`,
          borderRadius: theme.borderRadius.lg
        }}
      >
        <div className="flex items-start space-x-3">
          <svg 
            className="w-6 h-6 flex-shrink-0 mt-0.5" 
            style={{ color: theme.colors.error[600] }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 
              className="font-semibold mb-1"
              style={{ 
                fontSize: theme.typography.sizes.lg,
                color: theme.colors.error[900]
              }}
            >
              Error
            </h3>
            <p style={{ color: theme.colors.error[700], fontSize: theme.typography.sizes.sm }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, gradient, latestInfo }) => (
    <div 
      className="group p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        background: 'white',
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.md,
        border: `1px solid ${theme.colors.neutral[200]}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.xl;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 
            className="font-semibold mb-1"
            style={{ 
              color: theme.colors.neutral[700],
              fontSize: theme.typography.sizes.base
            }}
          >
            {title}
          </h3>
          <p 
            className="font-bold transition-all duration-300"
            style={{ 
              fontSize: theme.typography.sizes['3xl'],
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {value}
          </p>
        </div>
        <div 
          className="flex items-center justify-center w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{
            background: gradient,
            borderRadius: theme.borderRadius.xl,
            opacity: 0.9
          }}
        >
          {icon}
        </div>
      </div>
      <p 
        className="mb-2"
        style={{ 
          color: theme.colors.neutral[500],
          fontSize: theme.typography.sizes.sm
        }}
      >
        {subtitle}
      </p>
      {latestInfo && (
        <div 
          className="pt-3 mt-3"
          style={{ 
            borderTop: `1px solid ${theme.colors.neutral[200]}`
          }}
        >
          <p 
            style={{ 
              color: theme.colors.neutral[600],
              fontSize: theme.typography.sizes.xs
            }}
          >
            {latestInfo}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="font-bold mb-2"
          style={{ 
            fontSize: theme.typography.sizes['3xl'],
            color: theme.colors.neutral[900],
            fontFamily: theme.typography.fontFamily.sans
          }}
        >
          Dashboard Financiero
        </h1>
        <p style={{ color: theme.colors.neutral[600], fontSize: theme.typography.sizes.base }}>
          Bienvenido, <span className="font-semibold">{user?.email || 'Usuario'}</span>
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="KPIs de Marketing"
          value={stats.totalKPIsMarketing}
          subtitle="Total registrados"
          gradient={`linear-gradient(135deg, ${theme.colors.secondary[500]} 0%, ${theme.colors.secondary[700]} 100%)`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          }
          latestInfo={
            stats.latestKPIs?.marketing 
              ? `Último: ${stats.latestKPIs.marketing.leads_generados || 0} leads generados`
              : 'Sin registros recientes'
          }
        />

        <StatCard
          title="KPIs de Ventas"
          value={stats.totalKPIsVentas}
          subtitle="Total registrados"
          gradient={`linear-gradient(135deg, ${theme.colors.success[500]} 0%, ${theme.colors.success[700]} 100%)`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          latestInfo={
            stats.latestKPIs?.ventas 
              ? `Último: $${stats.latestKPIs.ventas.ingresos_totales?.toLocaleString() || 0} ingresos`
              : 'Sin registros recientes'
          }
        />

        <StatCard
          title="OKRs Activos"
          value={stats.totalOKRs}
          subtitle="Objetivos en progreso"
          gradient={`linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[700]} 100%)`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
      </div>

      {/* Secondary Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          className="p-6 transition-all duration-300 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.secondary[50]} 100%)`,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.primary[200]}`
          }}
        >
          <div className="flex items-start space-x-4">
            <div 
              className="flex items-center justify-center w-14 h-14"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.secondary[600]} 100%)`,
                borderRadius: theme.borderRadius.xl
              }}
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 
                className="font-semibold mb-2"
                style={{ 
                  fontSize: theme.typography.sizes.lg,
                  color: theme.colors.primary[900]
                }}
              >
                KPIs Financieros
              </h3>
              <p 
                className="font-bold mb-1"
                style={{ 
                  fontSize: theme.typography.sizes['2xl'],
                  color: theme.colors.primary[700]
                }}
              >
                {stats.totalKPIsFinanzas}
              </p>
              <p style={{ color: theme.colors.primary[700], fontSize: theme.typography.sizes.sm }}>
                Registros totales
              </p>
            </div>
          </div>
        </div>

        <div 
          className="p-6 transition-all duration-300 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.warning[50]} 0%, ${theme.colors.warning[100]} 100%)`,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.warning[300]}`
          }}
        >
          <div className="flex items-start space-x-4">
            <div 
              className="flex items-center justify-center w-14 h-14"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.warning[500]} 0%, ${theme.colors.warning[600]} 100%)`,
                borderRadius: theme.borderRadius.xl
              }}
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 
                className="font-semibold mb-2"
                style={{ 
                  fontSize: theme.typography.sizes.lg,
                  color: theme.colors.warning[900]
                }}
              >
                Periodos
              </h3>
              <p 
                className="font-bold mb-1"
                style={{ 
                  fontSize: theme.typography.sizes['2xl'],
                  color: theme.colors.warning[700]
                }}
              >
                {stats.totalPeriodos}
              </p>
              <p style={{ color: theme.colors.warning[700], fontSize: theme.typography.sizes.sm }}>
                Periodos configurados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div 
        className="p-6 transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: theme.colors.success[50],
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.success[200]}`
        }}
      >
        <div className="flex items-start space-x-4">
          <div 
            className="flex items-center justify-center w-12 h-12 flex-shrink-0"
            style={{
              backgroundColor: theme.colors.success[500],
              borderRadius: theme.borderRadius.full
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 
              className="font-semibold mb-3"
              style={{ 
                fontSize: theme.typography.sizes.lg,
                color: theme.colors.success[900]
              }}
            >
              Estado del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.colors.success[500] }}
                ></div>
                <div>
                  <p 
                    className="font-medium"
                    style={{ 
                      color: theme.colors.success[800],
                      fontSize: theme.typography.sizes.sm
                    }}
                  >
                    Sistema conectado
                  </p>
                  <p style={{ color: theme.colors.success[600], fontSize: theme.typography.sizes.xs }}>
                    Todos los endpoints funcionando
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.colors.success[500] }}
                ></div>
                <div>
                  <p 
                    className="font-medium"
                    style={{ 
                      color: theme.colors.success[800],
                      fontSize: theme.typography.sizes.sm
                    }}
                  >
                    Datos en tiempo real
                  </p>
                  <p style={{ color: theme.colors.success[600], fontSize: theme.typography.sizes.xs }}>
                    Dashboard actualizado automáticamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
