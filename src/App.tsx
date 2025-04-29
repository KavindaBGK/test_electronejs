import { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import AppsPage from './pages/AppsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Home, BarChart2, FileText, Settings, Layers, Grid } from 'react-feather';
import { NavItem } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExtensionProvider, useExtensions } from './services/ExtensionContext.tsx';

// Main App Component with Authentication
const AppContent = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  
  const { isAuthenticated } = useAuth();
  const { activeExtensionId } = useExtensions();
  
  // Check if an extension is active
  const isExtensionActive = !!activeExtensionId;
  
  // Navigation items with icons
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <Home size={18} /> },
    { name: 'Apps', icon: <Grid size={18} /> },
    { name: 'All work', icon: <Layers size={18} /> },
    { name: 'Analytics', icon: <BarChart2 size={18} /> },
    { name: 'Reports', icon: <FileText size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> }
  ];

  // Show login/signup pages if not authenticated
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return <LoginPage onSwitchToSignup={() => setAuthPage('signup')} />;
    } else {
      return <SignupPage onSwitchToLogin={() => setAuthPage('login')} />;
    }
  }

  // Render the active page based on selected nav item
  const renderActivePage = () => {
    switch (activeItem) {
      case 'Apps':
        return <AppsPage />;
      case 'Dashboard':
      default:
        return <DashboardPage />;
    }
  };

  // Show main app if authenticated
  return (
    <Layout 
      navItems={navItems} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem}
      isExtensionActive={isExtensionActive}
      extensionId={activeExtensionId}
    >
      {renderActivePage()}
    </Layout>
  );
};

// Wrapper component that provides the auth context
function App() {
  return (
    <AuthProvider>
      <ExtensionProvider>
        <AppContent />
      </ExtensionProvider>
    </AuthProvider>
  )
}

export default App
