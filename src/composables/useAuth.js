import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

/**
 * Authentication composable
 * @param {Object} config - Configuration object
 * @returns {Object} Authentication methods and state
 */
export function useAuth(config) {
  const store = useStore()
  const router = useRouter()

  // Computed properties
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const user = computed(() => store.getters['auth/user'])
  const token = computed(() => store.getters['auth/token'])
  const isLoading = computed(() => store.getters['auth/isLoading'])
  const error = computed(() => store.getters['auth/error'])
  const userRole = computed(() => store.getters['auth/userRole'])
  const userStatus = computed(() => store.getters['auth/userStatus'])
  const isAdmin = computed(() => store.getters['auth/isAdmin'])
  const isStaff = computed(() => store.getters['auth/isStaff'])
  const isActive = computed(() => store.getters['auth/isActive'])
  const fullName = computed(() => store.getters['auth/fullName'])

  // Methods
  const login = async (credentials) => {
    try {
      await store.dispatch('auth/login', credentials)
      router.push(config.afterLogin)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      await store.dispatch('auth/register', userData)
      router.push(config.afterRegister)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await store.dispatch('auth/logout')
      router.push(config.afterLogout)
    } catch (error) {
      console.warn('Logout error:', error)
      router.push(config.afterLogout)
    }
  }



  const clearError = () => {
    store.dispatch('auth/clearError')
  }

  const initializeAuth = () => {
    store.dispatch('auth/initializeAuth')
  }

  // Utility methods
  const hasRole = (role) => {
    return userRole.value === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(userRole.value)
  }

  const can = (permission) => {
    // Basic permission check based on role
    if (isAdmin.value) return true
    if (isStaff.value && ['read', 'update'].includes(permission)) return true
    return false
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  const requireGuest = () => {
    if (isAuthenticated.value) {
      router.push(config.afterLogin)
      return false
    }
    return true
  }

  const requireRole = (role) => {
    if (!requireAuth()) return false
    if (!hasRole(role)) {
      router.push('/unauthorized')
      return false
    }
    return true
  }

  const requireAnyRole = (roles) => {
    if (!requireAuth()) return false
    if (!hasAnyRole(roles)) {
      router.push('/unauthorized')
      return false
    }
    return true
  }

  return {
    // State
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    userRole,
    userStatus,
    isAdmin,
    isStaff,
    isActive,
    fullName,

    // Actions
    login,
    register,
    logout,
    clearError,
    initializeAuth,

    // Utilities
    hasRole,
    hasAnyRole,
    can,
    requireAuth,
    requireGuest,
    requireRole,
    requireAnyRole
  }
}

export default useAuth 