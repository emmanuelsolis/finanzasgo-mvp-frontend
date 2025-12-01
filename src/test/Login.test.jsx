import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock del theme PRIMERO
vi.mock('../styles/theme', () => ({
  default: {
    colors: {
      primary: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 900: '#1e3a8a' },
      secondary: { 50: '#f5f3ff', 500: '#a855f7', 600: '#9333ea' },
      success: { 50: '#f0fdf4', 500: '#10b981', 700: '#047857' },
      error: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
      neutral: { 100: '#f5f5f5', 300: '#d4d4d4', 600: '#525252', 700: '#404040', 900: '#171717' }
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
import Login from '../pages/Login'
import api from '../api/axiosClient'

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('renders login form with email and password fields', () => {
    renderLogin()
    
    expect(screen.getByPlaceholderText(/tu@correo.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('displays validation errors for empty fields', async () => {
    renderLogin()
    const user = userEvent.setup()
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)
    
    // HTML5 validation prevents submission
    const emailInput = screen.getByPlaceholderText(/tu@correo.com/i)
    expect(emailInput).toBeInTheDocument()
  })

  it('successfully logs in with valid credentials', async () => {
    const mockToken = 'mock.jwt.token'
    api.post.mockResolvedValueOnce({
      data: {
        access_token: mockToken,
        token_type: 'bearer'
      }
    })

    renderLogin()
    const user = userEvent.setup()
    
    const emailInput = screen.getByPlaceholderText(/tu@correo.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('displays error message for invalid credentials', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Incorrect email or password'
        }
      }
    })

    renderLogin()
    const user = userEvent.setup()
    
    const emailInput = screen.getByPlaceholderText(/tu@correo.com/i)
    const passwordInput = screen.getByPlaceholderText(/••••••••/)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/incorrect email or password/i)).toBeInTheDocument()
    })
  })

  it('has a link to registration page', () => {
    renderLogin()
    
    const registerLink = screen.getByRole('link', { name: /regístrate aquí/i })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })
})
