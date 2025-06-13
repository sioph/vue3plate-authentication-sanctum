# Vue3Plate Authentication with Sanctum

Vue 3 authentication package for vue3plate boilerplate that integrates with Laravel Sanctum.

## Features

- Login/Register functionality
- Email verification
- Password reset
- Profile management
- Route guards
- Automatic token management
- Modular installation like Laravel packages

## Installation

### Step 1: Install the Package

```bash
npm install vue3plate-auth-sanctum
```

### Step 2: Run the Installation Command

After installing the package, run the installer to copy and integrate the authentication files:

```bash
# Recommended: Use npx to run the installer
npx vue3plate-auth-install

# Alternative: Run directly
node node_modules/vue3plate-auth-sanctum/bin/install.js
```

**Note:** The installer must be run manually to avoid installation conflicts. It will safely copy all authentication files and integrate them into your Vue3Plate project.

## What Gets Installed

The installer will automatically:

- ✅ Copy authentication components to `src/components/auth/`
- ✅ Copy authentication views to `src/views/auth/`
- ✅ Copy authentication store module to `src/store/modules/auth.js`
- ✅ Copy authentication composables to `src/composables/`
- ✅ Create authentication routes in `src/router/auth.js`
- ✅ Update main router to include auth routes
- ✅ Update main.js with auth initialization
- ✅ Update main store to include auth module
- ✅ Create authentication configuration in `src/config/auth.js`

## Laravel Backend Setup

Make sure your Laravel backend has Sanctum configured:

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

## Environment Setup

Create a `.env` file in your Vue project root:

```env
VITE_API_URL=http://localhost:8000
```

## Usage

### Authentication in Components

```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      Welcome, {{ user.name }}!
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, user, logout } = useAuth()
</script>
```

### Route Guards

```javascript
// src/router/index.js
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard')
  } else {
    next()
  }
})
```

## File Structure After Installation

```
src/
├── components/
│   └── auth/           # Authentication components
├── views/
│   └── auth/           # Authentication views
├── store/
│   └── modules/
│       └── auth.js     # Auth Vuex module
├── composables/
│   └── useAuth.js      # Authentication composable
├── router/
│   ├── index.js        # Main router (updated)
│   └── auth.js         # Auth routes (new)
└── config/
    └── auth.js         # Auth configuration (new)
```

## Uninstall

To remove the authentication package:

```bash
npm uninstall vue3plate-auth-sanctum
```

**Note:** This will only remove the package files, not the files that were copied to your project. You'll need to manually remove those if desired.

## Development

This package is designed to work like Laravel Composer packages - it automatically integrates into your project structure instead of just providing imports.

## Support

For issues and questions, please visit the [GitHub repository](https://github.com/sioph/vue3plate-authentication-sanctum). 