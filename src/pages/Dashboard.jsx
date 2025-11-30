import { useAuth } from "../context/AuthContext";

/**
 * Dashboard Component
 * 
 * @codesyncer-context Main dashboard showing user info and financial metrics
 */
function Dashboard() {
  const { user } = useAuth();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card de ejemplo */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            KPIs de Marketing
          </h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Total registrados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            KPIs de Ventas
          </h3>
          <p className="text-3xl font-bold text-green-600">$0</p>
          <p className="text-sm text-gray-500 mt-1">Ingresos totales</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            OKRs Activos
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Objetivos en progreso</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚀 Próximas funcionalidades
        </h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Gráficas de KPIs en tiempo real</li>
          <li>Gestión de OKRs y seguimiento de objetivos</li>
          <li>Análisis de salud financiera</li>
          <li>Reportes descargables</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
