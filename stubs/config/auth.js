export default {
  // Laravel Sanctum API endpoint
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // Sanctum endpoints
  endpoints: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    user: '/api/auth/user',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    resendVerification: '/api/auth/resend-verification'
  },
  
  // Token storage
  tokenKey: 'vue3plate_auth_token',
  
  // Redirect paths
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/login',
    afterRegister: '/verify-email',
    loginRequired: '/login'
  },
  
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  
  // Session settings
  session: {
    timeout: 120, // minutes
    extendOnActivity: true
  }
};
