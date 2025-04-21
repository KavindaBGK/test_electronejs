import { useState } from 'react';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Home, BarChart2, FileText, Settings, Layers } from 'react-feather';
import { NavItem } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

// Main App Component with Authentication
const AppContent = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  
  const { isAuthenticated } = useAuth();
  
  // Navigation items with icons
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <Home size={18} /> },
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

  // Show main app if authenticated
  return (
    <Layout 
      navItems={navItems} 
      activeItem={activeItem} 
      setActiveItem={setActiveItem}
    >
      <DashboardPage />
    </Layout>
  );
};

// Wrapper component that provides the auth context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
