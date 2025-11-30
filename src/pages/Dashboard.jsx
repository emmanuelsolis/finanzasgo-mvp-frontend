import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Financiero
        </h2>
        <p className="text-gray-600">
          Bienvenido, {user?.email || 'Usuario'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPIs Marketing */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            KPIs de Marketing
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {stats.totalKPIsMarketing}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total registrados</p>
          {stats.latestKPIs?.marketing && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Último: Leads {stats.latestKPIs.marketing.leads_generados || 0}
              </p>
            </div>
          )}
        </div>

        {/* KPIs Ventas */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            KPIs de Ventas
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalKPIsVentas}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total registrados</p>
          {stats.latestKPIs?.ventas && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Último: ${stats.latestKPIs.ventas.ingresos_totales?.toLocaleString() || 0}
              </p>
            </div>
          )}
        </div>

        {/* OKRs */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            OKRs Activos
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalOKRs}
          </p>
          <p className="text-sm text-gray-500 mt-1">Objetivos en progreso</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            📊 KPIs Financieros
          </h3>
          <p className="text-3xl font-bold text-purple-700">
            {stats.totalKPIsFinanzas}
          </p>
          <p className="text-sm text-purple-700 mt-1">Registros totales</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            📅 Periodos
          </h3>
          <p className="text-3xl font-bold text-amber-700">
            {stats.totalPeriodos}
          </p>
          <p className="text-sm text-amber-700 mt-1">Periodos configurados</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Estado del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium">✅ Sistema conectado</p>
            <p className="text-xs text-blue-600">Todos los endpoints funcionando correctamente</p>
          </div>
          <div>
            <p className="font-medium">📈 Datos en tiempo real</p>
            <p className="text-xs text-blue-600">Dashboard actualizado automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
