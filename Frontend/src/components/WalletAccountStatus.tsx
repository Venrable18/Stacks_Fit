import React, { useState, useEffect } from 'react';
import { RefreshCw, Wallet, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { walletAccountChecker } from '../utils/walletAccountChecker';
import { useStacksStore } from '../store/stacksStore';

export const WalletAccountStatus: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<'unknown' | 'monitoring' | 'changed' | 'stable'>('unknown');
  
  const { isWalletConnected, userAddress } = useStacksStore();

  useEffect(() => {
    if (isWalletConnected) {
      setCurrentAddress(userAddress);
      setStatus('monitoring');
      
      // Start monitoring with callback
      walletAccountChecker.startMonitoring((newAddress, oldAddress) => {
        console.log('🚨 Account changed in WalletAccountStatus:', { newAddress, oldAddress });
        setStatus('changed');
        setCurrentAddress(newAddress);
        
        // Show urgent alert with immediate action
        const shouldContinue = confirm(
          `🚨 CRITICAL SECURITY ALERT!\n\n` +
          `Your wallet account has changed while using the app.\n\n` +
          `Old Account: ${oldAddress?.slice(0, 12)}...\n` +
          `New Account: ${newAddress?.slice(0, 12)}...\n\n` +
          `For your security, you will be disconnected immediately.\n\n` +
          `Click OK to proceed with disconnection.`
        );
        
        if (shouldContinue || true) { // Always disconnect regardless of choice
          // Force immediate disconnection
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
      
    } else {
      walletAccountChecker.stopMonitoring();
      setStatus('unknown');
      setCurrentAddress(null);
    }
    
    return () => {
      walletAccountChecker.stopMonitoring();
    };
  }, [isWalletConnected, userAddress]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const result = await walletAccountChecker.forceCheck();
      setLastCheck(new Date());
      
      if (result.changed) {
        setStatus('changed');
        alert(`🔄 Account change detected!\n\nOld: ${result.oldAddress}\nNew: ${result.newAddress}`);
      } else {
        setStatus('stable');
      }
      
    } catch (error) {
      console.error('Manual check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'monitoring': return 'text-blue-400 border-blue-400';
      case 'stable': return 'text-green-400 border-green-400';
      case 'changed': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'monitoring': return <Wallet className="w-4 h-4" />;
      case 'stable': return <CheckCircle className="w-4 h-4" />;
      case 'changed': return <AlertTriangle className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'monitoring': return 'Monitoring';
      case 'stable': return 'Stable';
      case 'changed': return 'Changed!';
      default: return 'Unknown';
    }
  };

  if (!isWalletConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Monitor
        </h3>
        <button
          onClick={handleManualCheck}
          disabled={isChecking}
          className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          Check
        </button>
      </div>
      
      <div className={`flex items-center gap-2 mb-2 p-2 border rounded ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>
      
      <div className="space-y-1 text-xs text-gray-300">
        <div>
          <span className="text-gray-400">Address:</span>
          <div className="font-mono text-white truncate">
            {currentAddress || 'Not detected'}
          </div>
        </div>
        
        {lastCheck && (
          <div>
            <span className="text-gray-400">Last Check:</span>
            <span className="text-white ml-1">
              {lastCheck.toLocaleTimeString()}
            </span>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400">
          💡 This monitors for wallet account changes in real-time
        </div>
      </div>
    </div>
  );
};

export default WalletAccountStatus;