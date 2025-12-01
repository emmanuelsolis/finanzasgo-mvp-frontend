import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import theme from '../styles/theme';

/**
 * Register Page Component
 * 
 * @codesyncer-context User registration with name, email, and password
 */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle input changes
   * 
   * @codesyncer-rule Controlled components pattern for forms
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError('');
  };

  /**
   * Validate form data
   * 
   * @codesyncer-context Client-side validation before API call
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  /**
   * Handle form submission
   * 
   * @codesyncer-context Register user and redirect to login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Registration successful, redirect to login
      navigate('/login', { 
        state: { message: 'Registro exitoso. Por favor inicia sesión.' }
      });
    } catch (err) {
      console.error('Error en registro:', err);
      setError(
        err.response?.data?.detail || 
        'Error al registrar usuario. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.secondary[50]} 100%)` 
      }}
    >
      <div 
        className="w-full max-w-md bg-white transition-all duration-300 hover:shadow-2xl"
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
              background: `linear-gradient(135deg, ${theme.colors.success[500]} 0%, ${theme.colors.primary[500]} 100%)`,
              borderRadius: theme.borderRadius.full
            }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
            Crear Cuenta
          </h1>
          <p style={{ color: theme.colors.neutral[600], fontSize: theme.typography.sizes.sm }}>
            Únete a FinanzasGo y gestiona tus finanzas
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            className="mb-6 p-4 transition-all duration-300"
            style={{
              backgroundColor: `${theme.colors.error[50]}`,
              borderLeft: `4px solid ${theme.colors.error[500]}`,
              borderRadius: theme.borderRadius.lg
            }}
          >
            <p 
              className="font-medium mb-1"
              style={{ color: theme.colors.error[700], fontSize: theme.typography.sizes.sm }}
            >
              Error
            </p>
            <p style={{ color: theme.colors.error[600], fontSize: theme.typography.sizes.xs }}>
              {error}
            </p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block mb-2"
              style={{ 
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.neutral[700]
              }}
            >
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.neutral[300],
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.sizes.base,
                '--tw-ring-color': theme.colors.primary[500]
              }}
              placeholder="Juan Pérez"
              disabled={loading}
            />
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block mb-2"
              style={{ 
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.neutral[700]
              }}
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.neutral[300],
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.sizes.base,
                '--tw-ring-color': theme.colors.primary[500]
              }}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
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
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.neutral[300],
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.sizes.base,
                '--tw-ring-color': theme.colors.primary[500]
              }}
              placeholder="••••••••"
              disabled={loading}
            />
            <p className="mt-1" style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.neutral[500] }}>
              Mínimo 6 caracteres
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block mb-2"
              style={{ 
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.neutral[700]
              }}
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border transition-all duration-200 focus:outline-none focus:ring-2"
              style={{
                borderColor: theme.colors.neutral[300],
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.sizes.base,
                '--tw-ring-color': theme.colors.primary[500]
              }}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: loading 
                ? theme.colors.neutral[400] 
                : `linear-gradient(135deg, ${theme.colors.success[600]} 0%, ${theme.colors.primary[600]} 100%)`,
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.typography.sizes.base,
              boxShadow: loading ? 'none' : theme.shadows.md
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p style={{ color: theme.colors.neutral[600], fontSize: theme.typography.sizes.sm }}>
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login" 
              className="font-semibold transition-colors duration-200 hover:underline"
              style={{ color: theme.colors.primary[600] }}
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
