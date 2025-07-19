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

const FileList = ({ items, selectedItems, onItemClick }) => {
  const { formatFileSize, navigateToFolder, deleteFile, deleteFolder } = useStorage()
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

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300">
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Date</div>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, index) => {
            const isSelected = selectedItems.includes(item.id)
            const isFolder = item.icon?.includes('📁')
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`group grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                {/* Selection Checkbox */}
                <div className="col-span-1 flex items-center">
                  <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
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
                </div>

                {/* Name and Icon */}
                <div className="col-span-5 flex items-center space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    {isFolder && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Folder
                      </p>
                    )}
                  </div>
                </div>

                {/* Size */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isFolder ? '--' : formatFileSize(item.size)}
                  </span>
                </div>

                {/* Type */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isFolder ? 'Folder' : item.type || 'Unknown'}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(item.uploadedAt || item.createdAt).toLocaleDateString()}
                  </span>
                  
                  {/* Context Menu Button */}
                  <button
                    className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleContextMenu(e, item)
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
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
          
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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

export default FileList 