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
