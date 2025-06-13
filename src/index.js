import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import AuthGuard from './components/AuthGuard.vue'
import authStore from './store/auth.js'
import { useAuth } from './composables/useAuth.js'
import { authRoutes } from './utils/routes.js'
import { authApi } from './utils/api.js'

/**
 * Create authentication feature for vue3plate
 * @param {Object} config - Configuration options
 * @param {string} config.apiBaseUrl - Base URL for API calls
 * @param {string} config.tokenKey - Local storage key for token
 * @param {string} config.userKey - Local storage key for user data
 * @param {string} config.afterLogin - Route to redirect after login
 * @param {string} config.afterLogout - Route to redirect after logout
 * @param {string} config.afterRegister - Route to redirect after registration
 * @returns {Object} Authentication feature object
 */
export function createAuthenticationFeature(config = {}) {
  const defaultConfig = {
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    tokenKey: import.meta.env.VITE_TOKEN_KEY || 'auth_token',
    userKey: import.meta.env.VITE_USER_KEY || 'auth_user',
    afterLogin: '/dashboard',
    afterLogout: '/',
    afterRegister: '/dashboard'
  }

  const finalConfig = { ...defaultConfig, ...config }

  // Initialize API with config
  authApi.init(finalConfig)

  return {
    name: 'authentication',
    config: finalConfig,
    
    // Routes to register
    routes: authRoutes(finalConfig),
    
    // Store module to register
    store: authStore(finalConfig),
    
    // Components to register globally (optional)
    components: {
      LoginForm,
      RegisterForm,
      AuthGuard
    },
    
    // Views (for manual route registration)
    views: {
      LoginPage,
      RegisterPage
    },
    
    // Composables
    composables: {
      useAuth: () => useAuth(finalConfig)
    },
    
    // API utilities
    api: authApi,
    
    // Sidebar menu items to add
    sidebarItems: [],
    
    // Header menu items to add
    headerItems: [
      {
        id: 'auth-logout',
        label: 'Logout',
        icon: 'fa-solid fa-sign-out-alt',
        action: 'logout',
        requiresAuth: true
      }
    ]
  }
}

// Named exports for individual components
export {
  LoginPage,
  RegisterPage,
  LoginForm,
  RegisterForm,
  AuthGuard,
  authStore,
  useAuth,
  authRoutes,
  authApi
}

// Default export
export default createAuthenticationFeature 