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
    <div className="flex h-screen w-full bg-gray-50 font-sans text-sm overflow-hidden">
      {/* Left Sidebar - Now collapsible */}
      <Sidebar 
        navItems={navItems} 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <Header activeItem={activeItem} />
        
        {/* Secondary Navigation */}
        <SecondaryNav 
          navItems={navItems} 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
        />
        
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
