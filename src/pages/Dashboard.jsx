import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import FileExplorer from '../components/FileExplorer'
import StorageStats from '../components/StorageStats'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { user, isLoading } = useAuth()
  const { isDark } = useTheme()

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth'
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading your storage...
          </h2>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 z-50 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <StorageStats />
                <FileExplorer />
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 