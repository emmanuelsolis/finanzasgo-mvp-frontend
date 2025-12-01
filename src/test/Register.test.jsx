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
