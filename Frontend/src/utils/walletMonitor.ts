import { AppConfig, UserSession } from '@stacks/connect';
import { useStacksStore } from '../store/stacksStore';

export class WalletMonitor {
  private static instance: WalletMonitor;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private notificationCallbacks: {
    onAccountChange?: (newAddress: string, oldAddress: string) => void;
    onDisconnect?: () => void;
    onError?: (message: string) => void;
  } = {};

  static getInstance(): WalletMonitor {
    if (!WalletMonitor.instance) {
      WalletMonitor.instance = new WalletMonitor();
    }
    return WalletMonitor.instance;
  }

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Set notification callbacks for React components
   */
  setNotificationCallbacks(callbacks: {
    onAccountChange?: (newAddress: string, oldAddress: string) => void;
    onDisconnect?: () => void;
    onError?: (message: string) => void;
  }): void {
    this.notificationCallbacks = callbacks;
  }

  /**
   * Start monitoring wallet account changes
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log('👀 Wallet monitoring already active');
      return;
    }

    console.log('🔍 Starting wallet account monitoring...');
    this.isMonitoring = true;
    
    // Check every 1 second for account changes (more frequent)
    this.monitoringInterval = setInterval(() => {
      this.checkForAccountChange();
    }, 1000);

    // Also listen to storage changes (for multi-tab scenarios)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen to focus events (when user returns to tab)
    window.addEventListener('focus', this.checkForAccountChange.bind(this));
    
    // Listen to visibility change events
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForAccountChange();
      }
    });
  }

  /**
   * Stop monitoring wallet account changes
   */
  stopMonitoring(): void {
    console.log('⏹️ Stopping wallet account monitoring');
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    window.removeEventListener('focus', this.checkForAccountChange.bind(this));
  }

  /**
   * Check if the wallet account has changed
   */
  private async checkForAccountChange(): Promise<void> {
    try {
      const currentWalletAddress = await this.getCurrentWalletAddress();
      const storeAddress = useStacksStore.getState().userAddress;
      
      console.log('🔍 Checking wallet accounts:');
      console.log('  Store address:', storeAddress);
      console.log('  Current wallet:', currentWalletAddress);
      
      // If we have a current address and it doesn't match what's in the store
      if (currentWalletAddress && storeAddress && currentWalletAddress !== storeAddress) {
        console.log('🔄 Wallet account change detected!');
        console.log('  Previous:', storeAddress);
        console.log('  Current:', currentWalletAddress);
        
        this.handleAccountChange(currentWalletAddress, storeAddress);
        return;
      }
      
      // If wallet was disconnected
      if (!currentWalletAddress && storeAddress) {
        console.log('💔 Wallet disconnected');
        this.handleWalletDisconnect();
        return;
      }
      
      // If we detect a wallet connection when none was stored
      if (currentWalletAddress && !storeAddress) {
        console.log('🔗 New wallet connection detected');
        const store = useStacksStore.getState();
        store.setTestAddress(currentWalletAddress);
        return;
      }
      
    } catch (error) {
      console.error('❌ Error checking wallet account:', error);
    }
  }

  /**
   * Get the current wallet address from multiple sources
   */
  private async getCurrentWalletAddress(): Promise<string | null> {
    try {
      // Method 1: Try to get from window.StacksProvider if available
      if (typeof window !== 'undefined' && (window as any).StacksProvider) {
        try {
          const provider = (window as any).StacksProvider;
          if (provider.getAddress) {
            const address = await provider.getAddress();
            if (address) {
              console.log('📡 Got address from StacksProvider:', address);
              return address;
            }
          }
        } catch (error) {
          console.log('⚠️ StacksProvider method failed:', error);
        }
      }

      // Method 2: Check Stacks Connect UserSession
      const appConfig = new AppConfig(['store_write', 'publish_data']);
      const userSession = new UserSession({ appConfig });
      
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
        if (address) {
          console.log('📡 Got address from UserSession:', address);
          return address;
        }
      }

      // Method 3: Check localStorage as fallback
      const savedAddress = localStorage.getItem('stacksfit_wallet_address');
      if (savedAddress) {
        console.log('📡 Got address from localStorage:', savedAddress);
        return savedAddress;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to get current wallet address:', error);
      return null;
    }
  }

  /**
   * Handle wallet account change
   */
  private handleAccountChange(newAddress: string, oldAddress: string): void {
    const store = useStacksStore.getState();
    
    // Use callback if available, otherwise fallback to DOM notification
    if (this.notificationCallbacks.onAccountChange) {
      this.notificationCallbacks.onAccountChange(newAddress, oldAddress);
    } else {
      this.showAccountChangeNotification(newAddress, oldAddress);
    }
    
    // Clear old data from store
    this.clearUserData();
    
    // Update store with new address
    store.setTestAddress(newAddress);
    
    // Update localStorage
    localStorage.setItem('stacksfit_wallet_address', newAddress);
    
    // Reload user data for new account
    setTimeout(async () => {
      try {
        await store.getDailyProgress();
        await store.getAchievements();
        await store.getNFTCollection();
        console.log('✅ Loaded data for new wallet account');
      } catch (error) {
        console.error('❌ Failed to load data for new account:', error);
      }
    }, 1000);
  }

  /**
   * Handle wallet disconnect
   */
  private handleWalletDisconnect(): void {
    console.log('🚪 Handling wallet disconnect');
    const store = useStacksStore.getState();
    
    // Clear store data
    this.clearUserData();
    store.disconnectWallet();
    
    // Use callback if available, otherwise fallback to DOM notification
    if (this.notificationCallbacks.onDisconnect) {
      this.notificationCallbacks.onDisconnect();
    } else {
      this.showDisconnectNotification();
    }
  }

  /**
   * Clear user data from store
   */
  private clearUserData(): void {
    const store = useStacksStore.getState();
    
    // Reset store state (you'll need to add this method to your store)
    if (typeof store.clearUserData === 'function') {
      store.clearUserData();
    }
  }

  /**
   * Handle localStorage changes (multi-tab scenarios)
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'stacksfit_wallet_address' || event.key === 'stacksfit_wallet_connected') {
      console.log('💾 Wallet storage changed in another tab');
      this.checkForAccountChange();
    }
  }

  /**
   * Show account change notification
   */
  private showAccountChangeNotification(newAddress: string, _oldAddress: string): void {
    // Create a nice notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        max-width: 400px;
        font-family: system-ui, -apple-system, sans-serif;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 24px;">🔄</span>
          <div style="font-weight: 600; font-size: 16px;">Wallet Account Changed</div>
        </div>
        <div style="font-size: 14px; opacity: 0.9; line-height: 1.4;">
          Switched to: <strong>${newAddress.slice(0, 8)}...${newAddress.slice(-6)}</strong><br>
          Your app data has been updated for the new account.
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }

  /**
   * Show disconnect notification
   */
  private showDisconnectNotification(): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        max-width: 400px;
        font-family: system-ui, -apple-system, sans-serif;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 24px;">💔</span>
          <div style="font-weight: 600; font-size: 16px;">Wallet Disconnected</div>
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Please reconnect your wallet to continue using StacksFit.
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }
}

// Export singleton instance
export const walletMonitor = WalletMonitor.getInstance();