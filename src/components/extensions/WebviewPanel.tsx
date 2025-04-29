import React, { useEffect, useRef, useState } from 'react';
import { ipcRenderer } from 'electron';

interface WebviewContent {
  webviewId: string;
  html: string;
  title: string;
}

interface WebviewPanelProps {
  className?: string;
  extensionId?: string; // Add extensionId prop to trigger reactivation
}

const WebviewPanel: React.FC<WebviewPanelProps> = ({ className = '', extensionId }) => {
  const [activeWebviewId, setActiveWebviewId] = useState<string | null>(null);
  const [html, setHtml] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [contentCache, setContentCache] = useState<Record<string, WebviewContent>>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // When extensionId changes, try to reactivate the extension
  useEffect(() => {
    if (extensionId) {
      console.log(`Extension ID changed to ${extensionId}, checking if we need to reactivate`);
      
      // If we have cached content for this extension, use it immediately
      if (contentCache[extensionId]) {
        const cachedContent = contentCache[extensionId];
        setActiveWebviewId(cachedContent.webviewId);
        setHtml(cachedContent.html);
        setTitle(cachedContent.title);
        console.log(`Using cached content for ${extensionId}`);
      } else {
        // Otherwise, trigger activation via IPC
        console.log(`Reactivating extension ${extensionId}`);
        ipcRenderer.send('extension-activate', extensionId);
      }
    }
  }, [extensionId, contentCache]);
  
  useEffect(() => {
    // Listen for webview content updates
    const handleWebviewContent = (_: any, data: { webviewId: string, html: string, title: string }) => {
      console.log(`Received content for webview ${data.webviewId}`);
      
      // Update the current view
      setActiveWebviewId(data.webviewId);
      setHtml(data.html);
      setTitle(data.title);
      
      // Cache the content for future use
      setContentCache(prev => ({
        ...prev,
        [extensionId || data.webviewId]: {
          webviewId: data.webviewId,
          html: data.html,
          title: data.title
        }
      }));
    };
    
    // Listen for webview messages
    const handleWebviewMessage = (_: any, data: { webviewId: string, message: any }) => {
      if (activeWebviewId === data.webviewId && iframeRef.current) {
        const iframe = iframeRef.current;
        const message = data.message;
        
        // Send message to iframe
        iframe.contentWindow?.postMessage(message, '*');
      }
    };

    ipcRenderer.on('webview-set-content', handleWebviewContent);
    ipcRenderer.on('webview-post-message', handleWebviewMessage);
    
    return () => {
      ipcRenderer.removeListener('webview-set-content', handleWebviewContent);
      ipcRenderer.removeListener('webview-post-message', handleWebviewMessage);
    };
  }, [activeWebviewId, extensionId]);

  // Handle messages from the iframe back to the extension
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (activeWebviewId) {
        ipcRenderer.send('webview-message', {
          webviewId: activeWebviewId,
          message: event.data
        });
      }
    };
    
    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [activeWebviewId]);

  if (!activeWebviewId || !html) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500">Select an extension to view its content</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      {/* Using sandbox attribute for security, enabling necessary permissions */}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-forms allow-same-origin"
        srcDoc={html}
        title={title}
      />
    </div>
  );
};

export default WebviewPanel; 