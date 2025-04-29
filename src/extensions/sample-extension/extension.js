function activate(context) {
    console.log('Sample extension activated!');

    try {
        // Create a webview panel
        console.log('Creating webview panel...');
        const panel = context.createWebviewPanel(
            'sampleView',
            'Sample Extension',
            { viewColumn: 1 },
            { enableScripts: true }
        );
        console.log('Webview panel created successfully');

        // Set the webview content
        panel.webview.html = getWebviewContent();
        console.log('Webview HTML content set');

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            console.log('Received message from webview:', message);
        });
    } catch (error) {
        console.error('Error creating webview:', error);
    }
}

function deactivate() {
    console.log('Sample extension deactivated!');
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                padding: 20px;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            h1 {
                color: #007acc;
                margin-bottom: 20px;
            }
            .input-group {
                margin-bottom: 16px;
            }
            label {
                display: block;
                margin-bottom: 4px;
                font-weight: 500;
            }
            input[type="text"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
            }
            button {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            button:hover {
                background-color: #0066b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Sample Extension</h1>
            <div class="input-group">
                <label for="input1">Text Box 1</label>
                <input type="text" id="input1" placeholder="Enter first value" />
            </div>
            <div class="input-group">
                <label for="input2">Text Box 2</label>
                <input type="text" id="input2" placeholder="Enter second value" />
            </div>
            <button onclick="sendMessage()">Send Values</button>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            function sendMessage() {
                const value1 = document.getElementById('input1').value;
                const value2 = document.getElementById('input2').value;
                vscode.postMessage({
                    command: 'send-values',
                    value1,
                    value2
                });
            }
        </script>
    </body>
    </html>`;
}

module.exports = {
    activate,
    deactivate
}; 