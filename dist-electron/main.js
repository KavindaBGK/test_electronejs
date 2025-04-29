import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
let ExtensionManager;
let ExtensionHost;
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let extensionManager;
let extensionHost;
async function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
      // Allow loading local files with file:// protocol
    }
  });
  win.webContents.openDevTools();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    initializeExtensionServices();
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
async function initializeExtensionServices() {
  if (!win) return;
  try {
    console.log("Loading extension services from source...");
    const ExtensionManagerModule = await import("./ExtensionManager-CzMu_CCN.js");
    const ExtensionHostModule = await import("./ExtensionHost-B1Twzdnm.js");
    console.log("Module imports:", {
      managerKeys: Object.keys(ExtensionManagerModule),
      hostKeys: Object.keys(ExtensionHostModule)
    });
    ExtensionManager = ExtensionManagerModule.default;
    ExtensionHost = ExtensionHostModule.default;
    console.log("Got constructors:", {
      managerType: typeof ExtensionManager,
      hostType: typeof ExtensionHost
    });
    console.log("Creating extension services...");
    extensionManager = new ExtensionManager(win);
    extensionHost = new ExtensionHost(win);
    setupExtensionIPC();
    const extensionsPath = path.join(process.env.APP_ROOT, "src/extensions");
    console.log(`Extensions path: ${extensionsPath}`);
    await loadExtensions(extensionsPath);
  } catch (error) {
    console.error("Failed to initialize extension services:", error);
    console.error(error);
  }
}
function setupExtensionIPC() {
  ipcMain.on("get-extensions", () => {
    if (extensionManager) {
      console.log("Received get-extensions request, notifying renderer");
      extensionManager.notifyExtensionsUpdated();
    }
  });
  ipcMain.on("extension-activate", async (event, extensionId) => {
    console.log(`Activating extension ${extensionId} from UI request`);
    if (extensionHost && extensionManager) {
      try {
        await extensionHost.activateExtension(extensionId);
        console.log(`Extension ${extensionId} activated successfully from UI request`);
        const extension = extensionManager.getExtension(extensionId);
        if (extension) {
          extension.active = true;
          extensionManager.notifyExtensionsUpdated();
        }
      } catch (error) {
        console.error(`Error activating extension ${extensionId} from UI:`, error);
      }
    }
  });
}
async function loadExtensions(extensionsPath) {
  try {
    console.log(`Loading extensions from: ${extensionsPath}`);
    if (!fs.existsSync(extensionsPath)) {
      console.log(`Creating extensions directory: ${extensionsPath}`);
      fs.mkdirSync(extensionsPath, { recursive: true });
    }
    if (extensionManager) {
      try {
        await extensionManager.loadExtensions(extensionsPath);
        console.log("Extensions loaded in manager successfully");
      } catch (managerError) {
        console.error("Error loading extensions in manager:", managerError);
      }
    }
    if (extensionHost) {
      const extensionDirs = fs.readdirSync(extensionsPath).filter((dir) => {
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
      console.log("Extensions loaded in host successfully");
    }
    console.log("Extensions loading complete");
  } catch (error) {
    console.error("Unexpected error loading extensions:", error);
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
