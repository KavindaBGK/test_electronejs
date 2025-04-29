import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ipcRenderer } from 'electron';

export interface ExtensionInfo {
  id: string;
  package: {
    name: string;
    displayName?: string;
    description?: string;
    version?: string;
    main: string;
    icon?: string;
  };
  active: boolean;
}

interface ExtensionContextType {
  extensions: ExtensionInfo[];
  activeExtensionId: string | null;
  activateExtension: (id: string) => void;
  deactivateExtension: () => void;
  setActiveExtensionId: (id: string | null) => void;
  loading: boolean;
}

const ExtensionContext = createContext<ExtensionContextType>({
  extensions: [],
  activeExtensionId: null,
  activateExtension: () => {},
  deactivateExtension: () => {},
  setActiveExtensionId: () => {},
  loading: true
});

export const useExtensions = () => useContext(ExtensionContext);

interface ExtensionProviderProps {
  children: ReactNode;
}

export const ExtensionProvider: React.FC<ExtensionProviderProps> = ({ children }) => {
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [activeExtensionId, setActiveExtensionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for extension updates from the main process
    ipcRenderer.on('extensions-updated', (_, extensionList: ExtensionInfo[]) => {
      console.log('Extensions updated:', extensionList);
      setExtensions(extensionList);
      setLoading(false);
    });

    // Request extensions list on mount
    ipcRenderer.send('get-extensions');
    
    // Cleanup the listener when component unmounts
    return () => {
      ipcRenderer.removeAllListeners('extensions-updated');
    };
  }, []);

  const activateExtension = (id: string) => {
    console.log(`Activating extension: ${id}`);
    setActiveExtensionId(id);
    ipcRenderer.send('extension-activate', id);
  };

  const deactivateExtension = () => {
    console.log('Deactivating current extension');
    if (activeExtensionId) {
      ipcRenderer.send('extension-deactivate', activeExtensionId);
    }
    setActiveExtensionId(null);
  };

  const value = {
    extensions,
    activeExtensionId,
    activateExtension,
    deactivateExtension,
    setActiveExtensionId,
    loading
  };

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  );
};

export default ExtensionContext; 