import { useStorage } from '../contexts/StorageContext'
import { Download, Trash2, Share2, Star, X } from 'lucide-react'

const FileActions = ({ selectedItems, onClose }) => {
  const { files, deleteFile, formatFileSize } = useStorage()

  const selectedFiles = files.filter(file => selectedItems.includes(file.id))
  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)

  const handleDownloadAll = () => {
    selectedFiles.forEach(file => {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const handleDeleteAll = () => {
    selectedFiles.forEach(file => {
      deleteFile(file.id)
    })
    onClose()
  }

  return (
    <div className="flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg px-4 py-2">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
          {selectedItems.length} selected
        </span>
        
        <span className="text-sm text-primary-600 dark:text-primary-400">
          {formatFileSize(totalSize)}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={handleDownloadAll}
          className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-400 transition-colors duration-200"
          title="Download all"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-400 transition-colors duration-200"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-400 transition-colors duration-200"
          title="Star"
        >
          <Star className="w-4 h-4" />
        </button>

        <button
          onClick={handleDeleteAll}
          className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors duration-200"
          title="Delete all"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 text-primary-600 dark:text-primary-400 transition-colors duration-200"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default FileActions 