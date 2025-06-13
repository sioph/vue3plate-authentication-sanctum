<template>
  <div v-if="isAuthenticated">
    <slot />
  </div>
  <div v-else-if="!isLoading" class="auth-guard-message">
    <div class="message-content">
      <font-awesome-icon icon="fa-solid fa-lock" class="lock-icon" />
      <h3 class="message-title">Authentication Required</h3>
      <p class="message-text">You need to be logged in to access this content.</p>
      <router-link to="/login" class="login-button">
        <font-awesome-icon icon="fa-solid fa-sign-in-alt" />
        Sign In
      </router-link>
    </div>
  </div>
  <div v-else class="auth-guard-loading">
    <font-awesome-icon icon="fa-solid fa-spinner" spin class="loading-icon" />
    <p>Checking authentication...</p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'

export default {
  name: 'AuthGuard',
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    requireRole: {
      type: String,
      default: null
    },
    requireAnyRole: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { isAuthenticated, isLoading, userRole, hasRole, hasAnyRole } = useAuth(props.config)

    // Check role requirements
    const hasRequiredRole = computed(() => {
      if (props.requireRole) {
        return hasRole(props.requireRole)
      }
      if (props.requireAnyRole.length > 0) {
        return hasAnyRole(props.requireAnyRole)
      }
      return true
    })

    const canAccess = computed(() => {
      return isAuthenticated.value && hasRequiredRole.value
    })

    return {
      isAuthenticated: canAccess,
      isLoading,
      userRole
    }
  }
}
</script>

<style scoped>
.auth-guard-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
}

.message-content {
  text-align: center;
  max-width: 400px;
}

.lock-icon {
  font-size: 3rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.message-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem;
}

.message-text {
  color: #6b7280;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.login-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.login-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.auth-guard-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
  color: #6b7280;
}

.loading-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style> 