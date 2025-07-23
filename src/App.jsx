import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { StorageProvider } from './contexts/StorageContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import MyFiles from './components/MyFiles'
import MainLayout from './components/MainLayout'
import Analytics from './pages/Analytics'
import Storage from './pages/Storage'
import Shared from './pages/Shared'
import Starred from './pages/Starred';
import Trash from './pages/Trash';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"

const App = () => {
  return (
    <ThemeProvider>
      <StorageProvider>
        <div className="App">
          <Routes>
            {/* Public route for sign-in */}
            <Route path="/sign-in" element={<AuthPage />} />
            <Route path="/auth" element={<Navigate to="/sign-in" replace />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/upload"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <UploadPage />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/my-files"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <MyFiles />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/analytics"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <Analytics />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/storage"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <Storage />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/shared"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <Shared />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/starred"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <Starred />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/trash"
              element={
                <>
                  <SignedIn>
                    <MainLayout>
                      <Trash />
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </StorageProvider>
    </ThemeProvider>
  )
}

export default App 