/**
 * Simple and Reliable Wallet Monitor
 * Focuses on detecting account changes and forcing disconnection
 */

import { UserSession } from '@stacks/connect';
import { useStacksStore } from '../store/stacksStore';

class SimpleWalletMonitor {
  private userSession: UserSession;
  private currentAddress: string | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private onAccountChangeCallback?: (newAddress: string, oldAddress: string) => void;

  constructor() {
    this.userSession = new UserSession();
  }

  /**
   * Start monitoring for wallet account changes
   */
  startMonitoring(onAccountChange?: (newAddress: string, oldAddress: string) => void) {
    if (this.isMonitoring) {
      console.log('👀 Wallet monitor already running');
      return;
    }
    
    this.onAccountChangeCallback = onAccountChange;
    this.isMonitoring = true;
    
    // Get initial address
    this.currentAddress = this.getCurrentWalletAddress();
    console.log('🔍 Starting wallet monitoring. Initial address:', this.currentAddress);

    // Check every 200ms (less aggressive but more reliable)
    this.checkInterval = setInterval(() => {
      this.checkForAccountChange();
    }, 200);

    // Listen for storage changes (cross-tab wallet changes)
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('focus', this.handleWindowFocus);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('focus', this.handleWindowFocus);
    
    this.isMonitoring = false;
    console.log('🛑 Stopped wallet monitoring');
  }

  /**
   * Get current wallet address from UserSession
   */
  private getCurrentWalletAddress(): string | null {
    try {
      if (this.userSession.isUserSignedIn()) {
        const userData = this.userSession.loadUserData();
        return userData.profile?.stxAddress?.testnet || 
               userData.profile?.stxAddress?.mainnet || 
               null;
      }
      return null;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  }

  /**
   * Check for account changes
   */
  private checkForAccountChange() {
    try {
      const newAddress = this.getCurrentWalletAddress();
      
      // Only trigger if we have both old and new addresses and they're different
      if (this.currentAddress && newAddress && newAddress !== this.currentAddress) {
        console.log('🚨 WALLET ACCOUNT CHANGED!');
        console.log('Previous:', this.currentAddress);
        console.log('New:', newAddress);
        
        // Stop monitoring to prevent multiple triggers
        this.stopMonitoring();
        
        // Trigger callback
        if (this.onAccountChangeCallback) {
          this.onAccountChangeCallback(newAddress, this.currentAddress);
        }
        
        // Force immediate disconnect and cleanup
        this.forceDisconnectAndReload();
        
      } else if (newAddress) {
        // Update current address
        this.currentAddress = newAddress;
      }
    } catch (error) {
      console.error('Error checking for account change:', error);
    }
  }

  /**
   * Force disconnect and reload
   */
  private forceDisconnectAndReload() {
    try {
      console.log('🔄 Forcing wallet disconnect and app reload...');
      
      // Clear UserSession
      if (this.userSession.isUserSignedIn()) {
        this.userSession.signUserOut();
      }
      
      // Clear all wallet-related localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('stacks') || 
            key.includes('wallet') || 
            key.includes('blockstack') ||
            key.includes('connect')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Disconnect through store
      const { disconnectWallet } = useStacksStore.getState();
      disconnectWallet();
      
      // Force page reload after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error during forced disconnect:', error);
      // Fallback: just reload the page
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  /**
   * Handle storage changes
   */
  private handleStorageChange = (event: StorageEvent) => {
    if (event.key && (
      event.key.includes('stacks') || 
      event.key.includes('wallet') ||
      event.key.includes('connect')
    )) {
      console.log('📦 Storage change detected, checking wallet...');
      setTimeout(() => this.checkForAccountChange(), 100);
    }
  };

  /**
   * Handle window focus
   */
  private handleWindowFocus = () => {
    console.log('👀 Window focused, checking wallet...');
    setTimeout(() => this.checkForAccountChange(), 100);
  };

  /**
   * Manual check for testing
   */
  forceCheck(): { currentAddress: string | null; isMonitoring: boolean } {
    const address = this.getCurrentWalletAddress();
    console.log('🔍 Manual wallet check. Address:', address);
    
    if (address !== this.currentAddress) {
      this.checkForAccountChange();
    }
    
    return {
      currentAddress: address,
      isMonitoring: this.isMonitoring
    };
  }
}

// Export singleton instance
export const simpleWalletMonitor = new SimpleWalletMonitor();