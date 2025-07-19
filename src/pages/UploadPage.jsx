import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStorage } from '../contexts/StorageContext'
import { 
  Upload, 
  Shield, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  FileText,
  Zap,
  Cloud,
  Gauge,
  Activity,
  Clock,
  Timer,
  BarChart3,
  PieChart,
  TrendingUp,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode
} from 'lucide-react'
import FileUpload from '../components/FileUpload'

const UploadPage = () => {
  const navigate = useNavigate()
  const { uploadFiles } = useStorage()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [encryptionProgress, setEncryptionProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('select') // select, encrypting, uploading, complete
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadSpeed, setUploadSpeed] = useState(0) // MB/s
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Time tracking states
  const [uploadStartTime, setUploadStartTime] = useState(null)
  const [encryptionStartTime, setEncryptionStartTime] = useState(null)
  const [uploadStartTimeActual, setUploadStartTimeActual] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [encryptionTime, setEncryptionTime] = useState(0)
  const [uploadTime, setUploadTime] = useState(0)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0)
  const [totalUploadTime, setTotalUploadTime] = useState(0)

  // Graph data states
  const [speedHistory, setSpeedHistory] = useState([])
  const [progressHistory, setProgressHistory] = useState([])
  const [fileTypeStats, setFileTypeStats] = useState({})
  const [timeBreakdown, setTimeBreakdown] = useState({})

  // Format time helper function
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.round(seconds % 60)
      return `${minutes}m ${remainingSeconds}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = Math.round(seconds % 60)
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    }
  }

  // Get file type icon
  const getFileTypeIcon = (file) => {
    const type = file.type
    if (type.startsWith('image/')) return <FileImage className="w-5 h-5 text-blue-500" />
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-purple-500" />
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-green-500" />
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return <FileArchive className="w-5 h-5 text-orange-500" />
    if (type.includes('text') || type.includes('code')) return <FileCode className="w-5 h-5 text-indigo-500" />
    return <FileText className="w-5 h-5 text-gray-500" />
  }

  // Calculate file type statistics
  const calculateFileTypeStats = (files) => {
    const stats = {}
    files.forEach(file => {
      const type = file.type.split('/')[0] || 'other'
      if (!stats[type]) {
        stats[type] = { count: 0, size: 0 }
      }
      stats[type].count++
      stats[type].size += file.size
    })
    return stats
  }

  // Update elapsed time
  useEffect(() => {
    let interval
    if (uploadStartTime && (currentStep === 'encrypting' || currentStep === 'uploading')) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - uploadStartTime) / 1000
        setElapsedTime(elapsed)
        
        // Calculate encryption time
        if (encryptionStartTime && currentStep === 'encrypting') {
          const encryptionElapsed = (Date.now() - encryptionStartTime) / 1000
          setEncryptionTime(encryptionElapsed)
        }
        
        // Calculate upload time
        if (uploadStartTimeActual && currentStep === 'uploading') {
          const uploadElapsed = (Date.now() - uploadStartTimeActual) / 1000
          setUploadTime(uploadElapsed)
        }
        
        // Calculate estimated time remaining for upload step
        if (currentStep === 'uploading' && uploadProgress > 0) {
          const remainingProgress = 100 - uploadProgress
          const timePerPercent = uploadTime / uploadProgress
          const estimated = remainingProgress * timePerPercent
          setEstimatedTimeRemaining(estimated)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [uploadStartTime, encryptionStartTime, uploadStartTimeActual, currentStep, uploadProgress, uploadTime])

  // Simulate encryption process
  useEffect(() => {
    if (currentStep === 'encrypting') {
      const interval = setInterval(() => {
        setEncryptionProgress(prev => {
          if (prev >= 100) {
            setCurrentStep('uploading')
            setUploadStartTimeActual(Date.now())
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [currentStep])

  // Simulate upload process
  useEffect(() => {
    if (currentStep === 'uploading') {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            setCurrentStep('complete')
            setTotalUploadTime(elapsedTime)
            setTimeBreakdown({
              encryption: encryptionTime,
              upload: uploadTime,
              total: elapsedTime
            })
            return 100
          }
          
          // Add to progress history for graph
          const newProgress = prev + 1
          setProgressHistory(prevHistory => [...prevHistory, {
            time: Date.now(),
            progress: newProgress
          }])
          
          return newProgress
        })
        
        // Simulate varying upload speed and add to history
        const newSpeed = Math.random() * 10 + 5 // 5-15 MB/s
        setUploadSpeed(newSpeed)
        setSpeedHistory(prevHistory => [...prevHistory, {
          time: Date.now(),
          speed: newSpeed
        }])
      }, 100)
      return () => clearInterval(interval)
    }
  }, [currentStep, elapsedTime, encryptionTime, uploadTime])

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files)
    setSelectedFiles(fileArray)
    setCurrentStep('encrypting')
    setEncryptionProgress(0)
    setUploadProgress(0)
    setUploadStartTime(Date.now())
    setEncryptionStartTime(Date.now())
    setElapsedTime(0)
    setEncryptionTime(0)
    setUploadTime(0)
    setEstimatedTimeRemaining(0)
    setSpeedHistory([])
    setProgressHistory([])
    setFileTypeStats(calculateFileTypeStats(fileArray))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      uploadFiles(selectedFiles)
      setCurrentStep('uploading')
    }
  }

  const resetUpload = () => {
    setSelectedFiles([])
    setCurrentStep('select')
    setEncryptionProgress(0)
    setUploadProgress(0)
    setUploadSpeed(0)
    setUploadStartTime(null)
    setEncryptionStartTime(null)
    setUploadStartTimeActual(null)
    setElapsedTime(0)
    setEncryptionTime(0)
    setUploadTime(0)
    setEstimatedTimeRemaining(0)
    setTotalUploadTime(0)
    setSpeedHistory([])
    setProgressHistory([])
    setFileTypeStats({})
    setTimeBreakdown({})
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 'select': return <FileText className="w-6 h-6" />
      case 'encrypting': return <Shield className="w-6 h-6" />
      case 'uploading': return <Cloud className="w-6 h-6" />
      case 'complete': return <CheckCircle className="w-6 h-6" />
      default: return <FileText className="w-6 h-6" />
    }
  }

  const getStepTitle = (step) => {
    switch (step) {
      case 'select': return 'Select Files'
      case 'encrypting': return 'Encrypting Files'
      case 'uploading': return 'Uploading to Cloud'
      case 'complete': return 'Upload Complete'
      default: return 'Select Files'
    }
  }

  const getStepDescription = (step) => {
    switch (step) {
      case 'select': return 'Choose files to upload securely'
      case 'encrypting': return 'Applying military-grade encryption'
      case 'uploading': return 'Transferring files to secure servers'
      case 'complete': return 'Your files are now safely stored'
      default: return 'Choose files to upload securely'
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Secure File Upload
          </h1>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {['select', 'encrypting', 'uploading', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ${
                  currentStep === step 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-110'
                    : index < ['select', 'encrypting', 'uploading', 'complete'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {getStepIcon(step)}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-4 transition-all duration-500 ${
                    index < ['select', 'encrypting', 'uploading', 'complete'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {getStepTitle(currentStep)}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {getStepDescription(currentStep)}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Upload Area */}
          <div className="space-y-8">
            {/* File Selection */}
            {currentStep === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-8 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Files to Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Choose files from your device. All files will be encrypted before upload.
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Choose Files
                </button>
              </motion.div>
            )}

            {/* Encryption Process */}
            {currentStep === 'encrypting' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Encrypting Files
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Applying AES-256 encryption to secure your data
                  </p>
                </div>

                {/* Encryption Time Display */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-2">
                    <Clock className="w-5 h-5 text-accent-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Encryption Time: {formatTime(encryptionTime)}
                    </span>
                  </div>
                </div>

                {/* Encryption Progress */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Encryption Progress
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                      {encryptionProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-accent-500 to-accent-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${encryptionProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Encryption Steps */}
                <div className="mt-8 space-y-4">
                  {[
                    'Generating encryption keys',
                    'Applying AES-256 encryption',
                    'Creating secure hash',
                    'Preparing for upload'
                  ].map((step, index) => (
                    <div key={step} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        encryptionProgress > (index * 25)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {encryptionProgress > (index * 25) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        encryptionProgress > (index * 25)
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Upload Process */}
            {currentStep === 'uploading' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Cloud className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Uploading to Cloud
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Transferring encrypted files to secure servers
                  </p>
                </div>

                {/* Upload Time Display */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-2">
                    <Clock className="w-5 h-5 text-success-500" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Upload Time: {formatTime(uploadTime)}
                    </span>
                  </div>
                  {estimatedTimeRemaining > 0 && (
                    <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-2">
                      <Timer className="w-5 h-5 text-warning-500" />
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatTime(estimatedTimeRemaining)} left
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upload Progress
                    </span>
                    <span className="text-sm font-bold text-success-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* File List */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Files Being Uploaded
                  </h4>
                  <div className="space-y-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon(file)}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upload Complete with File Details */}
            {currentStep === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Success Message */}
                <div className="card-gradient p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Upload Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your files have been successfully encrypted and uploaded to secure servers.
                  </p>
                  
                  {/* Time Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="flex items-center justify-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                      <Shield className="w-5 h-5 text-accent-500" />
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Encryption</div>
                        <div className="font-bold text-gray-900 dark:text-white">{formatTime(timeBreakdown.encryption || 0)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                      <Cloud className="w-5 h-5 text-success-500" />
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Upload</div>
                        <div className="font-bold text-gray-900 dark:text-white">{formatTime(timeBreakdown.upload || 0)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
                      <Clock className="w-5 h-5 text-primary-500" />
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                        <div className="font-bold text-gray-900 dark:text-white">{formatTime(timeBreakdown.total || 0)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="btn-primary px-6 py-3"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={resetUpload}
                      className="btn-secondary px-6 py-3"
                    >
                      Upload More Files
                    </button>
                  </div>
                </div>

                {/* File Details */}
                <div className="card-gradient p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Uploaded Files Details
                  </h4>
                  <div className="space-y-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          {getFileTypeIcon(file)}
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {file.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {file.type} • {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            ✓ Uploaded
                          </div>
                          <div className="text-xs text-gray-500">
                            Encrypted
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Speedometer, Stats, and Graphs */}
          <div className="space-y-8">
            {/* Speedometer */}
            <div className="card-gradient p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Gauge className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload Speed
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time transfer rate
                </p>
              </div>

              {/* Speedometer Display */}
              <div className="relative">
                <div className="w-48 h-48 mx-auto relative">
                  {/* Speedometer Circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      className="dark:stroke-gray-700"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#speedGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: 0, strokeDashoffset: 0 }}
                      animate={{ 
                        strokeDasharray: `${(uploadSpeed / 20) * 251.2} 251.2`,
                        strokeDashoffset: 0
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Speed Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {uploadSpeed.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      MB/s
                    </div>
                  </div>
                </div>
              </div>

              {/* Speed Indicators */}
              <div className="flex justify-between mt-6 text-xs text-gray-500">
                <span>0 MB/s</span>
                <span>10 MB/s</span>
                <span>20 MB/s</span>
              </div>
            </div>

            {/* Upload Statistics */}
            <div className="card-gradient p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upload Statistics
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Files Selected</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedFiles.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Size</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Encryption</span>
                  <span className="font-semibold text-green-600">AES-256</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`font-semibold ${
                    currentStep === 'complete' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {currentStep === 'complete' ? 'Complete' : 'In Progress'}
                  </span>
                </div>
                {(currentStep === 'encrypting' || currentStep === 'uploading') && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Elapsed Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatTime(elapsedTime)}
                    </span>
                  </div>
                )}
                {currentStep === 'encrypting' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Encryption Time</span>
                    <span className="font-semibold text-accent-600">
                      {formatTime(encryptionTime)}
                    </span>
                  </div>
                )}
                {currentStep === 'uploading' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Upload Time</span>
                    <span className="font-semibold text-success-600">
                      {formatTime(uploadTime)}
                    </span>
                  </div>
                )}
                {currentStep === 'uploading' && estimatedTimeRemaining > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Time Remaining</span>
                    <span className="font-semibold text-warning-600">
                      {formatTime(estimatedTimeRemaining)}
                    </span>
                  </div>
                )}
                {currentStep === 'complete' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Time</span>
                    <span className="font-semibold text-green-600">
                      {formatTime(totalUploadTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Graphs Section */}
            {currentStep === 'complete' && (
              <div className="space-y-6">
                {/* Graph 1: Speed Over Time */}
                <div className="card-gradient p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Upload Speed Over Time
                    </h4>
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <svg className="w-full h-full" viewBox="0 0 300 100">
                      {speedHistory.length > 1 && speedHistory.map((point, index) => {
                        if (index === 0) return null
                        const prevPoint = speedHistory[index - 1]
                        const x1 = (index - 1) * (300 / (speedHistory.length - 1))
                        const y1 = 100 - (prevPoint.speed / 20) * 100
                        const x2 = index * (300 / (speedHistory.length - 1))
                        const y2 = 100 - (point.speed / 20) * 100
                        return (
                          <line
                            key={index}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                        )
                      })}
                    </svg>
                  </div>
                </div>

                {/* Graph 2: File Size Distribution */}
                <div className="card-gradient p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <PieChart className="w-5 h-5 text-purple-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      File Type Distribution
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(fileTypeStats).map(([type, stats], index) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-purple-500' :
                            index === 2 ? 'bg-green-500' :
                            index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {type} ({stats.count})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatFileSize(stats.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Graph 3: Upload Progress Timeline */}
                <div className="card-gradient p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Upload Progress Timeline
                    </h4>
                  </div>
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <svg className="w-full h-full" viewBox="0 0 300 100">
                      {progressHistory.map((point, index) => {
                        const x = index * (300 / (progressHistory.length - 1))
                        const y = 100 - point.progress
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="2"
                            fill="#10b981"
                          />
                        )
                      })}
                    </svg>
                  </div>
                </div>

                {/* Graph 4: Time Breakdown Comparison */}
                <div className="card-gradient p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-accent-500" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Time Breakdown
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Encryption</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent-500 rounded-full"
                            style={{ width: `${((timeBreakdown.encryption || 0) / (timeBreakdown.total || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatTime(timeBreakdown.encryption || 0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Upload</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success-500 rounded-full"
                            style={{ width: `${((timeBreakdown.upload || 0) / (timeBreakdown.total || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatTime(timeBreakdown.upload || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Features */}
            <div className="card-gradient p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Security Features
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    End-to-end encryption
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Military-grade AES-256
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Secure cloud storage
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Real-time monitoring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <FileUpload 
          onClose={() => setShowUploadModal(false)}
          onFilesSelected={handleFileSelect}
        />
      )}
    </div>
  )
}

export default UploadPage 