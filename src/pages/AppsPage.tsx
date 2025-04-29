import React, { useState } from 'react';
import { Grid, Package, RefreshCw, Search } from 'react-feather';
import { useExtensions } from '../services/ExtensionContext.tsx';
import ExtensionCard from '../components/extensions/ExtensionCard';
import WebviewPanel from '../components/extensions/WebviewPanel';

const AppsPage: React.FC = () => {
  const { extensions, activeExtensionId, activateExtension, loading } = useExtensions();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter extensions based on search query
  const filteredExtensions = extensions.filter(ext => {
    const { package: pkg } = ext;
    const displayName = pkg.displayName || pkg.name;
    const description = pkg.description || '';
    
    const query = searchQuery.toLowerCase();
    return (
      displayName.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      ext.id.toLowerCase().includes(query)
    );
  });

  const handleExtensionClick = (extensionId: string) => {
    activateExtension(extensionId);
  };

  // If we have an active extension
  if (activeExtensionId) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <WebviewPanel className="w-full h-full" extensionId={activeExtensionId} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Grid size={24} className="mr-2" /> Apps
        </h1>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search extensions..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin mr-2">
            <RefreshCw size={20} className="text-blue-500" />
          </div>
          <span className="text-gray-600">Loading extensions...</span>
        </div>
      ) : filteredExtensions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          {searchQuery ? (
            <div>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">No extensions found</h3>
              <p className="text-gray-600">
                No extensions match your search query "{searchQuery}"
              </p>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium mb-2">No extensions installed</h3>
              <p className="text-gray-600">
                Extensions will appear here when installed
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExtensions.map(extension => (
            <ExtensionCard 
              key={extension.id}
              extension={extension}
              isActive={extension.id === activeExtensionId}
              onClick={() => handleExtensionClick(extension.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppsPage; 