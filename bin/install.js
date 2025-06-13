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
        return packageJson.name && packageJson.name.includes('vue3plate');
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
        
        await this.copyFile(srcStore, destStore);
        
        // Update main store to include auth module
        await this.updateMainStore();
    }

    async copyComposables() {
        this.log('🔧 Copying authentication composables...', 'blue');
        const srcComposables = path.join(this.packageRoot, 'src', 'composables');
        const destComposables = path.join(this.projectRoot, 'src', 'composables');
        
        await this.copyDirectory(srcComposables, destComposables);
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
            const authImport = "import { initAuth } from './composables/useAuth.js';\n";
            if (!mainContent.includes("import { initAuth }")) {
                mainContent = authImport + mainContent;
            }
            
            // Add auth initialization before app mount
            const initCall = "\n// Initialize authentication\nawait initAuth();\n";
            if (!mainContent.includes("initAuth()")) {
                mainContent = mainContent.replace(
                    /app\.mount\(['"]#app['"]\)/,
                    initCall + "\napp.mount('#app')"
                );
            }
            
            fs.writeFileSync(mainJsPath, mainContent);
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

    async copyDirectory(src, dest) {
        if (!fs.existsSync(src)) return;
        
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const items = fs.readdirSync(src);
        
        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            
            if (fs.statSync(srcPath).isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await this.copyFile(srcPath, destPath);
            }
        }
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