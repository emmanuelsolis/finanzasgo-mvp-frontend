# FinanzasGo MVP - Frontend

Frontend de la aplicación FinanzasGo desarrollado con React + Vite + Tailwind CSS.

## 🚀 Tecnologías

- **React 18.3.1** - Biblioteca de UI
- **Vite 6.0.11** - Build tool y dev server
- **Tailwind CSS 3.4.0** - Framework de CSS
- **React Router DOM 7.9.6** - Enrutamiento
- **Axios 1.13.2** - Cliente HTTP para consumir la API

## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── axiosClient.js       # Cliente Axios configurado
├── components/
│   └── Layout.jsx           # Layout principal con sidebar
├── pages/
│   ├── Login.jsx            # Página de inicio de sesión
│   ├── Dashboard.jsx        # Dashboard principal
│   └── Movimientos.jsx      # Página de movimientos
├── hooks/                   # Custom hooks (futuro useAuth)
├── App.jsx                  # Configuración de rutas
├── main.jsx                 # Punto de entrada
└── index.css                # Estilos con Tailwind
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install
```

## 💻 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:5173/`

## 🧪 Probar la Aplicación

1. **Dashboard** - `/` o `http://localhost:5173/`
2. **Movimientos** - `/movimientos`
3. **Login** - `/login`

## 🏗️ Build para Producción

```bash
# Generar build optimizado
npm run build

# Previsualizar el build
npm run preview
```

## 📝 Configuración

### API Backend

El cliente Axios está configurado para conectarse a:
```
http://localhost:8000
```

Para cambiar la URL, edita: `src/api/axiosClient.js`

## 🎨 Estilos

Usa Tailwind CSS para todos los estilos. Configuración en:
- `tailwind.config.js`
- `postcss.config.js`

## 🔄 Próximas Features

- [ ] Autenticación JWT completa
- [ ] Protección de rutas privadas
- [ ] CRUD de movimientos conectado a API
- [ ] Dashboard con gráficas (Chart.js)
- [ ] Gestión de perfil de usuario
