import React from 'react';
import { SearchIcon, NotificationIcon } from '../icons/Icons';

interface HeaderProps {
  activeItem: string;
}

const Header: React.FC<HeaderProps> = ({ activeItem }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-medium text-gray-800">{activeItem}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-50 border border-gray-300 text-gray-700 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 w-56"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <NotificationIcon />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* User */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-medium">JD</div>
          <span className="text-xs text-gray-700">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
