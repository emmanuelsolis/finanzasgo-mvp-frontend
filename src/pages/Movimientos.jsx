import { useState, useEffect } from "react";
import api from "../api/axiosClient";

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [resumen, setResumen] = useState(null);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    tipo: "ingreso",
    categoria: "",
    descripcion: "",
    monto: "",
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchMovimientos();
    fetchResumen();
  }, [filtroTipo]);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const params = filtroTipo ? { tipo: filtroTipo } : {};
      const response = await api.get("/movimientos/", { params });
      setMovimientos(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching movimientos:", err);
      setError("Error al cargar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  const fetchResumen = async () => {
    try {
      const response = await api.get("/movimientos/estadisticas/resumen");
      setResumen(response.data);
    } catch (err) {
      console.error("Error fetching resumen:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        monto: parseFloat(formData.monto),
        fecha: new Date(formData.fecha).toISOString()
      };

      if (editingId) {
        await api.put(`/movimientos/${editingId}`, dataToSend);
      } else {
        await api.post("/movimientos/", dataToSend);
      }

      fetchMovimientos();
      fetchResumen();
      resetForm();
    } catch (err) {
      console.error("Error saving movimiento:", err);
      alert("Error al guardar el movimiento");
    }
  };

  const handleEdit = (movimiento) => {
    setFormData({
      tipo: movimiento.tipo,
      categoria: movimiento.categoria,
      descripcion: movimiento.descripcion || "",
      monto: movimiento.monto,
      fecha: new Date(movimiento.fecha).toISOString().split('T')[0]
    });
    setEditingId(movimiento.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este movimiento?")) return;
    
    try {
      await api.delete(`/movimientos/${id}`);
      fetchMovimientos();
      fetchResumen();
    } catch (err) {
      console.error("Error deleting movimiento:", err);
      alert("Error al eliminar el movimiento");
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: "ingreso",
      categoria: "",
      descripcion: "",
      monto: "",
      fecha: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando movimientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Movimientos</h2>
        <p className="text-gray-600">
          Gestiona tus ingresos y egresos
        </p>
      </div>

      {/* Resumen */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">Ingresos</p>
            <p className="text-2xl font-bold text-green-700">
              ${resumen.ingresos_totales?.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium">Egresos</p>
            <p className="text-2xl font-bold text-red-700">
              ${resumen.egresos_totales?.toLocaleString()}
            </p>
          </div>
          <div className={`p-4 rounded-lg border ${resumen.balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-sm font-medium ${resumen.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              Balance
            </p>
            <p className={`text-2xl font-bold ${resumen.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              ${resumen.balance?.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-700">
              {resumen.total_movimientos}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filtrar:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="egreso">Egresos</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancelar" : "+ Nuevo Movimiento"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Editar Movimiento" : "Nuevo Movimiento"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Salario, Renta, Servicios"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Detalles adicionales (opcional)"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hay movimientos registrados. ¡Crea tu primer movimiento!
                  </td>
                </tr>
              ) : (
                movimientos.map((mov) => (
                  <tr key={mov.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(mov.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mov.tipo === 'ingreso' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {mov.tipo === 'ingreso' ? '↑ Ingreso' : '↓ Egreso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mov.categoria}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {mov.descripcion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                        ${mov.monto.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(mov)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(mov.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Movimientos;
