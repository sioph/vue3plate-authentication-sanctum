import { authApi } from '../utils/api.js'

/**
 * Create auth store module
 * @param {Object} config - Configuration object
 * @returns {Object} Vuex store module
 */
export default function createAuthStore(config) {
  return {
    namespaced: true,
    
    state: () => ({
      user: authApi.getStoredUser(),
      token: authApi.getStoredToken(),
      isLoading: false,
      error: null,
      isAuthenticated: authApi.isAuthenticated()
    }),

    getters: {
      isAuthenticated: (state) => state.isAuthenticated,
      user: (state) => state.user,
      token: (state) => state.token,
      isLoading: (state) => state.isLoading,
      error: (state) => state.error,
      userRole: (state) => state.user?.role?.name || null,
      userStatus: (state) => state.user?.status?.name || null,
      isAdmin: (state) => state.user?.role?.name === 'Admin',
      isStaff: (state) => state.user?.role?.name === 'Staff',
      isActive: (state) => state.user?.status?.name === 'Active',
      fullName: (state) => {
        if (!state.user) return ''
        const { first_name, middle_name, last_name } = state.user
        return [first_name, middle_name, last_name].filter(Boolean).join(' ')
      }
    },

    mutations: {
      SET_LOADING(state, loading) {
        state.isLoading = loading
      },

      SET_ERROR(state, error) {
        state.error = error
      },

      SET_AUTH_DATA(state, { user, token }) {
        state.user = user
        state.token = token
        state.isAuthenticated = true
        state.error = null
      },

      CLEAR_AUTH_DATA(state) {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      },

      UPDATE_USER(state, userData) {
        if (state.user) {
          state.user = { ...state.user, ...userData }
        }
      }
    },

    actions: {
      /**
       * Login user
       * @param {Object} context - Vuex context
       * @param {Object} credentials - Login credentials
       */
      async login({ commit, dispatch }, credentials) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
          const response = await authApi.login(credentials)
          
          commit('SET_AUTH_DATA', {
            user: response.user,
            token: response.token
          })

          // Add user menu items to header
          dispatch('app/addHeaderMenuItem', {
            id: 'user-menu',
            type: 'dropdown',
            label: response.user.first_name,
            icon: 'fa-solid fa-user',
            items: [
              {
                id: 'logout',
                label: 'Logout',
                icon: 'fa-solid fa-sign-out-alt',
                action: () => dispatch('logout')
              }
            ]
          }, { root: true })

          return response
        } catch (error) {
          commit('SET_ERROR', error)
          throw error
        } finally {
          commit('SET_LOADING', false)
        }
      },

      /**
       * Register new user
       * @param {Object} context - Vuex context
       * @param {Object} userData - Registration data
       */
      async register({ commit, dispatch }, userData) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
          const response = await authApi.register(userData)
          
          commit('SET_AUTH_DATA', {
            user: response.user,
            token: response.token
          })

          // Add user menu items to header
          dispatch('app/addHeaderMenuItem', {
            id: 'user-menu',
            type: 'dropdown',
            label: response.user.first_name,
            icon: 'fa-solid fa-user',
            items: [
              {
                id: 'logout',
                label: 'Logout',
                icon: 'fa-solid fa-sign-out-alt',
                action: () => dispatch('logout')
              }
            ]
          }, { root: true })

          return response
        } catch (error) {
          commit('SET_ERROR', error)
          throw error
        } finally {
          commit('SET_LOADING', false)
        }
      },

      /**
       * Logout user
       * @param {Object} context - Vuex context
       */
      async logout({ commit, dispatch }) {
        commit('SET_LOADING', true)

        try {
          await authApi.logout()
        } catch (error) {
          console.warn('Logout API call failed:', error)
        } finally {
          commit('CLEAR_AUTH_DATA')
          
          // Remove user menu from header
          dispatch('app/removeHeaderMenuItem', 'user-menu', { root: true })
          
          commit('SET_LOADING', false)
        }
      },



      /**
       * Initialize auth state from localStorage
       * @param {Object} context - Vuex context
       */
      initializeAuth({ commit, dispatch }) {
        const token = authApi.getStoredToken()
        const user = authApi.getStoredUser()

        if (token && user) {
          commit('SET_AUTH_DATA', { user, token })
          
          // Add user menu items to header
          dispatch('app/addHeaderMenuItem', {
            id: 'user-menu',
            type: 'dropdown',
            label: user.first_name,
            icon: 'fa-solid fa-user',
            items: [
              {
                id: 'logout',
                label: 'Logout',
                icon: 'fa-solid fa-sign-out-alt',
                action: () => dispatch('logout')
              }
            ]
          }, { root: true })
        }
      },

      /**
       * Clear error state
       * @param {Object} context - Vuex context
       */
      clearError({ commit }) {
        commit('SET_ERROR', null)
      }
    }
  }
} 