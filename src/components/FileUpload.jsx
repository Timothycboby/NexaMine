import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useStorage } from '../contexts/StorageContext'
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const FileUpload = ({ onClose, onFilesSelected }) => {
  const { uploadFiles } = useStorage()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [errors, setErrors] = useState([])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ file, errors }) => ({
        name: file.name,
        errors: errors.map(e => e.message)
      }))
      setErrors(prev => [...prev, ...newErrors])
    }

    // If onFilesSelected callback is provided, use it (for upload page)
    if (onFilesSelected) {
      onFilesSelected(acceptedFiles)
      return
    }

    // Otherwise, proceed with normal upload process
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles)
    }
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  })

  const handleUpload = async (files) => {
    setUploading(true)
    setUploadProgress({})
    setUploadedFiles([])
    setErrors([])

    try {
      // Simulate upload progress for each file
      const progressUpdates = {}
      files.forEach(file => {
        progressUpdates[file.name] = 0
      })
      setUploadProgress(progressUpdates)

      // Simulate upload process
      for (const file of files) {
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }))
        }
      }

      // Upload files using context
      await uploadFiles(files)
      
      setUploadedFiles(files)
      
      // Close modal after successful upload
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setErrors(prev => [...prev, { name: 'Upload failed', errors: [error.message] }])
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (file) => {
    const type = file.type
    if (type.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />
    if (type.startsWith('video/')) return <Video className="w-6 h-6 text-purple-500" />
    if (type.startsWith('audio/')) return <Music className="w-6 h-6 text-green-500" />
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return <Archive className="w-6 h-6 text-orange-500" />
    return <FileText className="w-6 h-6 text-gray-500" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Files
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!uploading && uploadedFiles.length === 0 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Supports: Images, Videos, Documents, Archives (Max: 100MB per file)
                </p>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Uploading Files...
                </h3>
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-primary-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {fileName}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Success */}
            {uploadedFiles.length > 0 && !uploading && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {uploadedFiles.length} file(s) uploaded successfully
                </p>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Upload Errors
                </h4>
                {errors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        {error.name}
                      </p>
                      {error.errors.map((err, errIndex) => (
                        <p key={errIndex} className="text-xs text-red-600 dark:text-red-400">
                          {err}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FileUpload 