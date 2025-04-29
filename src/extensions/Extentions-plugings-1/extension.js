// Create a compatibility layer instead of requiring vscode
let vscode;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Initialize our compatibility layer to map VS Code API to our platform API
    vscode = createVSCodeCompatLayer(context);
    
    console.log('Extension "simple-form-extension" is now active!');

    // Function to show the form
    function showForm() {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel(
            'simpleForm', // Identifies the type of the webview
            'Simple Form', // Title of the panel displayed to the user
            vscode.ViewColumn.One, // Editor column to show the new webview panel in
            {
                // Enable scripts in the webview
                enableScripts: true
            }
        );

        // Set the HTML content
        panel.webview.html = getWebviewContent();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'submit':
                        vscode.window.showInformationMessage(`Form submitted! Text1: ${message.text1}, Text2: ${message.text2}`);
                        return;
                    case 'navigate':
                        vscode.window.showInformationMessage(`Navigated to: ${message.section}`);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    }

    // Register the command
    let disposable = vscode.commands.registerCommand('simple-form-extension.showForm', showForm);
    context.subscriptions.push(disposable);
    
    // Automatically show the form when the extension activates
    setTimeout(() => {
        showForm();
    }, 1000); // Small delay to ensure VS Code is fully loaded
}

/**
 * Create a compatibility layer that maps VS Code APIs to our platform APIs
 */
