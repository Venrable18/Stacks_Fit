/**
 * Enhanced Wallet Account Checker
 * Aggressively monitors for wallet account changes and forces re-authentication
 */

import { UserSession } from '@stacks/connect';
import { useStacksStore } from '../store/stacksStore';

export class WalletAccountChecker {
  private userSession: UserSession;
  private currentAddress: string | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private onAccountChangeCallback?: (newAddress: string, oldAddress: string) => void;

  constructor() {
    this.userSession = new UserSession();
  }

  /**
   * Start aggressive account monitoring with forced UserSession clearing
   */
  startMonitoring(onAccountChange?: (newAddress: string, oldAddress: string) => void) {
    if (this.isMonitoring) return;
    
    this.onAccountChangeCallback = onAccountChange;
    this.isMonitoring = true;
    
    // Get initial address
    this.currentAddress = this.getCurrentAddress();
    console.log('🚀 Starting AGGRESSIVE wallet account monitoring. Current address:', this.currentAddress);

    // Check every 50ms for IMMEDIATE detection
    this.checkInterval = setInterval(() => {
      this.checkForAccountChange();
    }, 50);

    // Also listen for browser events
    this.setupEventListeners();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.removeEventListeners();
    this.isMonitoring = false;
    console.log('🛑 Stopped wallet account monitoring');
  }

  /**
   * Get current wallet address from multiple sources
   */
  private getCurrentAddress(): string | null {
    try {
      // Method 1: UserSession
      if (this.userSession.isUserSignedIn()) {
        const userData = this.userSession.loadUserData();
        const sessionAddress = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet;
        if (sessionAddress) return sessionAddress;
      }

      // Method 2: Window wallet providers
      const windowAny = window as any;
      
      // Check Hiro Wallet
      if (windowAny.HiroWalletProvider?.getAddresses) {
        const hiroAddresses = windowAny.HiroWalletProvider.getAddresses();
        if (hiroAddresses?.length > 0) return hiroAddresses[0];
      }

      // Check Xverse
      if (windowAny.XverseProviders?.StacksProvider?.getAddresses) {
        const xverseAddresses = windowAny.XverseProviders.StacksProvider.getAddresses();
        if (xverseAddresses?.length > 0) return xverseAddresses[0];
      }

      // Check generic StacksProvider
      if (windowAny.StacksProvider?.getAddresses) {
        const stacksAddresses = windowAny.StacksProvider.getAddresses();
        if (stacksAddresses?.length > 0) return stacksAddresses[0];
      }

      return null;
    } catch (error) {
      console.error('Error getting current address:', error);
      return null;
    }
  }

  /**
   * Check for account changes with forced session clearing
   */
  private async checkForAccountChange() {
    try {
      const newAddress = this.getCurrentAddress();
      
      if (newAddress && this.currentAddress && newAddress !== this.currentAddress) {
        console.log('🔄 ACCOUNT CHANGE DETECTED!');
        console.log('Previous address:', this.currentAddress);
        console.log('New address:', newAddress);
        
        // IMMEDIATE: Stop monitoring to prevent multiple triggers
        this.stopMonitoring();
        
        // Show immediate alert
        alert(`🚨 SECURITY ALERT: Wallet Account Changed!\n\nFor your security, you will be disconnected immediately.\n\nOld: ${this.currentAddress.slice(0, 12)}...\nNew: ${newAddress.slice(0, 12)}...`);
        
        // Force clear the UserSession data
        await this.forceSessionClear();
        
        // Update tracking
        const oldAddress = this.currentAddress;
        this.currentAddress = newAddress;
        
        // Trigger callback
        if (this.onAccountChangeCallback) {
          this.onAccountChangeCallback(newAddress, oldAddress);
        }
        
        // Force a complete wallet reconnection
        await this.forceWalletReconnection();
        
        // Force page reload after a short delay to ensure complete cleanup
        setTimeout(() => {
          console.log('🔄 Force reloading page for complete security cleanup...');
          window.location.reload();
        }, 1500);
        
      } else if (newAddress && !this.currentAddress) {
        // First time detection
        this.currentAddress = newAddress;
        console.log('👛 Initial wallet address detected:', newAddress);
      }
    } catch (error) {
      console.error('Error checking for account change:', error);
    }
  }

