import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
  storageUsed: number
  storageLimit: number
  googleId?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  vaultPassword?: string
}

export const useAuth = () => {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const response = await api.get('/auth/me')
        return response.data
      } catch (err) {
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const logout = () => {
    window.location.reload();
  }

  return {
    user,
    isLoading,
    error,
    logout,
    isAuthenticated: !!user,
  }
}
