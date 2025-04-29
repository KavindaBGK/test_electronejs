import React, { useEffect, useState } from 'react';
import { PluginMenuItem } from '../../types';
import PluginService from '../../services/PluginService';
import { Menu, ChevronRight, Home, Settings, Layers, Grid, RefreshCw } from 'react-feather';

interface PluginMenuProps {
  extensionId: string;
  onMenuItemClick?: (menuItem: PluginMenuItem) => void;
}

// Map of icon names to Feather icons
const iconMap: Record<string, React.ReactNode> = {
  'home': <Home size={16} />,
  'settings': <Settings size={16} />,
  'layers': <Layers size={16} />,
  'grid': <Grid size={16} />,
  'menu': <Menu size={16} />
};

const PluginMenu: React.FC<PluginMenuProps> = ({ extensionId, onMenuItemClick }) => {
  const [menuItems, setMenuItems] = useState<PluginMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await PluginService.getMenuItems(extensionId);
        console.log('Plugin menu items:', response);
        
        if (response.success) {
          setMenuItems(response.items);
        } else {
          setError(response.error || 'Failed to load menu items');
        }
      } catch (err) {
        console.error('Error loading plugin menu items:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    if (extensionId) {
      loadMenuItems();
    }
  }, [extensionId]);

  const handleMenuItemClick = (menuItem: PluginMenuItem) => {
    console.log('Menu item clicked:', menuItem);
    if (onMenuItemClick) {
      onMenuItemClick(menuItem);
    }
  };

  // Render a menu item
  const renderMenuItem = (item: PluginMenuItem) => {
    const icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : <Menu size={16} />;
    
    return (
      <li 
        key={item.id} 
        className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
        onClick={() => handleMenuItemClick(item)}
      >
        <span className="mr-2 text-gray-600">{icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.children && item.children.length > 0 && (
          <ChevronRight size={16} className="text-gray-400" />
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <RefreshCw size={18} className="animate-spin mr-2 text-blue-500" />
        <span>Loading menu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        <p>No menu items available</p>
      </div>
    );
  }

  return (
    <div className="plugin-menu border border-gray-200 rounded-lg bg-white">
      <div className="p-3 border-b border-gray-200 font-medium">Plugin Menu</div>
      <ul className="p-2">
        {menuItems.map(renderMenuItem)}
      </ul>
    </div>
  );
};

export default PluginMenu; 