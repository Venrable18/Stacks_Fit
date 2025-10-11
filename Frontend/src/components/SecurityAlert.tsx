import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityAlertProps {
  isVisible: boolean;
  oldAddress: string;
  newAddress: string;
  onConfirm: () => void;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({
  isVisible,
  oldAddress,
  newAddress,
  onConfirm
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isVisible && countdown === 0) {
      onConfirm();
    }
  }, [isVisible, countdown, onConfirm]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-red-900/95 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-red-500"
          >
            <div className="text-center">
              {/* Alert Icon */}
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🚨 Security Alert
              </h2>

              {/* Message */}
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Your wallet account has changed while using the app. For your security, 
                you will be automatically disconnected.
              </p>

              {/* Address Change Info */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Account Change Detected
                  </span>
                </div>
                
                <div className="space-y-2 text-left">
                  <div>
                    <span className="text-gray-500">Previous:</span>
                    <div className="font-mono text-xs text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 p-1 rounded mt-1">
                      {oldAddress}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Current:</span>
                    <div className="font-mono text-xs text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 p-1 rounded mt-1">
                      {newAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <RefreshCw className="w-5 h-5 text-red-600 animate-spin" />
                <span className="text-gray-700 dark:text-gray-300">
                  Auto-disconnect in <strong className="text-red-600">{countdown}</strong> seconds
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Disconnect Now
                </button>
              </div>

              {/* Security Note */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                This is a security measure to protect your data when wallet accounts change.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecurityAlert;