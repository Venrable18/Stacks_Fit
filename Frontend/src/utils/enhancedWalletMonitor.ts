import { useStacksStore } from '../store/stacksStore';

/**
 * Enhanced wallet monitoring that includes multiple detection methods
 */
export class EnhancedWalletMonitor {
  private static instance: EnhancedWalletMonitor;
  private intervalId: NodeJS.Timeout | null = null;
  private lastKnownAddress: string | null = null;
  private isActive = false;

  static getInstance(): EnhancedWalletMonitor {
    if (!EnhancedWalletMonitor.instance) {
      EnhancedWalletMonitor.instance = new EnhancedWalletMonitor();
    }
    return EnhancedWalletMonitor.instance;
  }

  /**
   * Start aggressive monitoring
   */
  startMonitoring(): void {
    if (this.isActive) return;
    
    console.log('🚀 Starting enhanced wallet monitoring...');
    this.isActive = true;
    this.lastKnownAddress = useStacksStore.getState().userAddress;
    
    // Check every 500ms for immediate detection
    this.intervalId = setInterval(() => {
      this.checkAllSources();
    }, 500);

    // Listen to multiple browser events
    window.addEventListener('focus', this.checkAllSources.bind(this));
    window.addEventListener('visibilitychange', this.checkAllSources.bind(this));
    document.addEventListener('click', this.checkAllSources.bind(this));
    
    // Listen to localStorage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'stacksfit_wallet_address') {
        console.log('📦 LocalStorage wallet address changed:', e.newValue);
        this.handleAddressChange(e.newValue);
      }
    });

    console.log('✅ Enhanced wallet monitoring started');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (!this.isActive) return;
    
    console.log('⏹️ Stopping enhanced wallet monitoring');
    this.isActive = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    window.removeEventListener('focus', this.checkAllSources.bind(this));
    window.removeEventListener('visibilitychange', this.checkAllSources.bind(this));
    document.removeEventListener('click', this.checkAllSources.bind(this));
  }

  /**
   * Check all possible sources for wallet address
   */
  private async checkAllSources(): Promise<void> {
    try {
      const storeAddress = useStacksStore.getState().userAddress;
      const currentAddress = await this.getCurrentWalletAddress();
      
      // Log current state for debugging
      if (Math.random() < 0.1) { // Only log 10% of the time to avoid spam
        console.log('🔍 Wallet check:', {
          store: storeAddress,
          detected: currentAddress,
          lastKnown: this.lastKnownAddress
        });
      }

      // Check for changes
      if (currentAddress !== storeAddress) {
        console.log('🚨 WALLET ADDRESS MISMATCH DETECTED!');
        console.log('  Store:', storeAddress);
        console.log('  Detected:', currentAddress);
        
        this.handleAddressChange(currentAddress);
      }

    } catch (error) {
      console.error('❌ Error in checkAllSources:', error);
    }
  }

  /**
   * Get current wallet address from multiple sources
   */
  private async getCurrentWalletAddress(): Promise<string | null> {
    // Method 1: Check browser extension directly
    if (typeof window !== 'undefined') {
      // Check for Hiro Wallet
      if ((window as any).HiroWalletProvider) {
        try {
          const provider = (window as any).HiroWalletProvider;
          if (provider.getAddresses) {
            const addresses = await provider.getAddresses();
            if (addresses && addresses.length > 0) {
              console.log('📱 Found address from Hiro Wallet:', addresses[0]);
              return addresses[0];
            }
          }
        } catch (error) {
          console.log('⚠️ Hiro Wallet check failed:', error);
        }
      }

      // Check for Xverse Wallet
      if ((window as any).XverseProviders?.StacksProvider) {
        try {
          const provider = (window as any).XverseProviders.StacksProvider;
          if (provider.getAddresses) {
            const addresses = await provider.getAddresses();
            if (addresses && addresses.length > 0) {
              console.log('📱 Found address from Xverse:', addresses[0]);
              return addresses[0];
            }
          }
        } catch (error) {
          console.log('⚠️ Xverse check failed:', error);
        }
      }

      // Check for any StacksProvider
      if ((window as any).StacksProvider) {
        try {
          const provider = (window as any).StacksProvider;
          if (provider.getAddress) {
            const address = await provider.getAddress();
            if (address) {
              console.log('📱 Found address from generic StacksProvider:', address);
              return address;
            }
          }
        } catch (error) {
          console.log('⚠️ Generic StacksProvider check failed:', error);
        }
      }
    }

    // Method 2: Check localStorage
    const savedAddress = localStorage.getItem('stacksfit_wallet_address');
    if (savedAddress) {
      console.log('💾 Found address in localStorage:', savedAddress);
      return savedAddress;
    }

    return null;
  }

  /**
   * Handle address change
   */
  private handleAddressChange(newAddress: string | null): void {
    const store = useStacksStore.getState();
    const currentStoreAddress = store.userAddress;

    if (newAddress && newAddress !== currentStoreAddress) {
      console.log('🔄 Updating store with new address:', newAddress);
      
      // Show immediate user feedback
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        font-family: system-ui, -apple-system, sans-serif;
      `;
      notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">🔄 Wallet Account Changed!</div>
        <div style="font-size: 14px; opacity: 0.9;">
          New: ${newAddress.slice(0, 8)}...${newAddress.slice(-6)}<br>
          Updating app data...
        </div>
      `;
      document.body.appendChild(notification);

      // Update store
      store.setTestAddress(newAddress);
      
      // Clear and reload data
      store.clearUserData();
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        notification.remove();
      }, 5000);

      this.lastKnownAddress = newAddress;
    }
  }

  /**
   * Force immediate check
   */
  async forceCheck(): Promise<void> {
    console.log('🔍 Force checking wallet status...');
    await this.checkAllSources();
  }
}

// Export singleton
export const enhancedWalletMonitor = EnhancedWalletMonitor.getInstance();