import React from 'react';
import { Search, Bell } from 'react-feather';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  activeItem: string;
}

const Header: React.FC<HeaderProps> = ({ activeItem }) => {
  const { logout } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-semibold text-gray-800">{activeItem}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* User */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">JD</div>
            <span className="text-sm text-gray-700">John Doe</span>
          </div>
          
          <button 
            onClick={logout}
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
