/**
 * Sample Plugin
 * 
 * This is a sample plugin that demonstrates the plugin interface.
 */

// Store a reference to the plugin context
let context;
let panel;
let currentPage = 'home';
let fs;

// Function to read file content
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * Activate the plugin
 * @param {Object} pluginContext - The plugin context
 */
function activate(pluginContext) {
  console.log('Sample plugin activated');
  context = pluginContext;
  fs = require('fs');

  // Register some commands
  context.registerCommand('sample-plugin.hello', () => {
    console.log('Hello from sample plugin!');
    return { message: 'Hello from sample plugin!' };
  });

  context.registerCommand('sample-plugin.info', () => {
    console.log('Showing plugin info');
    return { 
      plugin: 'Sample Plugin',
      version: '1.0.0',
      author: 'You'
    };
  });

  context.registerCommand('sample-plugin.settings', () => {
    console.log('Navigating to settings page');
    navigateToPage('settings');
    return { success: true };
  });

  // Create a basic webview
  panel = context.createWebviewPanel(
    'sample-plugin',
    'Sample Plugin',
    { viewColumn: 1 },
    {}
  );

  // Render the home page initially
  navigateToPage('home');

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage((message) => {
    console.log('Received message from webview:', message);
    
    if (message.command === 'hello') {
      panel.webview.postMessage({ 
        command: 'response', 
        id: 'hello',
        data: 'Hello from the extension host!' 
      });
    } else if (message.command === 'info') {
      panel.webview.postMessage({ 
        command: 'response', 
        id: 'info',
        data: {
          name: 'Sample Plugin',
          version: '1.0.0',
          author: 'You'
        }
      });
    } else if (message.command === 'navigate-home') {
      navigateToPage('home');
    } else if (message.command === 'navigate-settings') {
      navigateToPage('settings');
    } else if (message.command === 'save-settings') {
      console.log('Saving settings:', message.settings);
      panel.webview.postMessage({ 
        command: 'settings-saved', 
        success: true 
      });
    } else if (message.command === 'reset-settings') {
      console.log('Resetting settings to defaults');
      panel.webview.postMessage({ 
        command: 'settings-reset', 
        success: true 
      });
    }
  });
}

/**
 * Navigate to a specific page
 * @param {string} page - The page to navigate to
 */
function navigateToPage(page) {
  currentPage = page;
  console.log(`Navigating to ${page} page`);
  
  if (page === 'settings') {
    // Try to load settings.html file
    const settingsPath = require('path').join(context.extensionPath, 'settings.html');
    const settingsHtml = readFileContent(settingsPath);
    
    if (settingsHtml) {
      panel.webview.html = settingsHtml;
    } else {
      // Fallback to inline HTML if file not found
      panel.webview.html = getSettingsHtml();
    }
  } else {
    // Default to home page
    panel.webview.html = getHomeHtml();
  }
}

/**
 * Get the HTML for the home page
 * @returns {string} The HTML content
 */
