# FinanzasGo MVP - Frontend

Aplicación web React para visualización de KPIs financieros y gestión de OKRs.

## 🚀 Tech Stack

- **React**: 18.3.1
- **Vite**: 6.0.11
- **React Router**: 7.9.6
- **Axios**: 1.13.2
- **Tailwind CSS**: 3.4.0
- **PostCSS**: Latest

## 🛠️ Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/finanzasgo-mvp-frontend.git
cd finanzasgo-mvp-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar backend
Asegúrate de que el backend esté corriendo en `http://localhost:8000`

Ver: [finanzasgo-mvp backend](https://github.com/emmanuelsolis/finanzasgo-mvp)

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```

**Aplicación disponible en**: http://localhost:5173

## 🔑 Credenciales de Prueba

```
Email: admin@test.com
Password: admin123
```

## 📁 Estructura

```
src/
├── App.jsx              # Configuración de rutas
├── main.jsx             # Entry point
├── components/
│   ├── Layout.jsx       # Layout principal
│   └── ProtectedRoute.jsx  # Guard de rutas privadas
├── pages/
│   ├── Login.jsx        # Página de login
│   ├── Register.jsx     # Página de registro
│   ├── Dashboard.jsx    # Dashboard principal
│   └── Movimientos.jsx  # Movimientos financieros
├── context/
│   └── AuthContext.jsx  # Estado global de autenticación
└── api/
    └── axiosClient.js   # Cliente HTTP con interceptors
```

## 🎨 Características

- ✅ Autenticación JWT con login/registro
- ✅ Rutas protegidas con ProtectedRoute
- ✅ Manejo automático de tokens (interceptors)
- ✅ Logout automático en token expirado (401)
- ✅ UI moderna con Tailwind CSS
- ✅ Validación de formularios client-side
- ✅ Mensajes de error claros

## 🔐 Autenticación

### Flujo de Login

1. Usuario envía credenciales a `/auth/login`
2. Backend devuelve JWT token
3. Token se guarda en `localStorage`
4. Token se envía automáticamente en todas las peticiones
5. Si token expira (401), usuario es redirigido a login

### Ejemplo de Petición Protegida

```javascript
import api from './api/axiosClient';

// El token se agrega automáticamente
const response = await api.get('/periodos/');
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## 🎨 Tailwind CSS

El proyecto usa Tailwind CSS 3.4.0 con PostCSS.

### Configuración

- `tailwind.config.js` - Configuración de Tailwind
- `postcss.config.js` - Configuración de PostCSS
- `src/index.css` - Importa las directivas de Tailwind

## 📦 Build para Producción

```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/`.

## 🌐 Variables de Entorno

Crea un archivo `.env` si necesitas configurar URLs:

```env
VITE_API_URL=http://localhost:8000
```

Luego úsala en el código:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 🧪 Testing

```bash
# Instalar dependencias de testing
npm install -D vitest @testing-library/react

# Ejecutar tests
npm run test
```

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feature/nueva-feature`
2. Commit: `git commit -m "feat: añadir nueva feature"`
3. Push: `git push origin feature/nueva-feature`
4. Crea un Pull Request

## 📄 Licencia

Privado y confidencial.

## 👥 Autor

Emmanuel Solis - [@emmanuelsolis](https://github.com/emmanuelsolis)

---

**Versión**: 1.0.0  
**Última actualización**: 30 de noviembre de 2025
