import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

// Dynamically import because these modules use CommonJS format
let ExtensionManager: any;
let ExtensionHost: any;

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let extensionManager: any;
let extensionHost: any;

async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow loading local files with file:// protocol
    },
  })

  // For debugging
  win.webContents.openDevTools();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    
    // Initialize extension services after window has loaded
    initializeExtensionServices();
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Initialize extension manager and host
async function initializeExtensionServices() {
  if (!win) return;

  try {
    // In development mode, import directly from source
    // In production, these would be from the built files
    console.log("Loading extension services from source...");
    
    // Use direct imports during development
    const ExtensionManagerModule = await import('../src/services/ExtensionManager');
    const ExtensionHostModule = await import('../src/services/ExtensionHost');
    
    console.log("Module imports:", {
      managerKeys: Object.keys(ExtensionManagerModule),
      hostKeys: Object.keys(ExtensionHostModule)
    });
    
    // Get the default exports
    ExtensionManager = ExtensionManagerModule.default;
    ExtensionHost = ExtensionHostModule.default;
    
    console.log("Got constructors:", { 
      managerType: typeof ExtensionManager, 
      hostType: typeof ExtensionHost 
    });
    
    console.log("Creating extension services...");
    extensionManager = new ExtensionManager(win);
    extensionHost = new ExtensionHost(win);

    // Set up IPC handlers for extension management
    setupExtensionIPC();
    
    // Load extensions
    const extensionsPath = path.join(process.env.APP_ROOT, 'src/extensions');
    console.log(`Extensions path: ${extensionsPath}`);
    await loadExtensions(extensionsPath);
  } catch (error) {
    console.error('Failed to initialize extension services:', error);
    console.error(error);
  }
}

// Set up IPC communication for extension management
function setupExtensionIPC() {
  // Handle get-extensions request
  ipcMain.on('get-extensions', () => {
    if (extensionManager) {
      console.log("Received get-extensions request, notifying renderer");
      extensionManager.notifyExtensionsUpdated();
    }
  });
  
  // Extension activation
  ipcMain.on('extension-activate', async (event, extensionId) => {
    console.log(`Activating extension ${extensionId} from UI request`);
    if (extensionHost && extensionManager) {
      try {
        await extensionHost.activateExtension(extensionId);
        console.log(`Extension ${extensionId} activated successfully from UI request`);
        
        // Update the manager's internal state
        const extension = extensionManager.getExtension(extensionId);
        if (extension) {
          extension.active = true;
          extensionManager.notifyExtensionsUpdated();
        }
      } catch (error: any) {
        console.error(`Error activating extension ${extensionId} from UI:`, error);
      }
    }
  });
}

// Load extensions from the specified path
async function loadExtensions(extensionsPath: string) {
  try {
    console.log(`Loading extensions from: ${extensionsPath}`);
    
    // Ensure extensions directory exists
    if (!fs.existsSync(extensionsPath)) {
      console.log(`Creating extensions directory: ${extensionsPath}`);
      fs.mkdirSync(extensionsPath, { recursive: true });
    }
    
    // Load extensions in manager
    if (extensionManager) {
      try {
        await extensionManager.loadExtensions(extensionsPath);
        console.log("Extensions loaded in manager successfully");
      } catch (managerError) {
        console.error("Error loading extensions in manager:", managerError);
      }
    }
    
    // Load extensions in host
    if (extensionHost) {
      const extensionDirs = fs.readdirSync(extensionsPath)
        .filter(dir => {
          const fullPath = path.join(extensionsPath, dir);
          return fs.statSync(fullPath).isDirectory();
        });
          
      console.log(`Found ${extensionDirs.length} extension directories to load in host`);
      
      for (const dir of extensionDirs) {
        try {
          const extensionPath = path.join(extensionsPath, dir);
          console.log(`Loading extension in host from: ${extensionPath}`);
          await extensionHost.loadExtension(extensionPath);
        } catch (hostError) {
          console.error(`Error loading extension ${dir} in host:`, hostError);
        }
      }
      
      console.log('Extensions loaded in host successfully');
    }
    
    console.log('Extensions loading complete');
  } catch (error) {
    console.error('Unexpected error loading extensions:', error);
  }
}

// Helper function to copy a directory
function copyDir(source: string, target: string) {
  // Read the contents of the source directory
  const files = fs.readdirSync(source);
  
  // Process each file/directory
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    // If it's a directory, recursively copy its contents
    if (fs.statSync(sourcePath).isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true });
      copyDir(sourcePath, targetPath);
    } 
    // Otherwise just copy the file
    else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
