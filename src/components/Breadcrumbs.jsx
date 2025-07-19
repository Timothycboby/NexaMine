import { useStorage } from '../contexts/StorageContext'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = () => {
  const { getBreadcrumbs, navigateToFolder } = useStorage()
  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
          )}
          
          <button
            onClick={() => navigateToFolder(crumb.path)}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors duration-200 ${
              index === breadcrumbs.length - 1
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {index === 0 ? (
              <Home className="w-4 h-4" />
            ) : (
              <span>{crumb.name}</span>
            )}
          </button>
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumbs 