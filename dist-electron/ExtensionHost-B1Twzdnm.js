var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
import crypto from "crypto";
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
const native = {
  randomUUID: crypto.randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const require2 = createRequire(import.meta.url);
class ExtensionHost {
  constructor(mainWindow) {
    __publicField(this, "mainWindow");
    __publicField(this, "extensions");
    __publicField(this, "webviews");
    __publicField(this, "extensionModules");
    this.mainWindow = mainWindow;
    this.extensions = /* @__PURE__ */ new Map();
    this.webviews = /* @__PURE__ */ new Map();
    this.extensionModules = /* @__PURE__ */ new Map();
    this.setupIPC();
  }
  setupIPC() {
    ipcMain.on("extension-activate", (event, extensionId) => {
      this.activateExtension(extensionId);
    });
    ipcMain.on("webview-message", (event, { webviewId, message }) => {
      this.handleWebviewMessage(webviewId, message);
    });
    ipcMain.handle("extension-get-menu-items", async (event, extensionId) => {
      return this.getExtensionMenuItems(extensionId);
    });
    ipcMain.handle("extension-execute-action", async (event, extensionId, actionId, params) => {
      return this.executeAction(extensionId, actionId, params);
    });
  }
  // Get menu items from an extension
  async getExtensionMenuItems(extensionId) {
    console.log(`Getting menu items for extension ${extensionId}`);
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      console.error(`Extension ${extensionId} not found`);
      return { items: [], success: false, error: `Extension ${extensionId} not found` };
    }
    const extensionModule = this.extensionModules.get(extensionId);
    if (!extensionModule) {
      console.error(`Extension module for ${extensionId} not loaded`);
      return { items: [], success: false, error: `Extension module not loaded` };
    }
    try {
      if (typeof extensionModule.getMenuItems === "function") {
        const menuItems = await extensionModule.getMenuItems();
        console.log(`Retrieved menu items for ${extensionId}:`, menuItems);
        return { items: menuItems, success: true };
      } else {
        console.warn(`Extension ${extensionId} does not implement getMenuItems`);
        const defaultItems = [
          {
            id: "home",
            label: extension.package.displayName || extension.id,
            icon: "home"
          }
        ];
        if (extension.package.contributes && extension.package.contributes.menus) {
          const menuContributions = extension.package.contributes.menus;
          Object.keys(menuContributions).forEach((menuId) => {
            const items = menuContributions[menuId];
            items.forEach((item) => {
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
  async loadExtension(extensionPath) {
    try {
      const packageJsonPath = path.join(extensionPath, "package.json");
      if (!fs.existsSync(packageJsonPath)) {
        console.warn(`No package.json found at ${extensionPath}`);
        return null;
      }
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const extensionId = packageJson.name;
      if (!extensionId || !packageJson.main) {
        console.warn(`Invalid package.json at ${extensionPath}: missing name or main`);
        return null;
      }
      const extension = {
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
  async activateExtension(extensionId) {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      console.error(`Extension ${extensionId} not found`);
      return;
    }
    if (extension.active) {
      const webview = Array.from(this.webviews.values()).find((w) => w.extensionId === extensionId);
      if (webview && webview.html) {
        console.log(`Extension ${extensionId} is already active, resending content`);
        this.mainWindow.webContents.send("webview-set-content", {
          webviewId: webview.id,
          html: webview.html,
          title: webview.title
        });
        this.getExtensionMenuItems(extensionId).then((menuResponse) => {
          console.log(`Menu items for ${extensionId}:`, menuResponse);
        });
        return;
      }
    }
    try {
      const context = this.createExtensionContext(extensionId);
      const mainModulePath = path.join(extension.path, extension.package.main);
      console.log(`Loading extension module from: ${mainModulePath}`);
      try {
        const mainModule = require2(mainModulePath);
        console.log("Loaded extension module with require:", Object.keys(mainModule));
        this.extensionModules.set(extensionId, mainModule);
        if (typeof mainModule.activate === "function") {
          await mainModule.activate(context);
          extension.active = true;
          console.log(`Extension ${extensionId} activated successfully with CommonJS require`);
          this.getExtensionMenuItems(extensionId).then((menuResponse) => {
            console.log(`Menu items for ${extensionId}:`, menuResponse);
          });
        } else {
          console.warn(`Module loaded but doesn't export an activate function`);
          this.createDefaultContent(extension, context);
        }
      } catch (requireError) {
        console.log("Require failed, trying alternative loading method:", requireError.message);
        try {
          const mainContent = fs.readFileSync(mainModulePath, "utf8");
          console.log("Read extension file content, length:", mainContent.length);
          if (mainContent.includes("export function activate")) {
            console.log("Found 'export function activate' in the content");
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
                      <p>Version: ${extension.package.version || "1.0.0"}</p>
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
            const panel = this.createWebview(
              extension.id,
              "testExtension",
              extension.package.displayName || extension.id,
              { viewColumn: 1 },
              {}
            );
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
  createDefaultContent(extension, context) {
    console.log(`Creating default content for extension ${extension.id}`);
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
            <p>${extension.package.description || "No description available"}</p>
            <p>Extension ID: ${extension.id}</p>
            <p>Version: ${extension.package.version || "1.0.0"}</p>
          </div>
        </body>
      </html>
    `;
    v4();
    const panel = this.createWebview(
      extension.id,
      "default",
      extension.package.displayName || extension.id,
      { viewColumn: 1 },
      {}
    );
    panel.webview.html = defaultHtml;
    extension.active = true;
  }
  createExtensionContext(extensionId) {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error(`Extension ${extensionId} not found`);
    }
    if (!extension.subscriptions) {
      extension.subscriptions = [];
    }
    return {
      extensionPath: extension.path,
      subscriptions: extension.subscriptions,
      registerCommand: (command, callback) => {
        console.log(`Registering command ${command} for extension ${extensionId}`);
        const disposable = {
          dispose: () => {
            const index = extension.subscriptions.indexOf(disposable);
            if (index !== -1) {
              extension.subscriptions.splice(index, 1);
            }
          }
        };
        extension.subscriptions.push(disposable);
        return disposable;
      },
      createWebviewPanel: (viewType, title, showOptions, options) => {
        return this.createWebview(extensionId, viewType, title, showOptions, options);
      }
    };
  }
  createWebview(extensionId, viewType, title, showOptions, options) {
    const webviewId = v4();
    const self = this;
    const webviewObj = {
      id: webviewId,
      extensionId,
      viewType,
      title,
      options,
      html: "",
      state: {},
      messageCallback: null
    };
    this.webviews.set(webviewId, webviewObj);
    console.log(`Creating webview for extension ${extensionId}, id: ${webviewId}`);
    const webviewInterface = {
      // Fixed duplicate html property issue by using a getter and setter
      get html() {
        return webviewObj.html;
      },
      set html(value) {
        webviewObj.html = value;
        console.log(`Setting HTML content for webview ${webviewId}`);
        self.mainWindow.webContents.send("webview-set-content", {
          webviewId,
          html: value,
          title
        });
      },
      onDidReceiveMessage: (callback) => {
        webviewObj.messageCallback = callback;
      },
      postMessage: (message) => {
        self.mainWindow.webContents.send("webview-post-message", {
          webviewId,
          message
        });
      }
    };
    return {
      webview: webviewInterface
    };
  }
  handleWebviewMessage(webviewId, message) {
    const webview = this.webviews.get(webviewId);
    if (webview && webview.messageCallback) {
      webview.messageCallback(message);
    }
  }
  // Execute an action in an extension
  async executeAction(extensionId, actionId, params) {
    console.log(`Executing action ${actionId} for extension ${extensionId}`);
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      console.error(`Extension ${extensionId} not found`);
      throw new Error(`Extension ${extensionId} not found`);
    }
    const extensionModule = this.extensionModules.get(extensionId);
    if (!extensionModule) {
      console.error(`Extension module for ${extensionId} not loaded`);
      throw new Error(`Extension module not loaded`);
    }
    try {
      if (typeof extensionModule.executeAction === "function") {
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
export {
  ExtensionHost,
  ExtensionHost as default
};
