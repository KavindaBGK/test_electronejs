import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SecondaryNav from './SecondaryNav';
import { NavItem, PluginMenuItem } from '../../types';
import PluginService from '../../services/PluginService';

interface LayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
  isExtensionActive?: boolean;
  extensionId?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  navItems, 
  activeItem, 
  setActiveItem,
  isExtensionActive = false,
  extensionId
}) => {
  // Handle plugin menu item clicks
  const handlePluginMenuItemClick = async (menuItem: PluginMenuItem) => {
    if (!extensionId) return;
    
    console.log(`Menu item clicked: ${menuItem.id} - ${menuItem.label}`);
    
    try {
      if (menuItem.action) {
        // Execute the action in the plugin
        const result = await PluginService.executeAction(extensionId, menuItem.action);
        console.log(`Action ${menuItem.action} result:`, result);
      }
    } catch (error) {
      console.error(`Error executing action ${menuItem.action}:`, error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-sm overflow-hidden">
      {/* Left Sidebar - Now collapsible */}
      <Sidebar 
        navItems={navItems} 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
        isExtensionActive={isExtensionActive}
        extensionId={extensionId}
        onPluginMenuItemClick={handlePluginMenuItemClick}
      />
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <Header activeItem={activeItem} isExtensionActive={isExtensionActive} />
        
        {/* Secondary Navigation */}
        <SecondaryNav 
          navItems={navItems} 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
          isExtensionActive={isExtensionActive}
        />
        
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
