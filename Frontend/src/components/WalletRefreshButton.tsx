import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wallet } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';
import { AppConfig, UserSession } from '@stacks/connect';
import { enhancedWalletMonitor } from '../utils/enhancedWalletMonitor';

interface WalletRefreshButtonProps {
  className?: string;
}

export const WalletRefreshButton: React.FC<WalletRefreshButtonProps> = ({ 
  className = '' 
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { userAddress, setTestAddress } = useStacksStore();

  const checkWalletStatus = async () => {
    setIsChecking(true);
    
    try {
      console.log('🔄 Manual wallet check initiated...');
      
      // Force enhanced monitor to check immediately
      await enhancedWalletMonitor.forceCheck();
      
      // Get current wallet address from multiple sources
      let currentAddress = null;
      
      // Method 1: Check Stacks Connect UserSession
      try {
        const appConfig = new AppConfig(['store_write', 'publish_data']);
        const userSession = new UserSession({ appConfig });
        
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          currentAddress = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
          console.log('📡 Current wallet from session:', currentAddress);
        }
      } catch (error) {
        console.error('❌ Failed to check UserSession:', error);
      }
      
      // Method 2: Check window.StacksProvider if available
      if (!currentAddress && typeof window !== 'undefined' && (window as any).StacksProvider) {
        try {
          const provider = (window as any).StacksProvider;
          if (provider.getAddress) {
            currentAddress = await provider.getAddress();
            console.log('📡 Current wallet from provider:', currentAddress);
          }
        } catch (error) {
          console.error('❌ Failed to check StacksProvider:', error);
        }
      }
      
      console.log('🔍 Wallet check results:');
      console.log('  Store address:', userAddress);
      console.log('  Current wallet:', currentAddress);
      
      // Check if address changed
      if (currentAddress && userAddress && currentAddress !== userAddress) {
        console.log('🔄 Address change detected during manual check!');
        
        // Update the store immediately
        setTestAddress(currentAddress);
        
        // Show notification
        alert(`Wallet account changed!\n\nPrevious: ${userAddress.slice(0, 8)}...${userAddress.slice(-6)}\nCurrent: ${currentAddress.slice(0, 8)}...${currentAddress.slice(-6)}\n\nApp data has been updated.`);
      } else if (!currentAddress && userAddress) {
        console.log('💔 Wallet disconnected during manual check!');
        alert('Wallet disconnected! Please reconnect your wallet.');
      } else if (currentAddress && !userAddress) {
        console.log('🔗 New wallet connection detected during manual check!');
        setTestAddress(currentAddress);
        alert(`Wallet connected!\nAddress: ${currentAddress.slice(0, 8)}...${currentAddress.slice(-6)}`);
      } else {
        console.log('✅ No changes detected');
      }
      
      setLastCheck(new Date());
      
    } catch (error) {
      console.error('❌ Error during manual wallet check:', error);
      alert('Error checking wallet status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <button
        onClick={checkWalletStatus}
        disabled={isChecking}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
          border border-purple-500/30 text-purple-300 rounded-lg transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
        title="Manually check for wallet account changes"
      >
        <motion.div
          animate={isChecking ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isChecking ? Infinity : 0, ease: "linear" }}
        >
          <RefreshCw size={16} />
        </motion.div>
        
        <span className="text-sm">
          {isChecking ? 'Checking...' : 'Check Wallet'}
        </span>
      </button>
      
      {lastCheck && (
        <div className="mt-2 text-xs text-gray-400">
          Last checked: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
};

// Debug component to show current wallet status
export const WalletStatusDebug: React.FC = () => {
  const { userAddress, isWalletConnected } = useStacksStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const getDebugInfo = async () => {
    try {
      const appConfig = new AppConfig(['store_write', 'publish_data']);
      const userSession = new UserSession({ appConfig });
      
      const info = {
        storeAddress: userAddress,
        isConnected: isWalletConnected,
        isSignedIn: userSession.isUserSignedIn(),
        localStorage: {
          address: localStorage.getItem('stacksfit_wallet_address'),
          connected: localStorage.getItem('stacksfit_wallet_connected')
        },
        session: null as any,
        provider: (window as any).StacksProvider ? 'Available' : 'Not Available'
      };
      
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        info.session = {
          testnetAddress: userData.profile.stxAddress?.testnet,
          mainnetAddress: userData.profile.stxAddress?.mainnet
        };
      }
      
      setDebugInfo(info);
    } catch (error) {
      setDebugInfo({ error: String(error) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 left-4 p-4 bg-black/80 border border-gray-600 rounded-lg 
        text-xs text-gray-300 max-w-md font-mono"
    >
      <div className="flex items-center gap-2 mb-2">
        <Wallet size={14} />
        <span className="font-semibold">Wallet Debug</span>
        <button
          onClick={getDebugInfo}
          className="ml-auto text-blue-400 hover:text-blue-300"
        >
          Refresh
        </button>
      </div>
      
      {debugInfo ? (
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      ) : (
        <div className="text-gray-500">Click refresh to load debug info</div>
      )}
    </motion.div>
  );
};

export default WalletRefreshButton;