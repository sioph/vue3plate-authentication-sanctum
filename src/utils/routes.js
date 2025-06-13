import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'

/**
 * Create authentication routes
 * @param {Object} config - Configuration object
 * @returns {Array} Array of route objects
 */
export function authRoutes(config) {
  return [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: {
        layout: 'auth',
        requiresGuest: true,
        title: 'Login'
      },
      beforeEnter: (to, from, next) => {
        // Redirect to afterLogin route if already authenticated
        const token = localStorage.getItem(config.tokenKey)
        if (token) {
          next(config.afterLogin)
        } else {
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage,
      meta: {
        layout: 'auth',
        requiresGuest: true,
        title: 'Register'
      },
      beforeEnter: (to, from, next) => {
        // Redirect to afterRegister route if already authenticated
        const token = localStorage.getItem(config.tokenKey)
        if (token) {
          next(config.afterRegister)
        } else {
          next()
        }
      }
    }
  ]
}

/**
 * Create route guards for authentication
 * @param {Object} config - Configuration object
 * @returns {Function} Navigation guard function
 */
export function createAuthGuard(config) {
  return (to, from, next) => {
    const token = localStorage.getItem(config.tokenKey)
    const isAuthenticated = !!token

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login')
      return
    }

    // Check if route requires guest (not authenticated)
    if (to.meta.requiresGuest && isAuthenticated) {
      next(config.afterLogin)
      return
    }

    next()
  }
}

export default authRoutes 