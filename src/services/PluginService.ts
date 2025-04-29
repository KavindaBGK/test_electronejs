import { ipcRenderer } from 'electron';
import { PluginMenuResponse } from '../types';

/**
 * Service for communicating with plugins/extensions
 */
class PluginService {
  /**
   * Get menu items from a plugin
   * @param extensionId The ID of the extension/plugin
   * @returns A promise that resolves to the plugin menu items
   */
  async getMenuItems(extensionId: string): Promise<PluginMenuResponse> {
    try {
      console.log(`Getting menu items for extension ${extensionId}`);
      const response = await ipcRenderer.invoke('extension-get-menu-items', extensionId);
      console.log(`Menu items response:`, response);
      return response;
    } catch (error) {
      console.error(`Error getting menu items for ${extensionId}:`, error);
      return {
        items: [],
        success: false,
        error: `Failed to get menu items: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Execute an action in a plugin
   * @param extensionId The ID of the extension/plugin
   * @param actionId The ID of the action to execute
   * @param params Optional parameters for the action
   * @returns A promise that resolves to the result of the action
   */
  async executeAction(extensionId: string, actionId: string, params?: any): Promise<any> {
    try {
      console.log(`Executing action ${actionId} for extension ${extensionId}`);
      return await ipcRenderer.invoke('extension-execute-action', extensionId, actionId, params);
    } catch (error) {
      console.error(`Error executing action ${actionId} for ${extensionId}:`, error);
      throw error;
    }
  }
}

export default new PluginService(); 