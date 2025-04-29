function activate(context) {
    console.log('Test extension activated!');
    
    // Example command registration
    const disposable = context.registerCommand('test-extension.hello', () => {
        console.log('Hello from test extension!');
    });
    
    context.subscriptions.push(disposable);
}

function deactivate() {
    console.log('Test extension deactivated!');
}

module.exports = {
    activate,
    deactivate
}; 