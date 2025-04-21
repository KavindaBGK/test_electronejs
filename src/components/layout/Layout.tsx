import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SecondaryNav from './SecondaryNav';
import { NavItem } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  navItems, 
  activeItem, 
  setActiveItem 
}) => {
  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-sm overflow-hidden rounded-lg shadow-lg">
      {/* Left Sidebar - Now collapsible with rounded corners */}
      <div className="flex-shrink-0 rounded-tl-lg rounded-bl-lg overflow-hidden">
        <Sidebar 
          navItems={navItems} 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation with rounded top-right corner */}
        <div className="rounded-tr-lg overflow-hidden">
          <Header activeItem={activeItem} />
        </div>
        
        {/* Secondary Navigation */}
        <SecondaryNav 
          navItems={navItems} 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>

        {/* Bottom right corner rounding */}
        <div className="rounded-br-lg"></div>
      </div>
    </div>
  );
};

export default Layout;
