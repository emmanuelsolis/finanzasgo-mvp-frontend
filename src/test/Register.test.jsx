import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock del theme PRIMERO
vi.mock('../styles/theme', () => ({
  default: {
    colors: {
      primary: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 900: '#1e3a8a' },
      secondary: { 50: '#f5f3ff', 500: '#a855f7', 600: '#9333ea' },
      success: { 50: '#f0fdf4', 500: '#10b981', 600: '#22c55e', 700: '#047857' },
      error: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
      neutral: { 100: '#f5f5f5', 300: '#d4d4d4', 500: '#737373', 600: '#525252', 700: '#404040', 900: '#171717' }
    },
    typography: {
      sizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', '3xl': '1.875rem' },
      fontWeight: { medium: '500' },
      fontFamily: { sans: 'Inter, system-ui, sans-serif' }
    },
    borderRadius: { lg: '0.5rem', xl: '0.75rem', full: '9999px' },
    shadows: { md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
  }
}))

// Mock del API client SEGUNDO
vi.mock('../api/axiosClient', () => ({
  default: {
    post: vi.fn(),
  }
}))

// Define mockNavigate and mock react-router-dom BEFORE importing anything from it
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Now import testing-library and other modules
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Register from '../pages/Register'
import api from '../api/axiosClient'

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('renders register form with all required fields', () => {
    renderRegister()
    
    expect(screen.getByPlaceholderText(/juan pérez/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument()
    // Hay dos campos de password
    const passwordFields = screen.getAllByPlaceholderText(/••••••••/)
    expect(passwordFields).toHaveLength(2)
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('successfully registers a new user', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        access_token: 'mock.token',
        token_type: 'bearer'
      }
    })

    renderRegister()
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText(/juan pérez/i), 'John Doe')
    await user.type(screen.getByPlaceholderText(/tu@email.com/i), 'john@example.com')
    const passwordFields = screen.getAllByPlaceholderText(/••••••••/)
    await user.type(passwordFields[0], 'password123')
    await user.type(passwordFields[1], 'password123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        state: { message: 'Registro exitoso. Por favor inicia sesión.' }
      })
    })
  })

  it('displays error for duplicate email', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Email already registered'
        }
      }
    })

    renderRegister()
    const user = userEvent.setup()
    
    await user.type(screen.getByPlaceholderText(/juan pérez/i), 'Jane Doe')
    await user.type(screen.getByPlaceholderText(/tu@email.com/i), 'existing@example.com')
    const passwordFields = screen.getAllByPlaceholderText(/••••••••/)
    await user.type(passwordFields[0], 'password123')
    await user.type(passwordFields[1], 'password123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument()
    })
  })

  it('has a link to login page', () => {
    renderRegister()
    
    const loginLink = screen.getByRole('link', { name: /inicia sesi\u00f3n/i })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })
})
