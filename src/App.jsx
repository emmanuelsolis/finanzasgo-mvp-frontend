import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Movimientos from "./pages/Movimientos.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas irán dentro de este Layout (después metemos auth real) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="movimientos" element={<Movimientos />} />
      </Route>

      {/* Cualquier ruta desconocida redirige al dashboard o login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
