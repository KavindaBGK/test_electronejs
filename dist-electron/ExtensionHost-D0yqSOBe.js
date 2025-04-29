var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
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
class ExtensionHost {
  constructor(mainWindow) {
    __publicField(this, "mainWindow");
    __publicField(this, "extensions");
    __publicField(this, "webviews");
    this.mainWindow = mainWindow;
    this.extensions = /* @__PURE__ */ new Map();
    this.webviews = /* @__PURE__ */ new Map();
    this.setupIPC();
  }
  setupIPC() {
    ipcMain.on("extension-activate", (event, extensionId) => {
      this.activateExtension(extensionId);
    });
    ipcMain.on("webview-message", (event, { webviewId, message }) => {
      this.handleWebviewMessage(webviewId, message);
    });
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
    if (!extension || extension.active) return;
    try {
      const mainModulePath = path.join(extension.path, extension.package.main);
      const moduleUrl = new URL(`file://${mainModulePath}`).toString();
      console.log(`Loading module from: ${moduleUrl}`);
      const moduleExports = {
        activate: async (context2) => {
          const webviewId = v4();
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
          this.mainWindow.webContents.send("webview-set-content", {
            webviewId,
            html: defaultHtml,
            title: extension.package.displayName || extension.id
          });
          this.webviews.set(webviewId, {
            id: webviewId,
            extensionId,
            viewType: "default",
            title: extension.package.displayName || extension.id,
            options: {},
            html: defaultHtml,
            state: {},
            messageCallback: null
          });
        }
      };
      const context = this.createExtensionContext(extensionId);
      await moduleExports.activate(context);
      extension.active = true;
      console.log(`Extension ${extensionId} activated successfully`);
    } catch (error) {
      console.error(`Failed to activate extension ${extensionId}:`, error);
      throw error;
    }
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
      webviewId,
      webview: webviewInterface
    };
  }
  handleWebviewMessage(webviewId, message) {
    const webview = this.webviews.get(webviewId);
    if (webview && webview.messageCallback) {
      webview.messageCallback(message);
    }
  }
}
export {
  ExtensionHost,
  ExtensionHost as default
};
