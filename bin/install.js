#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Vue3PlateAuthInstaller {
    constructor() {
        this.projectRoot = process.cwd();
        this.packageRoot = path.resolve(__dirname, '..');
        this.stubsPath = path.join(this.packageRoot, 'stubs');
        
        // Colors for console output
        this.colors = {
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            red: '\x1b[31m',
            blue: '\x1b[34m',
            reset: '\x1b[0m'
        };
    }

    log(message, color = 'reset') {
        console.log(`${this.colors[color]}${message}${this.colors.reset}`);
    }

    async install() {
        try {
            this.log('🚀 Installing Vue3Plate Authentication with Sanctum...', 'blue');
            
            // Check if this is a Vue3Plate project
            if (!this.isVue3PlateProject()) {
                this.log('❌ This doesn\'t appear to be a Vue3Plate project!', 'red');
                return;
            }

            // Copy authentication components
            await this.copyAuthComponents();
            
            // Copy authentication views
            await this.copyAuthViews();
            
            // Copy authentication utilities
            await this.copyAuthUtils();
            
            // Copy and merge store modules
            await this.copyAuthStore();
            
            // Copy composables
            await this.copyComposables();
            
            // Update router with auth routes
            await this.updateRouter();
            
            // Update main.js with auth initialization
            await this.updateMainJs();
            
            // Create auth configuration
            await this.createAuthConfig();
            
            this.log('✅ Vue3Plate Authentication installed successfully!', 'green');
            this.log('📖 Please check README.md for setup instructions.', 'yellow');
            
        } catch (error) {
            this.log(`❌ Installation failed: ${error.message}`, 'red');
            process.exit(1);
        }
    }

    isVue3PlateProject() {
        const packageJsonPath = path.join(this.projectRoot, 'package.json');
        if (!fs.existsSync(packageJsonPath)) return false;
        
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Check for Vue3Plate project indicators
        const isVuePlateProject = packageJson.name && (
            packageJson.name.includes('vue3plate') || 
            packageJson.name.includes('vueplate') ||
            packageJson.name === 'vueplate'
        );
        
        // Also check for Vue 3 dependencies as additional confirmation
        const hasVue3 = packageJson.dependencies && packageJson.dependencies.vue;
        const hasVueRouter = packageJson.dependencies && packageJson.dependencies['vue-router'];
        const hasVuex = packageJson.dependencies && packageJson.dependencies.vuex;
        
        return (isVuePlateProject || (hasVue3 && hasVueRouter && hasVuex)) && 
               fs.existsSync(path.join(this.projectRoot, 'src'));
    }

    async copyAuthComponents() {
        this.log('📦 Copying authentication components...', 'blue');
        const srcComponents = path.join(this.packageRoot, 'src', 'components');
        const destComponents = path.join(this.projectRoot, 'src', 'components', 'auth');
        
        await this.copyDirectory(srcComponents, destComponents);
    }

    async copyAuthViews() {
        this.log('📄 Copying authentication views...', 'blue');
        const srcViews = path.join(this.packageRoot, 'src', 'views');
        const destViews = path.join(this.projectRoot, 'src', 'views', 'auth');
        
        await this.copyDirectory(srcViews, destViews);
    }

    async copyAuthStore() {
        this.log('🏪 Setting up authentication store...', 'blue');
        const srcStore = path.join(this.packageRoot, 'src', 'store', 'auth.js');
        const destStore = path.join(this.projectRoot, 'src', 'store', 'modules', 'auth.js');
        
        // Ensure modules directory exists
        const modulesDir = path.dirname(destStore);
        if (!fs.existsSync(modulesDir)) {
            fs.mkdirSync(modulesDir, { recursive: true });
        }
        
        // Copy the auth store file and fix import paths
        if (fs.existsSync(srcStore)) {
            let authStoreContent = fs.readFileSync(srcStore, 'utf8');
            
            // Fix import paths for the new location (store/modules/auth.js)
            authStoreContent = authStoreContent.replace(
                "import { authApi } from '../utils/api.js'",
                "import { authApi } from '../../utils/api.js'"
            );
            
            // Don't overwrite if file already exists
            if (!fs.existsSync(destStore)) {
                fs.writeFileSync(destStore, authStoreContent);
                this.log(`Created auth store: ${destStore}`, 'green');
            } else {
                this.log(`Skipping ${destStore} (already exists)`, 'yellow');
            }
        }
        
        // Update main store to include auth module
        await this.updateMainStore();
    }

    async copyComposables() {
        this.log('🔧 Copying authentication composables...', 'blue');
        const srcComposables = path.join(this.packageRoot, 'src', 'composables');
        const destComposables = path.join(this.projectRoot, 'src', 'composables');
        
        await this.copyDirectory(srcComposables, destComposables);
    }

    async copyAuthUtils() {
        this.log('⚙️ Copying authentication utilities...', 'blue');
        const srcUtils = path.join(this.packageRoot, 'src', 'utils');
        const destUtils = path.join(this.projectRoot, 'src', 'utils');
        
        // Ensure utils directory exists
        if (!fs.existsSync(destUtils)) {
            fs.mkdirSync(destUtils, { recursive: true });
        }
        
        await this.copyDirectory(srcUtils, destUtils);
    }

    async updateRouter() {
        this.log('🛣️ Updating router with auth routes...', 'blue');
        const routerPath = path.join(this.projectRoot, 'src', 'router', 'index.js');
        
        if (fs.existsSync(routerPath)) {
            let routerContent = fs.readFileSync(routerPath, 'utf8');
            
            // Add auth routes import
            const authImport = "import authRoutes from './auth.js';\n";
            if (!routerContent.includes("import authRoutes from './auth.js'")) {
                routerContent = routerContent.replace(
                    /import.*from.*vue-router.*;?\n/,
                    match => match + authImport
                );
            }
            
            // Add auth routes to routes array
            const routesPattern = /routes:\s*\[([\s\S]*?)\]/;
            if (routesPattern.test(routerContent) && !routerContent.includes('...authRoutes')) {
                routerContent = routerContent.replace(
                    routesPattern,
                    (match, routes) => {
                        const trimmedRoutes = routes.trim();
                        const lastChar = trimmedRoutes.slice(-1);
                        const needsComma = lastChar !== '' && lastChar !== ',';
                        return `routes: [${routes}${needsComma ? ',' : ''}\n    ...authRoutes\n  ]`;
                    }
                );
            }
            
            fs.writeFileSync(routerPath, routerContent);
        }
        
        // Copy auth routes file
        const srcAuthRoutes = path.join(this.stubsPath, 'router', 'auth.js');
        const destAuthRoutes = path.join(this.projectRoot, 'src', 'router', 'auth.js');
        await this.copyFile(srcAuthRoutes, destAuthRoutes);
    }

    async updateMainJs() {
        this.log('⚙️ Updating main.js with auth initialization...', 'blue');
        const mainJsPath = path.join(this.projectRoot, 'src', 'main.js');
        
        if (fs.existsSync(mainJsPath)) {
            let mainContent = fs.readFileSync(mainJsPath, 'utf8');
            
            // Add auth composable import
            const authImport = "import { useAuth } from './composables/useAuth.js';\nimport authConfig from './config/auth.js';\n";
            if (!mainContent.includes("import { useAuth }") && !mainContent.includes("from './composables/useAuth.js'")) {
                // Add imports after existing imports
                const lastImportMatch = mainContent.match(/import.*from.*['"]\s*$/gm);
                if (lastImportMatch) {
                    const lastImport = lastImportMatch[lastImportMatch.length - 1];
                    mainContent = mainContent.replace(lastImport, lastImport + '\n' + authImport);
                } else {
                    mainContent = authImport + '\n' + mainContent;
                }
            }
            
            // Add auth initialization before app mount
            const initCall = "\n// Initialize authentication\nconst { initializeAuth } = useAuth(authConfig);\ninitializeAuth();\n";
            if (!mainContent.includes("initializeAuth()") && !mainContent.includes("// Initialize authentication")) {
                mainContent = mainContent.replace(
                    /app\.mount\(['"]#app['"]\)/,
                    initCall + "\napp.mount('#app')"
                );
            }
            
            // Only write if we made changes
            const originalContent = fs.readFileSync(mainJsPath, 'utf8');
            if (mainContent !== originalContent) {
                fs.writeFileSync(mainJsPath, mainContent);
                this.log('Updated main.js with auth initialization', 'green');
            } else {
                this.log('main.js already has auth initialization', 'yellow');
            }
        }
    }

    async updateMainStore() {
        const storePath = path.join(this.projectRoot, 'src', 'store', 'index.js');
        
        if (fs.existsSync(storePath)) {
            let storeContent = fs.readFileSync(storePath, 'utf8');
            
            // Add auth module import
            const authImport = "import auth from './modules/auth.js';\n";
            if (!storeContent.includes("import auth from './modules/auth.js'")) {
                storeContent = authImport + storeContent;
            }
            
            // Add auth module to modules
            if (!storeContent.includes('auth,') && storeContent.includes('modules:')) {
                storeContent = storeContent.replace(
                    /modules:\s*{/,
                    'modules: {\n    auth,'
                );
            }
            
            fs.writeFileSync(storePath, storeContent);
        }
    }

    async createAuthConfig() {
        this.log('⚙️ Creating authentication configuration...', 'blue');
        const configStub = path.join(this.stubsPath, 'config', 'auth.js');
        const configDest = path.join(this.projectRoot, 'src', 'config', 'auth.js');
        
        // Ensure config directory exists
        const configDir = path.dirname(configDest);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }
        
        await this.copyFile(configStub, configDest);
    }

    async copyDirectory(src, dest, visited = new Set()) {
        if (!fs.existsSync(src)) return;
        
        // Resolve real path to handle symbolic links
        const realSrc = fs.realpathSync(src);
        
        // Check for circular references
        if (visited.has(realSrc)) {
            this.log(`Skipping circular reference: ${src}`, 'yellow');
            return;
        }
        
        visited.add(realSrc);
        
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const items = fs.readdirSync(src);
        
        for (const item of items) {
            // Skip problematic directories
            if (item === 'node_modules' || item === '.git' || item.startsWith('.')) {
                continue;
            }
            
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            
            try {
                const stats = fs.lstatSync(srcPath);
                
                // Skip symbolic links to avoid infinite recursion
                if (stats.isSymbolicLink()) {
                    this.log(`Skipping symbolic link: ${srcPath}`, 'yellow');
                    continue;
                }
                
                if (stats.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath, visited);
                } else {
                    await this.copyFile(srcPath, destPath);
                }
            } catch (error) {
                this.log(`Error processing ${srcPath}: ${error.message}`, 'yellow');
                continue;
            }
        }
        
        visited.delete(realSrc);
    }

    async copyFile(src, dest) {
        if (!fs.existsSync(src)) {
            this.log(`Warning: Source file ${src} not found`, 'yellow');
            return;
        }
        
        // Don't overwrite existing files, ask user or skip
        if (fs.existsSync(dest)) {
            this.log(`Skipping ${dest} (already exists)`, 'yellow');
            return;
        }
        
        fs.copyFileSync(src, dest);
    }
}

// Run installer
const installer = new Vue3PlateAuthInstaller();
installer.install().catch(console.error); 