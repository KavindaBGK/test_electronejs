import React from 'react';
import { NavItem } from '../../types';

interface SecondaryNavProps {
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
  isExtensionActive?: boolean;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ 
  navItems, 
  activeItem, 
  setActiveItem, 
  isExtensionActive = false 
}) => {
  // If an extension is active, don't render any navigation items
  if (isExtensionActive) {
    return <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0"></div>;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center space-x-2 flex-shrink-0">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveItem(item.name)}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${activeItem === item.name 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <span className="mr-2">{item.icon}</span>
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default SecondaryNav;
