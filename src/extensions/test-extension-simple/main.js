// This is a simple test extension for ES modules in Electron
export function activate(context) {
  console.log("Simple extension activated!");
  
  // Create a simple UI
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
            <h1>Simple Test Extension</h1>
          </header>
          
          <div class="card">
            <h2>Extension Information</h2>
            <p>This extension was loaded using ES modules and is now <span class="success">active</span>.</p>
            <p>Extension ID: test-extension-simple</p>
            <p>Version: 1.0.0</p>
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
  
  // Create a webview panel
  const panel = context.createWebviewPanel(
    'testExtensionSimple',
    'Simple Test Extension',
    { viewColumn: 1 },
    {}
  );
  
  // Set the HTML content
  panel.webview.html = html;
} 