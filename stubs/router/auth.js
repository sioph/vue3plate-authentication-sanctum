export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { 
      requiresGuest: true,
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'register', 
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { 
      requiresGuest: true,
      title: 'Register'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: { 
      requiresGuest: true,
      title: 'Forgot Password'
    }
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: { 
      requiresGuest: true,
      title: 'Reset Password'
    }
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('@/views/auth/VerifyEmailView.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Verify Email'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/auth/ProfileView.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Profile'
    }
  }
];
