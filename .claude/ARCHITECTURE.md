# ARCHITECTURE.md

> **Auto-Generated Documentation** - Project structure and statistics
>
> Created: 2025-11-30
> Last Updated: 2025-11-30

---

## 📁 Project Structure

```
finanzasgo-mvp-frontend/
├── src/
│   ├── main.jsx                     # React entry point with BrowserRouter
│   ├── App.jsx                      # Main app with routing configuration
│   ├── index.css                    # Global styles with Tailwind directives
│   ├── components/
│   │   ├── Layout.jsx               # Main layout with sidebar navigation
│   │   └── ProtectedRoute.jsx      # HOC for route protection
│   ├── pages/
│   │   ├── Login.jsx                # Login page with authentication
│   │   ├── Dashboard.jsx            # Main dashboard
│   │   └── Movimientos.jsx          # Transactions/Movements page
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication state management
│   ├── api/
│   │   └── axiosClient.js           # Axios instance with JWT interceptors
│   └── hooks/
│       └── .gitkeep                 # Placeholder for custom hooks
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── package.json                     # Dependencies and scripts
└── README.md
```

**Update**: Auto-updated on 2025-11-30

---

## 📊 Project Statistics

- **Total Files**: 23
- **JavaScript/JSX Files**: 11
- **Configuration Files**: 5
- **Components**: 2
- **Pages**: 3
- **Context Providers**: 1

**Update**: Refreshed on 2025-11-30

---

## 🔍 Comment Tag Statistics

- `@codesyncer-inference`: 0
- `@codesyncer-decision`: 0
- `@codesyncer-todo`: 0
- `@codesyncer-rule`: 0
- `@codesyncer-context`: 0

**Legacy tags (`@claude-*`)**: 0

**Update**: Auto-scan or "update stats"

---

## 📝 TODO List

**Items Needing Confirmation**: 0

No TODOs currently.

**Search**: `grep -r "@codesyncer-todo" ./src`

---

## 🏗️ Main Components/Files

### Components
- **Layout** (`components/Layout.jsx`) - Main application layout with sidebar, user info, and navigation
  - Features: Sidebar navigation, user display, logout button, Outlet for nested routes
  - Uses: `useAuth` hook for authentication state
  
- **ProtectedRoute** (`components/ProtectedRoute.jsx`) - Higher-Order Component for route protection
  - Features: Checks authentication, redirects to login if not authenticated
  - Uses: `useAuth` hook, React Router's `Navigate`

### Pages
- **Login** (`pages/Login.jsx`) - User authentication page
  - Features: Email/password form, error handling, loading state, JWT token storage
  - Integrates with: AuthContext for login, axiosClient for API calls
  
- **Dashboard** (`pages/Dashboard.jsx`) - Main dashboard view
  - Features: Overview of KPIs and financial metrics
  
- **Movimientos** (`pages/Movimientos.jsx`) - Transactions/Movements management
  - Features: List and manage financial movements

### Context
- **AuthContext** (`context/AuthContext.jsx`) - Global authentication state
  - Provides: `user`, `isAuthenticated`, `login()`, `logout()`, `loading`
  - Features: JWT token management, localStorage persistence, axios interceptors

### API Client
- **axiosClient** (`api/axiosClient.js`) - Configured Axios instance
  - Base URL: `http://localhost:8000`
  - Features: Automatic JWT token injection, 401 error handling, token refresh logic

---

## 🔌 API Integration

### Base Configuration
- **Backend API**: `http://localhost:8000`
- **Authentication**: JWT tokens in localStorage
- **Token Header**: `Authorization: Bearer <token>`

### Used Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration (if enabled)
- Protected endpoints require JWT token in Authorization header

### Axios Interceptors
- **Request Interceptor**: Automatically adds JWT token to all requests
- **Response Interceptor**: Handles 401 errors (token expiration) and redirects to login

---

## 📦 Dependencies

### Production
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.9.6",
  "axios": "^1.13.2"
}
```

### Development
```json
{
  "@tailwindcss/postcss": "^4.1.17",
  "@vitejs/plugin-react": "^4.3.4",
  "autoprefixer": "^10.4.22",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.0",
  "vite": "^6.0.11"
}
```

---

## 🎨 Styling Approach

- **Framework**: Tailwind CSS 3.4.0
- **Build Tool**: Vite 6.0.11
- **PostCSS**: Custom configuration with @tailwindcss/postcss plugin
- **Approach**: Utility-first CSS with Tailwind classes

---

## 🔐 Authentication Flow

1. User enters credentials on Login page
2. `AuthContext.login()` sends POST to `/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. `axiosClient` automatically includes token in all subsequent requests
6. Protected routes check `isAuthenticated` before rendering
7. On 401 error, user is automatically logged out and redirected to login

---

## 🚀 Routing Structure

```javascript
/ (root)
├── /login (public)
└── / (protected - Layout wrapper)
    ├── /dashboard
    └── /movimientos
```

- **Public Routes**: `/login`
- **Protected Routes**: All others wrapped in `<ProtectedRoute>`
- **Default Redirect**: Authenticated users redirect from `/login` to `/dashboard`
```

**Update**: Auto-detect on package.json changes

---

## 🎨 Tech Stack

- **Language**: React, React DOM, React Router DOM, Axios, Vite, Tailwind CSS, PostCSS, Autoprefixer, @tailwindcss/postcss, @vitejs/plugin-react
- **Framework**: To be auto-detected
- **State Management**: To be auto-detected
- **Styling**: To be auto-detected

---

## 📈 Code Quality Metrics

### Complexity
- Average function complexity: N/A
- Maximum function complexity: N/A

### Test Coverage
- Total coverage: N/A
- Line coverage: N/A
- Branch coverage: N/A

**Note**: Auto-displayed when ESLint, Prettier, Jest configured

---

## 🔄 Update History

### 2025-11-30
- Initial creation

---

**Auto-Update Triggers**:
- New folder/file creation detected
- package.json changes
- 10+ file modifications

**Manual Update**: Use "update structure" or "update stats" command

---

*This document is auto-generated and managed by CodeSyncer.*
