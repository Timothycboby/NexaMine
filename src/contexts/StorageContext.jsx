import { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

const StorageContext = createContext()

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}

export const StorageProvider = ({ children }) => {
  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [currentPath, setCurrentPath] = useState('/')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    // Load data from localStorage
    const savedFiles = localStorage.getItem('files')
    const savedFolders = localStorage.getItem('folders')
    
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders))
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem('files', JSON.stringify(files))
    localStorage.setItem('folders', JSON.stringify(folders))
  }, [files, folders])

  const getFileIcon = (fileType) => {
    const icons = {
      'image': '🖼️',
      'video': '🎥',
      'audio': '🎵',
      'pdf': '📄',
      'document': '📝',
      'spreadsheet': '📊',
      'presentation': '📈',
      'archive': '📦',
      'code': '💻',
      'text': '📄',
      'unknown': '📄'
    }
    
    if (fileType.startsWith('image/')) return icons.image
    if (fileType.startsWith('video/')) return icons.video
    if (fileType.startsWith('audio/')) return icons.audio
    if (fileType === 'application/pdf') return icons.pdf
    if (fileType.includes('word') || fileType.includes('document')) return icons.document
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return icons.spreadsheet
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return icons.presentation
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) return icons.archive
    if (fileType.includes('javascript') || fileType.includes('python') || fileType.includes('java')) return icons.code
    if (fileType.startsWith('text/')) return icons.text
    
    return icons.unknown
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadFile = async (file, path = currentPath) => {
    try {
      const newFile = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        path: path,
        uploadedAt: new Date().toISOString(),
        icon: getFileIcon(file.type),
        url: URL.createObjectURL(file),
        starred: false, // add starred property
        trashed: false  // add trashed property
      }
      
      setFiles(prev => [...prev, newFile])
      toast.success(`${file.name} uploaded successfully!`)
      return newFile
    } catch (error) {
      toast.error('Failed to upload file')
      throw error
    }
  }

  const createFolder = (name, path = currentPath) => {
    const newFolder = {
      id: uuidv4(),
      name,
      path,
      createdAt: new Date().toISOString(),
      icon: '📁'
    }
    
    setFolders(prev => [...prev, newFolder])
    toast.success(`Folder "${name}" created successfully!`)
    return newFolder
  }

  const deleteFile = (fileId) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, trashed: true } : file
    ))
    setSelectedItems(prev => prev.filter(id => id !== fileId))
    toast.success('File moved to trash!')
  }

  const restoreFile = (fileId) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, trashed: false } : file
    ))
    toast.success('File restored!')
  }

  const toggleStarred = (fileId) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? { ...file, starred: !file.starred } : file
    ))
  }

  const deleteFolder = (folderId) => {
    setFolders(prev => prev.filter(folder => folder.id !== folderId))
    setSelectedItems(prev => prev.filter(id => id !== folderId))
    toast.success('Folder deleted successfully!')
  }

  const renameFile = (fileId, newName) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, name: newName } : file
    ))
    toast.success('File renamed successfully!')
  }

  const renameFolder = (folderId, newName) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    ))
    toast.success('Folder renamed successfully!')
  }

  const getCurrentItems = () => {
    const currentFiles = files.filter(file => file.path === currentPath)
    const currentFolders = folders.filter(folder => folder.path === currentPath)
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return [
        ...currentFolders.filter(folder => folder.name.toLowerCase().includes(query)),
        ...currentFiles.filter(file => file.name.toLowerCase().includes(query))
      ]
    }
    
    return [...currentFolders, ...currentFiles]
  }

  const navigateToFolder = (folderPath) => {
    setCurrentPath(folderPath)
    setSelectedItems([])
  }

  const getBreadcrumbs = () => {
    const paths = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Home', path: '/' }]
    
    let currentPathStr = ''
    paths.forEach(path => {
      currentPathStr += `/${path}`
      breadcrumbs.push({ name: path, path: currentPathStr })
    })
    
    return breadcrumbs
  }

  const value = {
    files,
    folders,
    currentPath,
    viewMode,
    searchQuery,
    selectedItems,
    setViewMode,
    setSearchQuery,
    setSelectedItems,
    uploadFile,
    createFolder,
    deleteFile,
    deleteFolder,
    renameFile,
    renameFolder,
    getCurrentItems,
    navigateToFolder,
    getBreadcrumbs,
    formatFileSize,
    getFileIcon,
    restoreFile, // expose restoreFile
    toggleStarred // expose toggleStarred
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
} 