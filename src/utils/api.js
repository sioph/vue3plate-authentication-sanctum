import axios from 'axios'

class AuthApi {
  constructor() {
    this.config = null
    this.client = null
  }

  /**
   * Initialize the API client with configuration
   * @param {Object} config - Configuration object
   */
  init(config) {
    this.config = config
    
    // Create axios instance
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (requestConfig) => {
        const token = localStorage.getItem(config.tokenKey)
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`
        }
        return requestConfig
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthData()
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  /**
   * Register a new user account
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  async register(userData) {
    try {
      const response = await this.client.post('/register-account', {
        first_name: userData.firstName,
        middle_name: userData.middleName || '',
        last_name: userData.lastName,
        email: userData.email,
        mobile_number: userData.mobileNumber,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation
      })

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise} API response
   */
  async login(credentials) {
    try {
      const response = await this.client.post('/login', {
        email: credentials.email,
        password: credentials.password
      })

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Logout user
   * @returns {Promise} API response
   */
  async logout() {
    try {
      const response = await this.client.post('/logout')
      this.clearAuthData()
      return response.data
    } catch (error) {
      // Clear auth data even if logout fails
      this.clearAuthData()
      throw this.handleError(error)
    }
  }



  /**
   * Set authentication data in localStorage
   * @param {string} token - Auth token
   * @param {Object} user - User data
   */
  setAuthData(token, user) {
    localStorage.setItem(this.config.tokenKey, token)
    localStorage.setItem(this.config.userKey, JSON.stringify(user))
  }

  /**
   * Clear authentication data from localStorage
   */
  clearAuthData() {
    localStorage.removeItem(this.config.tokenKey)
    localStorage.removeItem(this.config.userKey)
  }

  /**
   * Get stored token
   * @returns {string|null} Auth token
   */
  getStoredToken() {
    return localStorage.getItem(this.config.tokenKey)
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getStoredUser() {
    const userData = localStorage.getItem(this.config.userKey)
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.getStoredToken()
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Object} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors || {},
        status: error.response.status
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        errors: {},
        status: 0
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        errors: {},
        status: 0
      }
    }
  }
}

// Export singleton instance
export const authApi = new AuthApi()
export default authApi 