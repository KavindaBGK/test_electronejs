/**
 * Sample Plugin
 * 
 * This is a sample plugin that demonstrates the plugin interface.
 */

// Store a reference to the plugin context
let context;

/**
 * Activate the plugin
 * @param {Object} pluginContext - The plugin context
 */
function activate(pluginContext) {
  console.log('Sample plugin activated');
  context = pluginContext;

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

  // Create a basic webview
  const panel = context.createWebviewPanel(
    'sample-plugin',
    'Sample Plugin',
    { viewColumn: 1 },
    {}
  );

  // Set the HTML content
  panel.webview.html = `
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
        </script>
      </body>
    </html>
  `;

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
    }
  });
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
      action: 'sample-plugin.info'
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
    })
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