function getHomeHtml() {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 20px;
            color: #333;
            background-color: #f5f5f5;
          }
          h1 {
            color: #0066cc;
          }
          .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0055aa;
          }
          .nav-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Sample Plugin</h1>
        
        <div class="card">
          <h2>Welcome!</h2>
          <p>This is a sample plugin that demonstrates the plugin interface.</p>
          <button id="hello-btn">Say Hello</button>
        </div>
        
        <div class="card">
          <h2>Plugin Info</h2>
          <p>Version: 1.0.0</p>
          <p>Author: You</p>
          <button id="info-btn">Show Info</button>
        </div>
        
        <div class="nav-buttons">
          <button id="settings-btn">Go to Settings</button>
        </div>
        
        <script>
          // Set up message passing
          const vscode = {
            postMessage: (message) => {
              window.parent.postMessage(message, '*');
            }
          };
          
          // Handle messages from the extension host
          window.addEventListener('message', (event) => {
            const message = event.data;
            console.log('Received message:', message);
          });
          
          // Set up button click handlers
          document.getElementById('hello-btn').addEventListener('click', () => {
            vscode.postMessage({ command: 'hello' });
          });
          
          document.getElementById('info-btn').addEventListener('click', () => {
            vscode.postMessage({ command: 'info' });
          });
          
          document.getElementById('settings-btn').addEventListener('click', () => {
            vscode.postMessage({ command: 'navigate-settings' });
          });
        </script>
      </body>
    </html>
  `;
}

/**
 * Get the HTML for the settings page
 * @returns {string} The HTML content
 */
function getSettingsHtml() {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 20px;
            color: #333;
            background-color: #f5f5f5;
          }
          h1 {
            color: #0066cc;
          }
          .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
          }
          input, select, textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0055aa;
          }
          .button-row {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }
          .back-button {
            background-color: #6c757d;
          }
          .back-button:hover {
            background-color: #5a6268;
          }
        </style>
      </head>
      <body>
        <h1>Plugin Settings</h1>
        
        <div class="card">
          <h2>General Settings</h2>
          <form id="settings-form">
            <div>
              <label for="plugin-name">Plugin Name</label>
              <input type="text" id="plugin-name" value="Sample Plugin" />
            </div>
            
            <div>
              <label for="plugin-description">Description</label>
              <textarea id="plugin-description" rows="3">A sample plugin to demonstrate the plugin interface</textarea>
            </div>
            
            <div>
              <label for="plugin-version">Version</label>
              <input type="text" id="plugin-version" value="1.0.0" />
            </div>
            
            <div>
              <label for="plugin-author">Author</label>
              <input type="text" id="plugin-author" value="You" />
            </div>
            
            <div>
              <label for="plugin-theme">Theme</label>
              <select id="plugin-theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div class="button-row">
              <button type="button" id="save-btn">Save Settings</button>
              <button type="button" id="back-btn" class="back-button">Back to Home</button>
            </div>
          </form>
        </div>
        
        <div class="card">
          <h2>Advanced Settings</h2>
          <div>
            <label for="plugin-debug">Debug Mode</label>
            <select id="plugin-debug">
              <option value="off">Off</option>
              <option value="errors">Errors Only</option>
              <option value="verbose">Verbose</option>
            </select>
          </div>
          
          <div>
            <label for="plugin-cache">Cache Size (MB)</label>
            <input type="number" id="plugin-cache" value="10" min="0" max="100" />
          </div>
          
          <button type="button" id="reset-btn">Reset to Defaults</button>
        </div>
        
        <script>
          // Set up message passing
          const vscode = {
            postMessage: (message) => {
              window.parent.postMessage(message, '*');
            }
          };
          
          // Handle messages from the extension host
          window.addEventListener('message', (event) => {
            const message = event.data;
            console.log('Received message:', message);
          });
          
          // Set up button click handlers
          document.getElementById('save-btn').addEventListener('click', () => {
            const settings = {
              name: document.getElementById('plugin-name').value,
              description: document.getElementById('plugin-description').value,
              version: document.getElementById('plugin-version').value,
              author: document.getElementById('plugin-author').value,
              theme: document.getElementById('plugin-theme').value,
              debug: document.getElementById('plugin-debug').value,
              cache: document.getElementById('plugin-cache').value
            };
            
            vscode.postMessage({ 
              command: 'save-settings',
              settings
            });
          });
          
          document.getElementById('reset-btn').addEventListener('click', () => {
            vscode.postMessage({ command: 'reset-settings' });
          });
          
          document.getElementById('back-btn').addEventListener('click', () => {
            vscode.postMessage({ command: 'navigate-home' });
          });
        </script>
      </body>
    </html>
  `;
}

/**
 * Get menu items for the plugin
 * @returns {Array} The menu items
 */
function getMenuItems() {
  return [
    {
      id: 'home',
      label: 'Home',
      icon: 'home'
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: 'menu',
      children: [
        {
          id: 'hello',
          label: 'Say Hello',
          action: 'sample-plugin.hello'
        },
        {
          id: 'info',
          label: 'Show Info',
          action: 'sample-plugin.info'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      action: 'sample-plugin.settings'
    }
  ];
}

/**
 * Execute an action in the plugin
 * @param {string} actionId - The action ID to execute
 * @param {Object} params - The parameters for the action
 * @returns {Promise<any>} The result of the action
 */
async function executeAction(actionId, params) {
  console.log(`Executing action ${actionId} with params:`, params);
  
  // Map action IDs to commands
  const actionMap = {
    'sample-plugin.hello': () => ({ message: 'Hello from sample plugin!' }),
    'sample-plugin.info': () => ({ 
      plugin: 'Sample Plugin',
      version: '1.0.0',
      author: 'You'
    }),
    'sample-plugin.settings': () => {
      navigateToPage('settings');
      return { success: true };
    }
  };
  
  if (actionMap[actionId]) {
    return actionMap[actionId](params);
  } else {
    throw new Error(`Unknown action: ${actionId}`);
  }
}

// Export the plugin API
module.exports = {
  activate,
  getMenuItems,
  executeAction
}; 