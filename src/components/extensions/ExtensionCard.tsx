import React from 'react';
import { Package, Globe } from 'react-feather';
import { ExtensionInfo } from '../../services/ExtensionContext.tsx';

interface ExtensionCardProps {
  extension: ExtensionInfo;
  isActive: boolean;
  onClick: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, isActive, onClick }) => {
  const { package: pkg } = extension;
  const displayName = pkg.displayName || pkg.name;
  const description = pkg.description || 'No description available';
  const version = pkg.version || '1.0.0';

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-100
        ${isActive ? 'ring-2 ring-blue-500' : 'hover:border-blue-200'}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
          {pkg.icon ? (
            <img src={pkg.icon} alt={displayName} className="w-8 h-8" />
          ) : (
            <Package size={20} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{displayName}</h3>
            <span className="text-xs text-gray-500">v{version}</span>
          </div>
          
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          
          <div className="flex items-center mt-3">
            <div className="mr-3 flex items-center text-xs text-gray-500">
              <Globe size={12} className="mr-1" />
              <span>{extension.id}</span>
            </div>
            
            <div className="ml-auto">
              <span 
                className={`text-xs px-2 py-1 rounded-full 
                  ${extension.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {extension.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionCard; 