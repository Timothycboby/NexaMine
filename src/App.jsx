import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { StorageProvider } from './contexts/StorageContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StorageProvider>
          <div className="App">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <UploadPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </StorageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 