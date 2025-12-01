import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock del API client PRIMERO
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
