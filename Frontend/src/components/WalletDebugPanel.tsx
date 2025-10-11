import React, { useState, useEffect } from 'react';
import { Bug, Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { walletAccountChecker } from '../utils/walletAccountChecker';
import { useStacksStore } from '../store/stacksStore';

export const WalletDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    isMonitoring: false,
    currentAddress: null as string | null,
    lastCheck: null as Date | null,
    checkCount: 0,
    errors: [] as string[]
  });

  const { isWalletConnected, userAddress } = useStacksStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setDebugInfo(prev => ({
        ...prev,
        lastCheck: new Date(),
        checkCount: prev.checkCount + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTestManualCheck = async () => {
    try {
      const result = await walletAccountChecker.forceCheck();
      setDebugInfo(prev => ({
        ...prev,
        currentAddress: result.newAddress,
        errors: result.changed 
          ? [...prev.errors, `Account changed: ${result.oldAddress} -> ${result.newAddress}`]
          : prev.errors
      }));
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, `Error: ${error.message}`]
      }));
    }
  };

  const simulateAccountChange = () => {
    // Manually trigger the account change callback to test UI
    const oldAddr = userAddress || 'ST1234...';
    const newAddr = 'ST9876543210ABCDEF1234567890ABCDEF12345678';
    
    console.log('🧪 Simulating account change for testing');
    setDebugInfo(prev => ({
      ...prev,
      errors: [...prev.errors, `SIMULATED: Account change ${oldAddr} -> ${newAddr}`]
    }));
  };

  const clearErrors = () => {
    setDebugInfo(prev => ({ ...prev, errors: [] }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-sm border border-purple-500/50 rounded-lg p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-purple-400 font-semibold flex items-center gap-2">
          <Bug className="w-4 h-4" />
          Wallet Debug
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Status */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          {isWalletConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className="text-white">
            {isWalletConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="text-xs text-gray-300">
          <div>Store Address: <span className="text-blue-400">{userAddress || 'None'}</span></div>
          <div>Debug Address: <span className="text-green-400">{debugInfo.currentAddress || 'None'}</span></div>
          <div>Checks: <span className="text-yellow-400">{debugInfo.checkCount}</span></div>
          <div>Last: <span className="text-gray-400">{debugInfo.lastCheck?.toLocaleTimeString() || 'Never'}</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-2 mb-4">
        <button
          onClick={handleTestManualCheck}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Manual Check
        </button>

        <button
          onClick={simulateAccountChange}
          className="w-full flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          Simulate Change
        </button>

        {debugInfo.errors.length > 0 && (
          <button
            onClick={clearErrors}
            className="w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition-colors"
          >
            Clear ({debugInfo.errors.length})
          </button>
        )}
      </div>

      {/* Errors */}
      {debugInfo.errors.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-red-400 text-xs font-semibold">Recent Events:</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {debugInfo.errors.slice(-5).map((error, i) => (
              <div key={i} className="text-xs text-red-300 bg-red-900/20 p-1 rounded">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        💡 Use this to test wallet monitoring functionality
      </div>
    </div>
  );
};

export default WalletDebugPanel;