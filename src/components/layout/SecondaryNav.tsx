import React from 'react';
import { NavItem } from '../../types';

interface SecondaryNavProps {
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ navItems, activeItem, setActiveItem }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center space-x-1 flex-shrink-0">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveItem(item.name)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center ${activeItem === item.name 
            ? 'bg-violet-50 text-violet-700' 
            : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <span className="mr-1.5">{item.icon}</span>
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default SecondaryNav;
