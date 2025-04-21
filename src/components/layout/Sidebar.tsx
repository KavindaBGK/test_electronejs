import React, { useState } from 'react';
import { NavItem } from '../../types';
import { ChevronRight, ChevronLeft } from 'react-feather';

interface SidebarProps {
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeItem, setActiveItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col py-4 flex-shrink-0 transition-all duration-300 ease-in-out h-full`}
    >
      <div className="flex items-center justify-between px-4 mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          {isExpanded && (
            <span className="ml-3 font-medium text-gray-700">WaveAI</span>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      
      <div className="flex flex-col px-3">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center rounded-lg px-3 py-2 mb-1 transition-colors ${activeItem === item.name 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isExpanded && (
              <span className="ml-3 text-sm">{item.name}</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-auto px-3">
        <button className={`flex items-center rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100`}>
          <span className="flex-shrink-0">
            {navItems.find(item => item.name === 'Settings')?.icon}
          </span>
          {isExpanded && (
            <span className="ml-3 text-sm">Settings</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
