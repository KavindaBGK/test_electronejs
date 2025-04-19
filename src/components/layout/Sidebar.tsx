import React from 'react';
import { NavItem } from '../../types';

interface SidebarProps {
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeItem, setActiveItem }) => {
  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4 flex-shrink-0">
      <div className="w-8 h-8 bg-violet-600 rounded-lg mb-6 flex items-center justify-center">
        <span className="text-white text-xs font-bold">A</span>
      </div>
      
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => setActiveItem(item.name)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${activeItem === item.name 
            ? 'bg-violet-600 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
        >
          {item.icon}
        </button>
      ))}
      
      <div className="mt-auto">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-gray-200">
          {navItems.find(item => item.name === 'Settings')?.icon}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