  /**
   * Force clear UserSession data and local storage
   */
  private async forceSessionClear() {
    try {
      console.log('🧹 Force clearing UserSession data...');
      
      // Clear UserSession
      if (this.userSession.isUserSignedIn()) {
        this.userSession.signUserOut();
      }
      
      // Clear all Stacks-related localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('stacks') || 
          key.includes('blockstack') ||
          key.includes('wallet') ||
          key.includes('user') ||
          key.includes('auth') ||
          key.includes('stacksfit') ||
          key.includes('connect')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed localStorage key: ${key}`);
      });
      
      // Clear sessionStorage too
      sessionStorage.clear();
      
      // Clear any cookies related to wallet/auth
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (name.trim().toLowerCase().includes('stacks') || 
            name.trim().toLowerCase().includes('wallet') ||
            name.trim().toLowerCase().includes('auth')) {
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      
    } catch (error) {
      console.error('Error force clearing session:', error);
    }
  }

  /**
   * Force wallet reconnection through store
   */
  private async forceWalletReconnection() {
    try {
      console.log('🔄 Forcing wallet reconnection...');
      
      // Get store state
      const store = useStacksStore.getState();
      
      // Clear user data
      if (store.clearUserData) {
        store.clearUserData();
      }
      
      // Force disconnect then reconnect
      store.disconnectWallet();
      
      // Small delay to ensure state updates
      setTimeout(() => {
        console.log('🔗 Attempting wallet reconnection...');
        // The user will need to reconnect manually
        // This is intentional for security
      }, 100);
      
    } catch (error) {
      console.error('Error forcing wallet reconnection:', error);
    }
  }

  /**
   * Setup event listeners for additional detection
   */
  private setupEventListeners() {
    // Listen for storage events (cross-tab changes)
    window.addEventListener('storage', this.handleStorageChange);
    
    // Listen for focus events (user switching back to tab after wallet change)
    window.addEventListener('focus', this.handleWindowFocus);
    
    // Listen for wallet provider events
    const windowAny = window as any;
    if (windowAny.addEventListener) {
      windowAny.addEventListener('wallet_accountChanged', this.handleWalletEvent);
      windowAny.addEventListener('accountsChanged', this.handleWalletEvent);
    }
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('focus', this.handleWindowFocus);
    
    const windowAny = window as any;
    if (windowAny.removeEventListener) {
      windowAny.removeEventListener('wallet_accountChanged', this.handleWalletEvent);
      windowAny.removeEventListener('accountsChanged', this.handleWalletEvent);
    }
  }

  /**
   * Handle storage change events
   */
  private handleStorageChange = (event: StorageEvent) => {
    if (event.key && (event.key.includes('stacks') || event.key.includes('wallet'))) {
      console.log('📦 Storage change detected, checking account...');
      this.checkForAccountChange();
    }
  };

  /**
   * Handle window focus events
   */
  private handleWindowFocus = () => {
    console.log('👀 Window focus detected, checking account...');
    this.checkForAccountChange();
  };

  /**
   * Handle wallet provider events
   */
  private handleWalletEvent = (event: any) => {
    console.log('💳 Wallet provider event detected:', event.type);
    this.checkForAccountChange();
  };

  /**
   * Manual check for account changes (for button integration)
   */
  async forceCheck(): Promise<{ changed: boolean; newAddress: string | null; oldAddress: string | null }> {
    const oldAddress = this.currentAddress;
    await this.checkForAccountChange();
    const newAddress = this.currentAddress;
    
    return {
      changed: oldAddress !== newAddress,
      newAddress,
      oldAddress
    };
  }
}

// Export singleton instance
export const walletAccountChecker = new WalletAccountChecker();