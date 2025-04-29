var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import fs from "fs";
import path from "path";
class ExtensionManager {
  constructor(mainWindow) {
    __publicField(this, "mainWindow");
    __publicField(this, "extensions");
    __publicField(this, "watcher");
    this.mainWindow = mainWindow;
    this.extensions = /* @__PURE__ */ new Map();
    this.watcher = null;
  }
  async loadExtensions(extensionsPath) {
    try {
      console.log(`Loading extensions from: ${extensionsPath}`);
      if (!fs.existsSync(extensionsPath)) {
        console.log(`Creating extensions directory: ${extensionsPath}`);
        fs.mkdirSync(extensionsPath, { recursive: true });
      }
      const extensionDirs = fs.readdirSync(extensionsPath).filter((dir) => {
        const fullPath = path.join(extensionsPath, dir);
        return fs.statSync(fullPath).isDirectory();
      });
      console.log(`Found ${extensionDirs.length} extension directories`);
      for (const dir of extensionDirs) {
        try {
          const extensionPath = path.join(extensionsPath, dir);
          const packageJsonPath = path.join(extensionPath, "package.json");
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
            if (packageJson.name && packageJson.main) {
              console.log(`Loading extension: ${packageJson.name}`);
              const extension = {
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
      this.notifyExtensionsUpdated();
      return this.extensions;
    } catch (error) {
      console.error("Error loading extensions:", error);
      throw error;
    }
  }
  notifyExtensionsUpdated() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      const serializableExtensions = Array.from(this.extensions.values()).map((ext) => ({
        id: ext.id,
        package: ext.package,
        active: ext.active
      }));
      this.mainWindow.webContents.send("extensions-updated", serializableExtensions);
    }
  }
  getExtension(id) {
    return this.extensions.get(id);
  }
  getAllExtensions() {
    return Array.from(this.extensions.values());
  }
  async activateExtension(id) {
    const extension = this.extensions.get(id);
    if (!extension) {
      throw new Error(`Extension ${id} not found`);
    }
    if (!extension.active) {
      try {
        extension.active = true;
        console.log(`Extension ${id} marked as active in manager`);
        this.notifyExtensionsUpdated();
      } catch (error) {
        console.error(`Error activating extension ${id}:`, error);
        throw error;
      }
    }
    return extension;
  }
  deactivateExtension(id) {
    const extension = this.extensions.get(id);
    if (extension && extension.active) {
      try {
        if (extension.subscriptions && extension.subscriptions.length > 0) {
          extension.subscriptions.forEach((sub) => sub.dispose());
          extension.subscriptions = [];
        }
        extension.active = false;
        console.log(`Deactivated extension: ${id}`);
      } catch (error) {
        console.error(`Error deactivating extension ${id}:`, error);
      }
    }
  }
  dispose() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}
export {
  ExtensionManager,
  ExtensionManager as default
};
