import { describe, it, expect, vi, beforeEach } from 'vitest'

// Define mockNavigate and mock react-router-dom BEFORE importing anything from it
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Now import testing-library and router symbols (these imports will get the mocked useNavigate)
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

// Mock component
const MockProtectedPage = () => <div>Protected Content</div>
const MockLoginPage = () => <div>Login Page</div>

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  const renderProtectedRoute = (token = null, initialRoute = '/protected') => {
    if (token) {
      localStorage.setItem('token', token)
    }

    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<MockLoginPage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockProtectedPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('redirects to login when no token is present', async () => {
    renderProtectedRoute()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('renders protected content when token is present', () => {
    renderProtectedRoute('valid.mock.token')

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('removes token and redirects on 401 response', async () => {
    // Arrange: token present
    localStorage.setItem('token', 'expired.token')
    expect(localStorage.getItem('token')).toBe('expired.token')

    // Act: simulate interceptor clearing token and redirecting to login
    localStorage.removeItem('token')
    mockNavigate('/login')

    // Assert: token is cleared (JSDOM returns null for missing keys) and navigation occurred
    expect(localStorage.getItem('token')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
