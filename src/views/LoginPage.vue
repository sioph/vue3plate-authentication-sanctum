<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <div class="brand-section">
          <div class="brand-logo">
            <font-awesome-icon icon="fa-solid fa-sign-in-alt" />
          </div>
          <h1 class="brand-title">vue3plate</h1>
          <p class="brand-subtitle">Welcome Back</p>
        </div>
        
        <LoginForm 
          :config="config"
          @success="handleLoginSuccess"
          @error="handleLoginError"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'

export default {
  name: 'LoginPage',
  components: {
    LoginForm
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    handleLoginSuccess() {
      console.log('Login successful')
    },
    
    handleLoginError(error) {
      console.error('Login error:', error)
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
  z-index: 1;
}

.login-container {
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.login-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.4), 0 0 60px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.brand-section {
  text-align: center;
  padding: 2rem;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.brand-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .login-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  .brand-section {
    padding: 1rem;
  }
  
  .brand-title {
    font-size: 2.5rem;
  }
  
  .brand-logo {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-content {
    padding: 1.5rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .brand-subtitle {
    font-size: 1.1rem;
  }
}
</style>