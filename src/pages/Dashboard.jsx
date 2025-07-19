import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import StorageStats from '../components/StorageStats'
import FileExplorer from '../components/FileExplorer'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8"
    >
      <div className="w-full">
        <StorageStats />
      </div>
      <div className="w-full">
        <FileExplorer />
      </div>
    </motion.div>
  )
}

export default Dashboard 