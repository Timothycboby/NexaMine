import { useUser } from '@clerk/clerk-react'
import { useStorage } from '../contexts/StorageContext'
import { motion } from 'framer-motion'
import { HardDrive, FileText, Image, Video, Music, Archive, TrendingUp, Zap } from 'lucide-react'

const StorageStats = () => {
  const { user, isLoaded } = useUser()
  const { files, formatFileSize } = useStorage()

  // Fallback storage limit if not set on user
  const storageLimit = user?.publicMetadata?.storageLimit || 10 * 1024 * 1024 * 1024 // 10 GB default

  const totalStorageUsed = files.reduce((acc, file) => acc + file.size, 0)
  const storagePercentage = (totalStorageUsed / storageLimit) * 100

  const getFileTypeStats = () => {
    const stats = {
      images: { count: 0, size: 0, icon: Image, gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
      videos: { count: 0, size: 0, icon: Video, gradient: 'bg-gradient-to-br from-red-500 to-pink-500' },
      documents: { count: 0, size: 0, icon: FileText, gradient: 'bg-gradient-to-br from-green-500 to-emerald-500' },
      audio: { count: 0, size: 0, icon: Music, gradient: 'bg-gradient-to-br from-purple-500 to-violet-500' },
      archives: { count: 0, size: 0, icon: Archive, gradient: 'bg-gradient-to-br from-orange-500 to-amber-500' },
      other: { count: 0, size: 0, icon: FileText, gradient: 'bg-gradient-to-br from-gray-500 to-slate-500' }
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        stats.images.count++
        stats.images.size += file.size
      } else if (file.type.startsWith('video/')) {
        stats.videos.count++
        stats.videos.size += file.size
      } else if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document')) {
        stats.documents.count++
        stats.documents.size += file.size
      } else if (file.type.startsWith('audio/')) {
        stats.audio.count++
        stats.audio.size += file.size
      } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) {
        stats.archives.count++
        stats.archives.size += file.size
      } else {
        stats.other.count++
        stats.other.size += file.size
      }
    })

    return stats
  }

  const fileStats = getFileTypeStats()

  if (!isLoaded) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Storage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card-gradient relative overflow-hidden group"
      >
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <HardDrive className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Total Storage
                </h3>
                <p className="text-3xl font-bold gradient-text">
                  {formatFileSize(totalStorageUsed)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Used</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {formatFileSize(totalStorageUsed)} / {formatFileSize(storageLimit)}
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(storagePercentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {storagePercentage.toFixed(1)}% used
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* File Types */}
      {Object.entries(fileStats).map(([type, stats], index) => {
        if (stats.count === 0) return null
        const Icon = stats.icon
        
        return (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + (index + 1) * 0.1 }}
            className="card-gradient relative overflow-hidden group hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 ${stats.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider capitalize">
                      {type}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.count}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatFileSize(stats.size)}
                </p>
                <div className="relative">
                  <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full ${stats.gradient} rounded-full`}
                      style={{ 
                        width: `${totalStorageUsed > 0 ? (stats.size / totalStorageUsed) * 100 : 0}%` 
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${totalStorageUsed > 0 ? (stats.size / totalStorageUsed) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index + 1) * 0.1 }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {totalStorageUsed > 0 ? ((stats.size / totalStorageUsed) * 100).toFixed(1) : 0}% of total
                  </span>
                  <Zap className="w-3 h-3 text-accent-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default StorageStats 