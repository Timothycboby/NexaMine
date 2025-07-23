import { motion } from 'framer-motion'
import { useStorage } from '../contexts/StorageContext'
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  Edit3, 
  Share2,
  Star
} from 'lucide-react'
import { useState } from 'react'

const FileGrid = ({ items, selectedItems, onItemClick }) => {
  const { formatFileSize, navigateToFolder, deleteFile, deleteFolder, toggleStarred } = useStorage()
  const [contextMenu, setContextMenu] = useState({ show: false, item: null, x: 0, y: 0 })

  const handleContextMenu = (e, item) => {
    e.preventDefault()
    setContextMenu({
      show: true,
      item,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleItemClick = (item) => {
    if (item.icon?.includes('📁')) {
      // It's a folder
      navigateToFolder(`${item.path}/${item.name}`)
    } else {
      // It's a file
      onItemClick(item.id, false)
    }
  }

  const handleDelete = (item) => {
    if (item.icon?.includes('📁')) {
      deleteFolder(item.id)
    } else {
      deleteFile(item.id)
    }
    setContextMenu({ show: false, item: null, x: 0, y: 0 })
  }

  const handleDownload = (item) => {
    if (!item.icon?.includes('📁')) {
      const link = document.createElement('a')
      link.href = item.url
      link.download = item.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    setContextMenu({ show: false, item: null, x: 0, y: 0 })
  }

  const handleStar = (item) => {
    if (!item.icon?.includes('📁')) {
      toggleStarred(item.id)
    }
    setContextMenu({ show: false, item: null, x: 0, y: 0 })
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {items.map((item, index) => {
          const isSelected = selectedItems.includes(item.id)
          const isFolder = item.icon?.includes('📁')
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
              }`}
              onClick={() => handleItemClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              {/* Selection Checkbox */}
              <div className={`absolute top-2 left-2 w-4 h-4 rounded border-2 transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100'
              }`}>
                {isSelected && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Context Menu Button */}
              <button
                className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  handleContextMenu(e, item)
                }}
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {/* File/Folder Icon */}
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-2">
                  {item.icon}
                </div>
                
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate w-full">
                  {item.name}
                </h3>
                
                {!isFolder && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(item.size)}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(item.uploadedAt || item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {!contextMenu.item.icon?.includes('📁') && (
            <button
              onClick={() => handleDownload(contextMenu.item)}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          )}
          
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Edit3 className="w-4 h-4" />
            <span>Rename</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleStar(contextMenu.item)}>
            <Star className="w-4 h-4" />
            <span>Star</span>
          </button>
          
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          
          <button
            onClick={() => handleDelete(contextMenu.item)}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Context Menu Overlay */}
      {contextMenu.show && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu({ show: false, item: null, x: 0, y: 0 })}
        />
      )}
    </>
  )
}

export default FileGrid 