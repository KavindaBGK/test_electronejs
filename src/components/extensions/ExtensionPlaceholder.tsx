import React from 'react';
import { Package } from 'react-feather';

interface ExtensionPlaceholderProps {
  message?: string;
  icon?: React.ReactNode;
}

const ExtensionPlaceholder: React.FC<ExtensionPlaceholderProps> = ({ 
  message = 'Select an extension to view its content', 
  icon = <Package size={48} className="text-gray-300" /> 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg">
      <div className="mb-4">{icon}</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default ExtensionPlaceholder; 