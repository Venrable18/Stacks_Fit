import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Store
import { useStacksStore } from './store/stacksStore';
import { useThemeStore } from './store/themeStore';

// Utils
import { walletMonitor } from './utils/walletMonitor';
import { simpleWalletMonitor } from './utils/simpleWalletMonitor';

// Components
import LoadingScreen from './components/LoadingScreen';
import WalletConnection from './components/WalletConnection';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import SecurityAlert from './components/SecurityAlert';
import { useWalletNotifications } from './components/WalletNotification';

// Styles
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [accountChangeInfo, setAccountChangeInfo] = useState<{oldAddress: string; newAddress: string} | null>(null);
  const { isWalletConnected, checkAuthStatus } = useStacksStore();
  const { isDarkMode } = useThemeStore();
  const { showAccountChange, showDisconnect, NotificationContainer } = useWalletNotifications();

  useEffect(() => {
    // Apply theme on app initialization
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check authentication status and simulate initial loading
    const initializeApp = async () => {
      await checkAuthStatus();
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    };

    initializeApp();
  }, [checkAuthStatus]);

  // Start wallet monitoring when wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      console.log('🔗 Wallet connected - Starting wallet monitoring');
      
      // Set notification callbacks for wallet monitor
      walletMonitor.setNotificationCallbacks({
        onAccountChange: showAccountChange,
        onDisconnect: showDisconnect
      });
      
      // Start monitoring systems
      walletMonitor.startMonitoring();
      
      // Start simple wallet monitor with account change handling
      simpleWalletMonitor.startMonitoring((newAddress: string, oldAddress: string) => {
        console.log('🚨 CRITICAL: Wallet account changed!', { newAddress, oldAddress });
        
        // Set security alert data
        setAccountChangeInfo({ oldAddress, newAddress });
        setShowSecurityAlert(true);
        
        // Show immediate notification
        showAccountChange(`🚨 SECURITY: Account changed! Disconnecting...`);
      });
      
    } else {
      console.log('💔 Wallet disconnected - Stopping all monitoring');
      walletMonitor.stopMonitoring();
      simpleWalletMonitor.stopMonitoring();
    }

    // Cleanup on unmount
    return () => {
      walletMonitor.stopMonitoring();
      simpleWalletMonitor.stopMonitoring();
    };
  }, [isWalletConnected, showAccountChange, showDisconnect]);

  // Handle security alert confirmation
  const handleSecurityAlertConfirm = () => {
    console.log('🛡️ Security protocol: Force disconnecting due to account change');
    const { disconnectWallet } = useStacksStore.getState();
    disconnectWallet();
    setShowSecurityAlert(false);
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
          : 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100'
      }`}>
        <AnimatePresence mode="wait">
          {!isWalletConnected ? (
            <motion.div
              key="wallet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WalletConnection />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex h-screen"
            >
              <Navigation />
              <main className="flex-1 overflow-hidden">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Wallet Notifications */}
        <NotificationContainer />
        
        {/* Security Alert for Account Changes */}
        <SecurityAlert
          isVisible={showSecurityAlert}
          oldAddress={accountChangeInfo?.oldAddress || ''}
          newAddress={accountChangeInfo?.newAddress || ''}
          onConfirm={handleSecurityAlertConfirm}
        />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;