import fs from 'fs';
import path from 'path';
import { BrowserWindow, ipcMain } from 'electron';

export interface Extension {
  id: string;
  path: string;
  package: any;
  active: boolean;
  subscriptions: any[];
}

export class ExtensionManager {
  private mainWindow: BrowserWindow;
  private extensions: Map<string, Extension>;
  private watcher: any;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.extensions = new Map();
    this.watcher = null;
  }

  async loadExtensions(extensionsPath: string): Promise<Map<string, Extension>> {
    try {
      console.log(`Loading extensions from: ${extensionsPath}`);
      
      // Ensure extensions directory exists
      if (!fs.existsSync(extensionsPath)) {
        console.log(`Creating extensions directory: ${extensionsPath}`);
        fs.mkdirSync(extensionsPath, { recursive: true });
      }

      const extensionDirs = fs.readdirSync(extensionsPath)
        .filter(dir => {
          const fullPath = path.join(extensionsPath, dir);
          return fs.statSync(fullPath).isDirectory();
        });

      console.log(`Found ${extensionDirs.length} extension directories`);

      for (const dir of extensionDirs) {
        try {
          const extensionPath = path.join(extensionsPath, dir);
          const packageJsonPath = path.join(extensionPath, 'package.json');

          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            
            if (packageJson.name && packageJson.main) {
              console.log(`Loading extension: ${packageJson.name}`);
              
              const extension: Extension = {
                id: packageJson.name,
                path: extensionPath,
                package: packageJson,
                active: false,
                subscriptions: []
              };

              this.extensions.set(extension.id, extension);
              console.log(`Successfully loaded extension: ${extension.id}`);
            } else {
              console.warn(`Skipping extension in ${dir}: Missing name or main in package.json`);
            }
          } else {
            console.warn(`Skipping ${dir}: No package.json found`);
          }
        } catch (error) {
          console.error(`Error loading extension from ${dir}:`, error);
        }
      }

      // Notify renderer after loading extensions
      this.notifyExtensionsUpdated();
      return this.extensions;
    } catch (error) {
      console.error('Error loading extensions:', error);
      throw error;
    }
  }

  notifyExtensionsUpdated(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      // Only send serializable data
      const serializableExtensions = Array.from(this.extensions.values()).map(ext => ({
        id: ext.id,
        package: ext.package,
        active: ext.active
      }));
      this.mainWindow.webContents.send('extensions-updated', serializableExtensions);
    }
  }

  getExtension(id: string): Extension | undefined {
    return this.extensions.get(id);
  }

  getAllExtensions(): Extension[] {
    return Array.from(this.extensions.values());
  }

  async activateExtension(id: string): Promise<Extension> {
    const extension = this.extensions.get(id);
    if (!extension) {
      throw new Error(`Extension ${id} not found`);
    }

    if (!extension.active) {
      try {
        // In ES modules, we don't use require - this is now handled by ExtensionHost
        // Just update our internal state
        extension.active = true;
        console.log(`Extension ${id} marked as active in manager`);
        
        // Notify renderer after activation
        this.notifyExtensionsUpdated();
      } catch (error) {
        console.error(`Error activating extension ${id}:`, error);
        throw error;
      }
    }

    return extension;
  }

  deactivateExtension(id: string): void {
    const extension = this.extensions.get(id);
    if (extension && extension.active) {
      try {
        // Dispose of all subscriptions
        if (extension.subscriptions && extension.subscriptions.length > 0) {
          extension.subscriptions.forEach(sub => sub.dispose());
          extension.subscriptions = [];
        }

        extension.active = false;
        console.log(`Deactivated extension: ${id}`);
      } catch (error) {
        console.error(`Error deactivating extension ${id}:`, error);
      }
    }
  }

  dispose(): void {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

export default ExtensionManager; 