function createVSCodeCompatLayer(context) {
    return {
        // VS Code window namespace
        window: {
            createWebviewPanel: (viewType, title, viewColumn, options) => {
                console.log(`Creating webview panel: ${viewType}, ${title}`);
                
                // Use our platform's createWebviewPanel API
                const panel = context.createWebviewPanel(
                    viewType,
                    title,
                    { viewColumn },
                    options
                );
                
                return panel;
            },
            showInformationMessage: (message) => {
                // Just log the message since our platform might not have this
                console.log(`[INFO]: ${message}`);
            }
        },
        
        // VS Code commands namespace
        commands: {
            registerCommand: (commandId, handler) => {
                console.log(`Registering command: ${commandId}`);
                
                // Our platform might use a different command registration
                // For now, just return a disposable object
                const disposable = {
                    dispose: () => {
                        console.log(`Disposing command: ${commandId}`);
                    }
                };
                
                return disposable;
            }
        },
        
        // VS Code ViewColumn enum
        ViewColumn: {
            One: 1,
            Two: 2,
            Three: 3
        }
    };
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Modern UI Extension</title>
        <style>
            :root {
                --sidebar-width: 220px;
                --main-content-left-margin: 240px;
                --primary-color: #007acc;
                --secondary-color: #0066b3;
                --text-color: #e7e7e7;
                --bg-color: #1e1e1e;
                --sidebar-bg: #252526;
                --sidebar-hover-bg: #2a2d2e;
                --sidebar-active-bg: #094771;
                --input-bg: #3c3c3c;
                --input-border: #6b6b6b;
                --input-color: #cccccc;
                --button-bg: #0e639c;
                --button-color: #ffffff;
                --button-hover-bg: #1177bb;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                color: var(--text-color);
                background-color: var(--bg-color);
                line-height: 1.6;
                height: 100vh;
                overflow: hidden;
            }
            
            .app-container {
                display: flex;
                height: 100vh;
            }
            
            /* Sidebar styles */
            .sidebar {
                width: var(--sidebar-width);
                background-color: var(--sidebar-bg);
                height: 100%;
                position: fixed;
                top: 0;
                left: 0;
                overflow-y: auto;
                transition: width 0.3s ease;
                z-index: 10;
                box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            }
            
            .sidebar-header {
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .sidebar-title {
                font-size: 18px;
                font-weight: 600;
                color: #e7e7e7;
            }
            
            .nav-items {
                list-style: none;
                padding: 15px 0;
            }
            
            .nav-item {
                padding: 12px 20px;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #bbbbbb;
            }
            
            .nav-item:hover {
                background-color: var(--sidebar-hover-bg);
            }
            
            .nav-item.active {
                background-color: var(--sidebar-active-bg);
                color: #ffffff;
                border-left: 3px solid var(--primary-color);
            }
            
            .nav-item-icon {
                margin-right: 12px;
                font-size: 18px;
                width: 22px;
                text-align: center;
            }
            
            /* Main content styles */
            .main-content {
                flex: 1;
                padding: 30px;
                margin-left: var(--main-content-left-margin);
                height: 100vh;
                overflow-y: auto;
            }
            
            .content-section {
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .content-section.active {
                display: block;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .section-title {
                margin-bottom: 20px;
                font-size: 24px;
                font-weight: 500;
                color: #e7e7e7;
            }
            
            .card {
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                font-size: 14px;
            }
            
            input[type="text"], select, textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--input-border);
                background-color: var(--input-bg);
                color: var(--input-color);
                border-radius: 4px;
                font-size: 14px;
                transition: border 0.2s ease;
            }
            
            input[type="text"]:focus, select:focus, textarea:focus {
                outline: none;
                border-color: var(--primary-color);
            }
            
            button {
                background-color: var(--button-bg);
                color: var(--button-color);
                border: none;
                padding: 10px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            }
            
            button:hover {
                background-color: var(--button-hover-bg);
            }
            
            /* Icons for the sidebar */
            .icon {
                display: inline-block;
                width: 1em;
                height: 1em;
                stroke-width: 0;
                stroke: currentColor;
                fill: currentColor;
                vertical-align: middle;
            }
        </style>
    </head>
    <body>
        <div class="app-container">
            <div class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-title">Extension Demo</div>
                </div>
                <ul class="nav-items">
                    <li class="nav-item active" data-section="form">
                        <span class="nav-item-icon">📝</span>
                        <span>Form</span>
                    </li>
                    <li class="nav-item" data-section="dashboard">
                        <span class="nav-item-icon">📊</span>
                        <span>Dashboard</span>
                    </li>
                    <li class="nav-item" data-section="settings">
                        <span class="nav-item-icon">⚙️</span>
                        <span>Settings</span>
                    </li>
                </ul>
            </div>
            
            <div class="main-content">
                <div id="form" class="content-section active">
                    <h2 class="section-title">Sample Form</h2>
                    <div class="card">
                        <form id="sample-form">
                            <div class="form-group">
                                <label for="text1">Input Field 1</label>
                                <input type="text" id="text1" placeholder="Enter some text...">
                            </div>
                            <div class="form-group">
                                <label for="text2">Input Field 2</label>
                                <input type="text" id="text2" placeholder="Enter more text...">
                            </div>
                            <div class="form-group">
                                <button type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div id="dashboard" class="content-section">
                    <h2 class="section-title">Dashboard</h2>
                    <div class="card">
                        <p>This is where dashboard content would go.</p>
                    </div>
                </div>
                
                <div id="settings" class="content-section">
                    <h2 class="section-title">Settings</h2>
                    <div class="card">
                        <p>This is where settings content would go.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            (function() {
                const vscode = acquireVsCodeApi();
                
                // Handle navigation
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.addEventListener('click', () => {
                        // Update active nav item
                        document.querySelector('.nav-item.active').classList.remove('active');
                        item.classList.add('active');
                        
                        // Show appropriate section
                        const sectionId = item.getAttribute('data-section');
                        document.querySelector('.content-section.active').classList.remove('active');
                        document.getElementById(sectionId).classList.add('active');
                        
                        // Notify extension
                        vscode.postMessage({
                            command: 'navigate',
                            section: sectionId
                        });
                    });
                });
                
                // Handle form submission
                document.getElementById('sample-form').addEventListener('submit', (event) => {
                    event.preventDefault();
                    const text1 = document.getElementById('text1').value;
                    const text2 = document.getElementById('text2').value;
                    
                    vscode.postMessage({
                        command: 'submit',
                        text1: text1,
                        text2: text2
                    });
                });
            })();
        </script>
    </body>
    </html>`;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
