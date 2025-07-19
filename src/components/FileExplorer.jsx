import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStorage } from '../contexts/StorageContext'
import Breadcrumbs from './Breadcrumbs'
import FileGrid from './FileGrid'
import FileList from './FileList'
import FileActions from './FileActions'
import { FolderOpen, FileText, Upload, Plus, Cloud } from 'lucide-react'
import CreateFolder from './CreateFolder'

const FileExplorer = () => {
  const navigate = useNavigate()
  const { 
    getCurrentItems, 
    viewMode, 
    selectedItems, 
    setSelectedItems 
  } = useStorage()
  
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const items = getCurrentItems()
  const hasSelection = selectedItems.length > 0

  const handleItemClick = (itemId, isFolder = false) => {
    if (isFolder) {
      // Navigate to folder
      return
    }
    
    // Toggle selection for files
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    const fileIds = items.filter(item => !item.icon?.includes('📁')).map(item => item.id)
    setSelectedItems(fileIds)
  }

  const handleClearSelection = () => {
    setSelectedItems([])
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {items.length} items
          </h2>
          
          {hasSelection && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.length} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!hasSelection && items.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Select All
            </button>
          )}
          
          {hasSelection && (
            <FileActions 
              selectedItems={selectedItems}
              onClose={() => setSelectedItems([])}
            />
          )}
        </div>
      </div>

      {/* File Explorer Content */}
      <div className="min-h-[400px]">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            {/* Main Upload Section */}
            <div className="w-full max-w-4xl mx-auto">
              {/* Welcome Message */}
              <div className="mb-12">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Cloud className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Your Storage Hub
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Start organizing your files by uploading documents, images, videos, and more. 
                  Create folders to keep everything organized and easily accessible.
                </p>
              </div>

              {/* Upload Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Upload Files Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient text-center p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
                  onClick={() => navigate('/upload')}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Upload Files
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Drag and drop files here or click to browse. Support for all file types.
                  </p>
                  <button className="btn-primary text-lg px-8 py-4">
                    Choose Files
                  </button>
                </motion.div>

                {/* Create Folder Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient text-center p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
                  onClick={() => setShowCreateFolder(true)}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Plus className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Create Folder
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Organize your files by creating folders and subfolders for better structure.
                  </p>
                  <button className="btn-accent text-lg px-8 py-4">
                    New Folder
                  </button>
                </motion.div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                  <div className="text-gray-600 dark:text-gray-400">Files Uploaded</div>
                </div>
                <div className="card text-center p-6">
                  <div className="text-3xl font-bold text-accent-600 mb-2">0</div>
                  <div className="text-gray-600 dark:text-gray-400">Folders Created</div>
                </div>
                <div className="card text-center p-6">
                  <div className="text-3xl font-bold text-success-600 mb-2">0 GB</div>
                  <div className="text-gray-600 dark:text-gray-400">Storage Used</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <FileGrid 
                key="grid"
                items={items}
                selectedItems={selectedItems}
                onItemClick={handleItemClick}
              />
            ) : (
              <FileList 
                key="list"
                items={items}
                selectedItems={selectedItems}
                onItemClick={handleItemClick}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      {showCreateFolder && (
        <CreateFolder onClose={() => setShowCreateFolder(false)} />
      )}
    </div>
  )
}

export default FileExplorer 