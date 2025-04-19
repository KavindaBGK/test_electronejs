import { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import { DashboardIcon, AnalyticsIcon, ReportsIcon, SettingsIcon } from './components/icons/Icons';
import { NavItem } from './types';

function App() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  
  // Navigation items with icons
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Analytics', icon: <AnalyticsIcon /> },
    { name: 'Reports', icon: <ReportsIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> }
  ]

  return (
    <Layout 
      navItems={navItems} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem}
    >
      <DashboardPage />
    </Layout>
  )
}

export default App
