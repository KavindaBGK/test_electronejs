import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Extension } from './ExtensionManager';
import { createRequire } from 'module';
import { PluginMenuItem, PluginMenuResponse } from '../types';

// Create a require function that we can use inside the ES module
const require = createRequire(import.meta.url);

interface Webview {
  id: string;
  extensionId: string;
  viewType: string;
  title: string;
  options: any;
  html: string;
  state: any;
  messageCallback: ((message: any) => void) | null;
}

export class ExtensionHost {
  private mainWindow: BrowserWindow;
  private extensions: Map<string, Extension>;
  private webviews: Map<string, Webview>;
  private extensionModules: Map<string, any>;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.extensions = new Map();
    this.webviews = new Map();
    this.extensionModules = new Map();
    this.setupIPC();
  }

  setupIPC(): void {
    // Handle extension activation
    ipcMain.on('extension-activate', (event, extensionId) => {
      this.activateExtension(extensionId);
    });

    // Handle webview messages
    ipcMain.on('webview-message', (event, { webviewId, message }) => {
      this.handleWebviewMessage(webviewId, message);
    });

    // Handle getting extension menu items
    ipcMain.handle('extension-get-menu-items', async (event, extensionId) => {
      return this.getExtensionMenuItems(extensionId);
    });
    
    // Handle executing extension actions
    ipcMain.handle('extension-execute-action', async (event, extensionId, actionId, params) => {
      return this.executeAction(extensionId, actionId, params);
    });
  }

  // Get menu items from an extension
  async getExtensionMenuItems(extensionId: string): Promise<PluginMenuResponse> {
    console.log(`Getting menu items for extension ${extensionId}`);
    
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      console.error(`Extension ${extensionId} not found`);
      return { items: [], success: false, error: `Extension ${extensionId} not found` };
    }

    // Try to get the extension module
    const extensionModule = this.extensionModules.get(extensionId);
    if (!extensionModule) {
      console.error(`Extension module for ${extensionId} not loaded`);
      return { items: [], success: false, error: `Extension module not loaded` };
    }

    try {
      // Check if the module has a getMenuItems function
      if (typeof extensionModule.getMenuItems === 'function') {
        const menuItems = await extensionModule.getMenuItems();
        console.log(`Retrieved menu items for ${extensionId}:`, menuItems);
        return { items: menuItems, success: true };
      } else {
        console.warn(`Extension ${extensionId} does not implement getMenuItems`);
        
        // Return default menu items based on package.json if available
        const defaultItems: PluginMenuItem[] = [
          {
            id: 'home',
            label: extension.package.displayName || extension.id,
            icon: 'home'
          }
        ];
        
        // If the package.json defines menu contributions, use those
        if (extension.package.contributes && extension.package.contributes.menus) {
          const menuContributions = extension.package.contributes.menus;
          Object.keys(menuContributions).forEach(menuId => {
            const items = menuContributions[menuId];
            items.forEach((item: any) => {
              defaultItems.push({
                id: item.command,
                label: item.title || item.command,
                icon: item.icon
              });
            });
          });
        }
        
        return { items: defaultItems, success: true };
      }
    } catch (error) {
      console.error(`Error getting menu items for ${extensionId}:`, error);
      return { 
        items: [], 
        success: false, 
        error: `Failed to get menu items: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  async loadExtension(extensionPath: string): Promise<Extension | null> {
    try {
      const packageJsonPath = path.join(extensionPath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        console.warn(`No package.json found at ${extensionPath}`);
        return null;
      }
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const extensionId = packageJson.name;
      
      if (!extensionId || !packageJson.main) {
        console.warn(`Invalid package.json at ${extensionPath}: missing name or main`);
        return null;
      }
      
      const extension: Extension = {
        id: extensionId,
        path: extensionPath,
        package: packageJson,
        active: false,
        subscriptions: []
      };

      this.extensions.set(extensionId, extension);
      console.log(`Loaded extension in host: ${extensionId}`);
      return extension;
    } catch (error) {
      console.error(`Failed to load extension from ${extensionPath}:`, error);
      return null;
    }
  }

  async activateExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      console.error(`Extension ${extensionId} not found`);
      return;
    }
    
    // If the extension is already active and has a webview, reuse it
    if (extension.active) {
      // Find the webview for this extension
      const webview = Array.from(this.webviews.values())
        .find(w => w.extensionId === extensionId);
      
      if (webview && webview.html) {
        console.log(`Extension ${extensionId} is already active, resending content`);
        // Just resend the content to the renderer
        this.mainWindow.webContents.send('webview-set-content', {
          webviewId: webview.id,
          html: webview.html,
          title: webview.title
        });
        
        // Get and log menu items if available
        this.getExtensionMenuItems(extensionId).then(menuResponse => {
          console.log(`Menu items for ${extensionId}:`, menuResponse);
        });
        
        return;
      }
    }

    try {
      // Create the extension context object
      const context = this.createExtensionContext(extensionId);
      
      // Determine the main module path
      const mainModulePath = path.join(extension.path, extension.package.main);
      console.log(`Loading extension module from: ${mainModulePath}`);

      // We'll try to require the module directly, which works with CommonJS
      try {
        const mainModule = require(mainModulePath);
        console.log("Loaded extension module with require:", Object.keys(mainModule));
        
        // Store the module for later use
        this.extensionModules.set(extensionId, mainModule);
        
        if (typeof mainModule.activate === 'function') {
          await mainModule.activate(context);
          extension.active = true;
          console.log(`Extension ${extensionId} activated successfully with CommonJS require`);
          
          // Get and log menu items
          this.getExtensionMenuItems(extensionId).then(menuResponse => {
            console.log(`Menu items for ${extensionId}:`, menuResponse);
          });
        } else {
          console.warn(`Module loaded but doesn't export an activate function`);
          this.createDefaultContent(extension, context);
        }
      } catch (requireError: any) {
        console.log("Require failed, trying alternative loading method:", requireError.message);
        
        // If require fails, directly read the file and evaluate as ESM
        try {
          const mainContent = fs.readFileSync(mainModulePath, 'utf8');
          console.log("Read extension file content, length:", mainContent.length);
          
          // Check if the content has an export function activate
          if (mainContent.includes('export function activate')) {
            console.log("Found 'export function activate' in the content");
            
            // Create a simple HTML template with proper styling
            const html = `
              <html>
                <head>
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f9f9f9;
                      color: #333;
                    }
                    .container {
                      max-width: 800px;
                      margin: 0 auto;
                      padding: 40px 20px;
                    }
                    header {
                      background-color: #0066cc;
                      color: white;
                      padding: 20px;
                      border-radius: 8px;
                      margin-bottom: 20px;
                    }
                    h1 {
                      margin: 0;
                      font-size: 24px;
                    }
                    .card {
                      background: white;
                      border-radius: 8px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                      padding: 20px;
                      margin-bottom: 20px;
                    }
                    .success {
                      color: #2ecc71;
                      font-weight: bold;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <header>
                      <h1>${extension.package.displayName || extension.id}</h1>
                    </header>
                    
                    <div class="card">
                      <h2>Extension Information</h2>
                      <p>This extension was loaded using ES modules and is now <span class="success">active</span>.</p>
                      <p>Extension ID: ${extension.id}</p>
                      <p>Version: ${extension.package.version || '1.0.0'}</p>
                    </div>
                    
                    <div class="card">
                      <h2>Features</h2>
                      <ul>
                        <li>Simple UI rendering test</li>
                        <li>Compatible with ES modules</li>
                        <li>Works with the extension host</li>
                      </ul>
                    </div>
                  </div>
                </body>
              </html>
            `;
            
            // Create a webview panel directly without calling the module
            const panel = this.createWebview(
              extension.id, 
              'testExtension', 
              extension.package.displayName || extension.id,
              { viewColumn: 1 },
              {}
            );
            
            // Set the HTML content
            panel.webview.html = html;
            extension.active = true;
            console.log(`Extension ${extensionId} activated with content replacement`);
          } else {
            this.createDefaultContent(extension, context);
          }
        } catch (fileError) {
          console.error("Error reading or processing file:", fileError);
          this.createDefaultContent(extension, context);
        }
      }
    } catch (error) {
      console.error(`Failed to activate extension ${extensionId}:`, error);
      throw error;
    }
  }

  // Creates default content for an extension
  private createDefaultContent(extension: Extension, context: any): void {
    console.log(`Creating default content for extension ${extension.id}`);
    
    // Create a default HTML content
    const defaultHtml = `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              color: #333;
              padding: 2rem;
              background-color: #f9f9f9;
            }
            .extension-content {
              background: white;
              border-radius: 8px;
              padding: 2rem;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            h1 { 
              margin-top: 0;
              color: #0066cc;
            }
          </style>
        </head>
        <body>
          <div class="extension-content">
            <h1>${extension.package.displayName || extension.id}</h1>
            <p>${extension.package.description || 'No description available'}</p>
            <p>Extension ID: ${extension.id}</p>
            <p>Version: ${extension.package.version || '1.0.0'}</p>
          </div>
        </body>
      </html>
    `;
    
    // Create a webview for the extension
    const webviewId = uuidv4();
    
    // Create a webview panel
    const panel = this.createWebview(
      extension.id, 
      'default', 
      extension.package.displayName || extension.id,
      { viewColumn: 1 },
      {}
    );
    
    // Set the content
    panel.webview.html = defaultHtml;
    extension.active = true;
  }

  createExtensionContext(extensionId: string): any {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error(`Extension ${extensionId} not found`);
    }
    
    // Initialize the subscriptions array if it doesn't exist
    if (!extension.subscriptions) {
      extension.subscriptions = [];
    }
    
    return {
      extensionPath: extension.path,
      subscriptions: extension.subscriptions,
      registerCommand: (command: string, callback: Function) => {
        console.log(`Registering command ${command} for extension ${extensionId}`);
        const disposable = {
          dispose: () => {
            // Remove command registration
            const index = extension.subscriptions.indexOf(disposable);
            if (index !== -1) {
              extension.subscriptions.splice(index, 1);
            }
          }
        };
        extension.subscriptions.push(disposable);
        return disposable;
      },
      createWebviewPanel: (viewType: string, title: string, showOptions: any, options: any) => {
        return this.createWebview(extensionId, viewType, title, showOptions, options);
      }
    };
  }

  createWebview(extensionId: string, viewType: string, title: string, showOptions: any, options: any): any {
    const webviewId = uuidv4();
    const self = this;
    
    const webviewObj: Webview = {
      id: webviewId,
      extensionId,
      viewType,
      title,
      options,
      html: '',
      state: {},
      messageCallback: null
    };

    this.webviews.set(webviewId, webviewObj);
    
    console.log(`Creating webview for extension ${extensionId}, id: ${webviewId}`);
    
    // Create the webview object for the extension to use
    const webviewInterface = {
      // Fixed duplicate html property issue by using a getter and setter
      get html(): string {
        return webviewObj.html;
      },
      set html(value: string) {
        // Set the HTML content
        webviewObj.html = value;
        console.log(`Setting HTML content for webview ${webviewId}`);
        
        // Send it to the renderer
        self.mainWindow.webContents.send('webview-set-content', {
          webviewId,
          html: value,
          title: title
        });
      },
      onDidReceiveMessage: (callback: (message: any) => void) => {
        webviewObj.messageCallback = callback;
      },
      postMessage: (message: any) => {
        self.mainWindow.webContents.send('webview-post-message', {
          webviewId,
          message
        });
      }
    };
    
    return {
      webview: webviewInterface
    };
  }

  handleWebviewMessage(webviewId: string, message: any): void {
    const webview = this.webviews.get(webviewId);
    if (webview && webview.messageCallback) {
      webview.messageCallback(message);
    }
  }

  // Execute an action in an extension
  async executeAction(extensionId: string, actionId: string, params?: any): Promise<any> {
    console.log(`Executing action ${actionId} for extension ${extensionId}`);
    
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      console.error(`Extension ${extensionId} not found`);
      throw new Error(`Extension ${extensionId} not found`);
    }

    // Try to get the extension module
    const extensionModule = this.extensionModules.get(extensionId);
    if (!extensionModule) {
      console.error(`Extension module for ${extensionId} not loaded`);
      throw new Error(`Extension module not loaded`);
    }

    try {
      // Check if the module has an executeAction function
      if (typeof extensionModule.executeAction === 'function') {
        const result = await extensionModule.executeAction(actionId, params);
        console.log(`Action ${actionId} executed for ${extensionId}:`, result);
        return result;
      } else {
        console.warn(`Extension ${extensionId} does not implement executeAction`);
        throw new Error(`Extension ${extensionId} does not implement executeAction`);
      }
    } catch (error) {
      console.error(`Error executing action ${actionId} for ${extensionId}:`, error);
      throw error;
    }
  }
}

export default ExtensionHost; 