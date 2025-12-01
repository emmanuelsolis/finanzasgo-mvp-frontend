import { useState, useEffect } from "react";
import api from "../api/axiosClient";

function KPIs() {
  const [activeTab, setActiveTab] = useState("marketing");
  const [kpisData, setKpisData] = useState({
    marketing: [],
    ventas: [],
    finanzas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form data para cada tipo de KPI
  const [formData, setFormData] = useState({
    marketing: {
      periodo_id: "",
      leads_generados: "",
      tasa_conversion: "",
      costo_adquisicion_cliente: "",
      retorno_inversion_publicidad: "",
      gasto_marketing: ""
    },
    ventas: {
      periodo_id: "",
      ingresos_totales: "",
      numero_ventas: "",
      ticket_promedio: "",
      tasa_cierre: "",
      ciclo_ventas_dias: ""
    },
    finanzas: {
      periodo_id: "",
      ingresos: "",
      gastos: "",
      margen_contribucion: "",
      ebitda: "",
      roi: "",
      burn_rate: "",
      cash_runway_meses: ""
    }
  });

  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    fetchPeriodos();
    fetchAllKPIs();
  }, []);

  // Cerrar formulario cuando cambia el tab
  useEffect(() => {
    setShowForm(false);
  }, [activeTab]);

  const fetchPeriodos = async () => {
    try {
      const response = await api.get("/periodos/");
      console.log("Periodos cargados:", response.data);
      setPeriodos(response.data);
    } catch (err) {
      console.error("Error fetching periodos:", err);
    }
  };

  const fetchAllKPIs = async () => {
    try {
      setLoading(true);
      const [marketingRes, ventasRes, finanzasRes] = await Promise.all([
        api.get("/kpis/marketing/"),
        api.get("/kpis/ventas/"),
        api.get("/kpis/finanzas/")
      ]);
      
      setKpisData({
        marketing: marketingRes.data,
        ventas: ventasRes.data,
        finanzas: finanzasRes.data
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching KPIs:", err);
      setError("Error al cargar los KPIs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData[activeTab] };
      
      // Convertir strings a números
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key]) {
          dataToSend[key] = key === 'periodo_id' ? parseInt(dataToSend[key]) : parseFloat(dataToSend[key]);
        }
      });

      await api.post(`/kpis/${activeTab}/`, dataToSend);
      
      fetchAllKPIs();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving KPI:", err);
      alert("Error al guardar el KPI");
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      [activeTab]: activeTab === "marketing" 
        ? { periodo_id: "", leads_generados: "", tasa_conversion: "", costo_adquisicion_cliente: "", retorno_inversion_publicidad: "", gasto_marketing: "" }
        : activeTab === "ventas"
        ? { periodo_id: "", ingresos_totales: "", numero_ventas: "", ticket_promedio: "", tasa_cierre: "", ciclo_ventas_dias: "" }
        : { periodo_id: "", ingresos: "", gastos: "", margen_contribucion: "", ebitda: "", roi: "", burn_rate: "", cash_runway_meses: "" }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [activeTab]: {
        ...formData[activeTab],
        [field]: value
      }
    });
  };

  const getCurrentKPIs = () => kpisData[activeTab] || [];

  const renderFormFields = () => {
    switch (activeTab) {
      case "marketing":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leads Generados *</label>
              <input
                type="number"
                value={formData.marketing.leads_generados}
                onChange={(e) => handleInputChange("leads_generados", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de Conversión (%) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.marketing.tasa_conversion}
                onChange={(e) => handleInputChange("tasa_conversion", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo Adquisición Cliente ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.marketing.costo_adquisicion_cliente}
                onChange={(e) => handleInputChange("costo_adquisicion_cliente", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retorno Inversión Publicidad ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.marketing.retorno_inversion_publicidad}
                onChange={(e) => handleInputChange("retorno_inversion_publicidad", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gasto Marketing ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.marketing.gasto_marketing}
                onChange={(e) => handleInputChange("gasto_marketing", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </>
        );
      case "ventas":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos Totales ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.ventas.ingresos_totales}
                onChange={(e) => handleInputChange("ingresos_totales", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Ventas *</label>
              <input
                type="number"
                value={formData.ventas.numero_ventas}
                onChange={(e) => handleInputChange("numero_ventas", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Promedio ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.ventas.ticket_promedio}
                onChange={(e) => handleInputChange("ticket_promedio", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de Cierre (%) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.ventas.tasa_cierre}
                onChange={(e) => handleInputChange("tasa_cierre", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciclo de Ventas (días) *</label>
              <input
                type="number"
                value={formData.ventas.ciclo_ventas_dias}
                onChange={(e) => handleInputChange("ciclo_ventas_dias", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </>
        );
      case "finanzas":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.finanzas.ingresos}
                onChange={(e) => handleInputChange("ingresos", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gastos ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.finanzas.gastos}
                onChange={(e) => handleInputChange("gastos", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margen Contribución ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.finanzas.margen_contribucion}
                onChange={(e) => handleInputChange("margen_contribucion", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">EBITDA ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.finanzas.ebitda}
                onChange={(e) => handleInputChange("ebitda", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ROI (%) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.finanzas.roi}
                onChange={(e) => handleInputChange("roi", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Burn Rate ($/mes) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.finanzas.burn_rate}
                onChange={(e) => handleInputChange("burn_rate", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cash Runway (meses) *</label>
              <input
                type="number"
                value={formData.finanzas.cash_runway_meses}
                onChange={(e) => handleInputChange("cash_runway_meses", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case "marketing":
        return (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversión %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CAC</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROAS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gasto Mkt</th>
          </>
        );
      case "ventas":
        return (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Ventas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Prom.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cierre %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciclo (d)</th>
          </>
        );
      case "finanzas":
        return (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gastos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mrg.Contrib</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EBITDA</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Burn Rate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Runway</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (kpi) => {
    switch (activeTab) {
      case "marketing":
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.leads_generados}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.tasa_conversion}%</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.costo_adquisicion_cliente}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.retorno_inversion_publicidad?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.gasto_marketing?.toLocaleString()}</td>
          </>
        );
      case "ventas":
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.ingresos_totales?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.numero_ventas}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.ticket_promedio}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.tasa_cierre}%</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.ciclo_ventas_dias}</td>
          </>
        );
      case "finanzas":
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.ingresos?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.gastos?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.margen_contribucion?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.ebitda?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.roi}%</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${kpi.burn_rate?.toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.cash_runway_meses}m</td>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando KPIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">KPIs</h2>
        <p className="text-gray-600">Gestiona tus indicadores clave de rendimiento</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("marketing")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "marketing"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Marketing
          </button>
          <button
            onClick={() => setActiveTab("ventas")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "ventas"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Ventas
          </button>
          <button
            onClick={() => setActiveTab("finanzas")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "finanzas"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Finanzas
          </button>
        </nav>
      </div>

      {/* Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {showForm ? "Cancelar" : "+ Nuevo KPI"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">Nuevo KPI de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Periodo *</label>
              <select
                value={formData[activeTab].periodo_id}
                onChange={(e) => handleInputChange("periodo_id", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Selecciona un periodo</option>
                {periodos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {renderFormFields()}

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
              {renderTableHeaders()}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getCurrentKPIs().length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No hay KPIs registrados. ¡Crea tu primer KPI!
                </td>
              </tr>
            ) : (
              getCurrentKPIs().map((kpi) => (
                <tr key={kpi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kpi.periodo_id}</td>
                  {renderTableRow(kpi)}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(kpi.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KPIs;
