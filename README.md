# vue3plate-auth-sanctum

Vue 3 authentication package that integrates seamlessly with `sioph/laravelplate-authentication-sanctum` Laravel backend package.

## Features

This package provides **only the core authentication features** that match the Laravel backend:

- ✅ **User Registration** - Complete registration form with validation
- ✅ **User Login** - Login form with remember me functionality  
- ✅ **User Logout** - Secure logout with token cleanup

## What's NOT Included

To maintain compatibility with the Laravel backend, this package does **NOT** include:
- ❌ Profile management
- ❌ Password change functionality
- ❌ User profile editing
- ❌ Additional user management features

## Installation

```bash
npm install vue3plate-auth-sanctum
```

## Quick Start

```javascript
// main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import App from './App.vue'

// Import the authentication feature
import { createAuthenticationFeature } from 'vue3plate-auth-sanctum'
import { useFeatureIntegration } from './composables/useFeatureIntegration'

// Your existing routes and store modules
import { routes } from './router/routes'
import appModule from './store/modules/app'

const app = createApp(App)

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create store
const store = createStore({
  modules: {
    app: appModule
  }
})

// Initialize authentication feature
const authFeature = createAuthenticationFeature({
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  tokenKey: import.meta.env.VITE_TOKEN_KEY || 'auth_token',
  userKey: import.meta.env.VITE_USER_KEY || 'auth_user',
  afterLogin: '/dashboard',
  afterLogout: '/',
  afterRegister: '/dashboard'
})

// Register the feature using vue3plate's feature integration system
const { registerFeature } = useFeatureIntegration()
registerFeature(authFeature)

app.use(router)
app.use(store)
app.mount('#app')
```

## Environment Configuration

Update your `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
VITE_TOKEN_KEY=auth_token
VITE_USER_KEY=auth_user
```

## Components

- `LoginForm` - Complete login form component
- `RegisterForm` - Complete registration form component  
- `AuthGuard` - Component for protecting authenticated content

## Pages

- `LoginPage` - Full login page with branding
- `RegisterPage` - Full registration page with branding

## Usage Examples

### Dashboard Page Example

```vue
<!-- views/private/DashboardPage.vue -->
<template>
  <div class="dashboard">
    <h1>Welcome, {{ fullName }}!</h1>
    <p>Role: {{ userRole }}</p>
    <p>Status: {{ userStatus }}</p>
    
    <div class="dashboard-actions">
      <button @click="handleLogout" class="btn btn-secondary">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from 'vue3plate-auth-sanctum'

const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL,
  tokenKey: import.meta.env.VITE_TOKEN_KEY,
  userKey: import.meta.env.VITE_USER_KEY,
  afterLogout: '/'
}

const { fullName, userRole, userStatus, logout } = useAuth(config)

const handleLogout = async () => {
  await logout()
}
</script>
```

### Protecting Routes with AuthGuard

```vue
<!-- Any component that needs authentication -->
<template>
  <AuthGuard :config="authConfig">
    <div class="protected-content">
      <h2>This content is only visible to authenticated users</h2>
    </div>
  </AuthGuard>
</template>

<script setup>
import { AuthGuard } from 'vue3plate-auth-sanctum'

const authConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL,
  tokenKey: import.meta.env.VITE_TOKEN_KEY,
  userKey: import.meta.env.VITE_USER_KEY
}
</script>
```

### Route Configuration Example

```javascript
// router/routes.js
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/public/HomePage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/private/DashboardPage.vue'),
    meta: {
      requiresAuth: true
    }
  }
  // Authentication routes are automatically added by the package
]
```

## Available Composables

- `useAuth(config)` - Main authentication composable with all auth methods

## Available API Methods

- `authApi.login(credentials)`
- `authApi.register(userData)`
- `authApi.logout()`

## Route Meta Properties

- `requiresAuth: true` - Requires user to be authenticated
- `requiresGuest: true` - Requires user to NOT be authenticated
- `requiresRole: 'Admin'` - Requires specific role
- `requiresAnyRole: ['Admin', 'Staff']` - Requires any of the specified roles

## API Integration

Automatically integrates with Laravel Sanctum endpoints:

| Frontend Method | Laravel Endpoint | Status |
|----------------|------------------|---------|
| `authApi.register()` | `POST /register-account` | ✅ Supported |
| `authApi.login()` | `POST /login` | ✅ Supported |
| `authApi.logout()` | `POST /logout` | ✅ Supported |

## Laravel Backend Setup

Make sure your Laravel backend has the `sioph/laravelplate-authentication-sanctum` package installed:

```bash
composer require sioph/laravelplate-authentication-sanctum
```

## Laravel Backend Compatibility

This package is designed to work with:
- [sioph/laravel10plate-authentication-sanctum](https://github.com/sioph/laravel10plate-authentication-sanctum)

## Package Architecture

The package follows a modular architecture that integrates seamlessly with vue3plate's feature system:

- **API Layer** (`src/utils/api.js`) - Handles all HTTP requests to Laravel backend
- **Store Module** (`src/store/auth.js`) - Vuex store for authentication state management
- **Composable** (`src/composables/useAuth.js`) - Vue 3 Composition API wrapper
- **Components** (`src/components/`) - Reusable authentication components
- **Views** (`src/views/`) - Complete page components
- **Routes** (`src/utils/routes.js`) - Authentication route definitions

## User Experience

After login/register, users will see:
- User dropdown menu with only **Logout** option
- No profile management links or buttons
- Clean, focused authentication experience

## Development Notes

This package was specifically designed to match the Laravel backend capabilities. Features like profile management, password changes, and user editing were intentionally excluded to maintain perfect compatibility with the `sioph/laravel10plate-authentication-sanctum` backend package.

## License

MIT 