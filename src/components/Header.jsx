import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useStorage } from '../contexts/StorageContext'
import { 
  Search, 
  Grid3X3, 
  List, 
  Sun, 
  Moon, 
  Plus,
  Upload,
  Bell,
  Zap
} from 'lucide-react'
import CreateFolder from './CreateFolder'

const Header = () => {
  const navigate = useNavigate()
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useStorage()

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left Section - Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 shadow-md hover:shadow-lg"
            />
          </div>
        </div>

        {/* Center Section - Main Actions */}
        <div className="flex items-center justify-center space-x-6 mx-8">
          {/* Upload Button */}
          <div className="relative">
            <button
              onClick={() => navigate('/upload')}
              className="btn-primary flex items-center space-x-3 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Upload className="w-6 h-6" />
              <span>Upload Files</span>
            </button>
          </div>

          {/* Create Folder Button */}
          <div className="relative">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="btn-accent flex items-center space-x-3 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              <span>New Folder</span>
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Section - Other Actions */}
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-1 shadow-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Notifications */}
          <button className="relative p-3 rounded-2xl bg-gradient-to-r from-accent-500/10 to-warning-500/10 hover:from-accent-500/20 hover:to-warning-500/20 transition-all duration-300 shadow-md hover:shadow-lg">
            <Bell className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 shadow-md"
          >
            {isDark ? <Sun className="w-5 h-5 text-warning-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreateFolder && (
        <CreateFolder onClose={() => setShowCreateFolder(false)} />
      )}
    </header>
  )
}

export default Header 