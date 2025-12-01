import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import theme from "../styles/theme";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mensaje de registro exitoso
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.secondary[50]} 100%)` 
      }}
    >
      <div 
        className="bg-white w-full max-w-md transition-all duration-300 hover:shadow-2xl"
        style={{ 
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.xl,
          padding: '3rem'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%)`,
              borderRadius: theme.borderRadius.full
            }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 
            className="font-bold mb-2"
            style={{ 
              fontSize: theme.typography.sizes['3xl'],
              color: theme.colors.neutral[900],
              fontFamily: theme.typography.fontFamily.sans
            }}
          >
            Bienvenido a FinanzasGo
          </h1>
          <p style={{ color: theme.colors.neutral[600], fontSize: theme.typography.sizes.sm }}>
            Inicia sesión para acceder a tu dashboard
          </p>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div 
            className="mb-6 p-4 transition-all duration-300"
            style={{
              backgroundColor: `${theme.colors.success[50]}`,
              borderLeft: `4px solid ${theme.colors.success[500]}`,
              borderRadius: theme.borderRadius.lg
            }}
          >
            <p style={{ color: theme.colors.success[700], fontSize: theme.typography.sizes.sm }}>
              {successMessage}
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 transition-all duration-300"
            style={{
              backgroundColor: `${theme.colors.error[50]}`,
              borderLeft: `4px solid ${theme.colors.error[500]}`,
              borderRadius: theme.borderRadius.lg
            }}
          >
            <p style={{ color: theme.colors.error[700], fontSize: theme.typography.sizes.sm }}>
              {error}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.neutral[700]
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.neutral[300],
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.sizes.base,
                '--tw-ring-color': theme.colors.primary[500]
              }}
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label 
              className="block mb-2"
              style={{ 
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.neutral[700]
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.neutral[300],
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.sizes.base,
                '--tw-ring-color': theme.colors.primary[500]
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: loading 
                ? theme.colors.neutral[400] 
                : `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.secondary[600]} 100%)`,
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.typography.sizes.base,
              boxShadow: loading ? 'none' : theme.shadows.md
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
        
        {/* Register Link */}
        <div className="mt-8 text-center">
          <p style={{ color: theme.colors.neutral[600], fontSize: theme.typography.sizes.sm }}>
            ¿No tienes cuenta?{' '}
            <Link 
              to="/register" 
              className="font-semibold transition-colors duration-200 hover:underline"
              style={{ color: theme.colors.primary[600] }}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
