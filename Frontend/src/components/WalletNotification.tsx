import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, RefreshCw, X } from 'lucide-react';

interface WalletNotificationProps {
  type: 'account_change' | 'disconnect' | 'error';
  title: string;
  message: string;
  newAddress?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const WalletNotification: React.FC<WalletNotificationProps> = ({
  type,
  title,
  message,
  newAddress,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'account_change':
        return <RefreshCw className="w-6 h-6 text-blue-400" />;
      case 'disconnect':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'account_change':
        return 'from-blue-500/90 to-purple-600/90 border-blue-500/50';
      case 'disconnect':
        return 'from-red-500/90 to-pink-600/90 border-red-500/50';
      case 'error':
        return 'from-yellow-500/90 to-orange-600/90 border-yellow-500/50';
      default:
        return 'from-green-500/90 to-emerald-600/90 border-green-500/50';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`
            backdrop-blur-md bg-gradient-to-r ${getColorClasses()}
            rounded-xl border shadow-2xl p-4
          `}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed mb-2">
                  {message}
                </p>
                
                {newAddress && (
                  <div className="mt-2 p-2 bg-black/20 rounded-lg">
                    <p className="text-xs text-white/80 mb-1">New Account:</p>
                    <p className="text-white font-mono text-xs break-all">
                      {newAddress.slice(0, 12)}...{newAddress.slice(-8)}
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 hover:bg-black/20 rounded-lg transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification Manager Hook
export function useWalletNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    props: WalletNotificationProps;
  }>>([]);

  const showNotification = (props: Omit<WalletNotificationProps, 'onClose'>) => {
    const id = Date.now().toString();
    const notification = {
      id,
      props: {
        ...props,
        onClose: () => removeNotification(id)
      }
    };

    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showAccountChange = (newAddress: string) => {
    showNotification({
      type: 'account_change',
      title: 'Wallet Account Changed',
      message: 'Your wallet account has been switched. App data updated for the new account.',
      newAddress
    });
  };

  const showDisconnect = () => {
    showNotification({
      type: 'disconnect',
      title: 'Wallet Disconnected',
      message: 'Your wallet has been disconnected. Please reconnect to continue using StacksFit.',
      autoClose: false // Don't auto-close disconnect notifications
    });
  };

  const showError = (message: string) => {
    showNotification({
      type: 'error',
      title: 'Wallet Error',
      message
    });
  };

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map(({ id, props }) => (
        <WalletNotification key={id} {...props} />
      ))}
    </div>
  );

  return {
    showAccountChange,
    showDisconnect,
    showError,
    NotificationContainer
  };
}