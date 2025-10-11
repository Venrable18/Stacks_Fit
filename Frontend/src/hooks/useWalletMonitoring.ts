import { useEffect } from 'react';
import { useStacksStore } from '../store/stacksStore';
import { walletMonitor } from '../utils/walletMonitor';

/**
 * Hook to monitor wallet account changes and keep the app in sync
 * 
 * This hook:
 * - Automatically starts monitoring when wallet is connected
 * - Stops monitoring when wallet is disconnected
 * - Handles cleanup on component unmount
 * 
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   useWalletMonitoring();
 *   // ... rest of component
 * }
 * ```
 */
export function useWalletMonitoring() {
  const { isWalletConnected, userAddress } = useStacksStore();

  useEffect(() => {
    if (isWalletConnected && userAddress) {
      console.log('🔍 Starting wallet monitoring for:', userAddress);
      walletMonitor.startMonitoring();
    } else {
      console.log('⏹️ Stopping wallet monitoring');
      walletMonitor.stopMonitoring();
    }

    // Cleanup function to stop monitoring when component unmounts
    return () => {
      walletMonitor.stopMonitoring();
    };
  }, [isWalletConnected, userAddress]);

  // Return monitoring status for components that might need it
  return {
    isMonitoring: isWalletConnected && !!userAddress
  };
}

/**
 * Hook to manually trigger wallet account checks
 * 
 * Useful for components that want to check for account changes
 * on specific user actions (like clicking a refresh button)
 */
export function useWalletAccountCheck() {
  return {
    checkNow: () => {
      // Force an immediate check by temporarily stopping and starting monitoring
      walletMonitor.stopMonitoring();
      setTimeout(() => {
        walletMonitor.startMonitoring();
      }, 100);
    }
  };
}