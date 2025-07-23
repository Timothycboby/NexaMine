import { useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useStorage } from '../contexts/StorageContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Folder, 
  Star, 
  Share2, 
  Trash2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Cloud,
  HardDrive,
  Users,
  Activity,
  Zap,
  BarChart3,
  HardDrive as HardDriveIcon
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentPath, navigateToFolder } = useStorage()

  const menuItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Folder, 
      label: 'My Files', 
      path: '/my-files',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: HardDriveIcon, 
      label: 'Storage', 
      path: '/storage',
      color: 'from-pink-500 to-pink-600'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      icon: Share2, 
      label: 'Shared', 
      path: '/shared',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: Star, 
      label: 'Starred', 
      path: '/starred',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      icon: Trash2, 
      label: 'Trash', 
      path: '/trash',
      color: 'from-red-500 to-red-600'
    },
  ]

  const handleLogout = () => {
    signOut()
  }

  // Responsive sidebar overlay for mobile
  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
        onClick={() => setIsCollapsed(true)}
      />
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 h-full w-72 sm:w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 shadow-2xl transition-transform duration-300 ${
          isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Cloud className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-accent-500 to-warning-500 rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold gradient-text">Nexamine</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Storage Hub</p>
                </div>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            {/* Storage Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600 dark:text-gray-400">Storage Used</span>
                <span className="text-gray-900 dark:text-white font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                Navigation
              </h3>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setIsCollapsed(true)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 dark:from-primary-500/30 dark:to-primary-600/30 text-primary-700 dark:text-primary-300 shadow-lg' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full ml-auto"></div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions */}
            {/* Pro Features */}
          </nav>
          {/* User Profile */}
          <div className="p-2 md:p-4 border-t border-white/20 dark:border-gray-700/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName}
                  className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </>
  )
}

export default Sidebar 