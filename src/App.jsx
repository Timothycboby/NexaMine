import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { StorageProvider } from './contexts/StorageContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import MyFiles from './components/MyFiles'
import MainLayout from './components/MainLayout'
import Analytics from './pages/Analytics'
import Storage from './pages/Storage'
import Shared from './pages/Shared'

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
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <PrivateRoute>
                    <MainLayout>
                      <UploadPage />
                    </MainLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-files" 
                element={
                  <MainLayout>
                    <MyFiles />
                  </MainLayout>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                } 
              />
              <Route 
                path="/storage" 
                element={
                  <MainLayout>
                    <Storage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/shared" 
                element={
                  <MainLayout>
                    <Shared />
                  </MainLayout>
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