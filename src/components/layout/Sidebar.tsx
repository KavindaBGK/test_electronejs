import React, { useState } from 'react';
import { NavItem } from '../../types';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  File, 
  UserCheck, 
  FileText, 
  CheckCircle, 
  Eye, 
  Check, 
  Clock, 
  Filter 
} from 'react-feather';

interface SidebarProps {
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, activeItem, setActiveItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showWorkFilters, setShowWorkFilters] = useState(false);
  
  const workFilters = [
    { name: 'All work items', icon: <Layers size={16} /> },
    { name: 'My open work items', icon: <File size={16} /> },
    { name: 'Reported by me', icon: <UserCheck size={16} /> },
    { name: 'Open work items', icon: <FileText size={16} /> },
    { name: 'Done work items', icon: <CheckCircle size={16} /> },
    { name: 'Viewed recently', icon: <Eye size={16} /> },
    { name: 'Resolved recently', icon: <Check size={16} /> },
    { name: 'Updated recently', icon: <Clock size={16} /> },
    { name: 'View all filters', icon: <Filter size={16} /> }
  ];
  
  const handleAllWorkClick = () => {
    setShowWorkFilters(true);
  };
  
  const handleBackClick = () => {
    setShowWorkFilters(false);
  };
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col py-4 flex-shrink-0 transition-all duration-300 ease-in-out`}
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
      
      {!showWorkFilters ? (
          
          <div className="flex flex-col px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => item.name === 'All work' ? handleAllWorkClick() : setActiveItem(item.name)}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 mb-1 transition-colors ${activeItem === item.name 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'} relative`}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isExpanded && (
                    <span className="ml-3 text-sm">{item.name}</span>
                  )}
                </div>
                {item.name === 'All work' && hoveredItem === 'All work' && (
                  <div className="text-blue-600 ml-2">
                    <ArrowRight size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
      ) : (
        <div className="flex flex-col mt-2">
          <button 
            onClick={handleBackClick}
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 border-b border-gray-200"
          >
            <ArrowLeft size={16} />
            {isExpanded && <span className="ml-2 text-sm font-medium">Back to project</span>}
          </button>
          
          {isExpanded && (
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase">Default Filters</h3>
            </div>
          )}
          
          <div className="flex flex-col">
            {workFilters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setActiveItem(filter.name)}
                className={`flex items-center px-4 py-2 text-sm ${activeItem === filter.name 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-blue-50'}`}
              >
                <span className="flex-shrink-0 text-gray-500">{filter.icon}</span>
                {isExpanded && <span className="ml-3">{filter.name}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      
      
      {!showWorkFilters && (
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
      )}
    </div>
  );
};

export default Sidebar;
