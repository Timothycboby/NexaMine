import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`,
        storageUsed: 0,
        storageLimit: 10 * 1024 * 1024 * 1024 // 10GB
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      toast.success('Successfully logged in!')
      navigate('/')
      return true
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return false
    }
  }

  const signup = async (email, password, name) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser = {
        id: '1',
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`,
        storageUsed: 0,
        storageLimit: 10 * 1024 * 1024 * 1024 // 10GB
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      toast.success('Account created successfully!')
      navigate('/')
      return true
    } catch (error) {
      toast.error('Signup failed. Please try again.')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    navigate('/auth')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 