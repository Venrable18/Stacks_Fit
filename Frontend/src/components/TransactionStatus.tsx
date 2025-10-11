import React from 'react';
import { useStacksStore } from '../store/stacksStore';
import { motion } from 'framer-motion';

interface TransactionStatusProps {
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ className = '' }) => {
  const { transactions, isTransactionPending } = useStacksStore();
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);
  
  if (recentTransactions.length === 0 && !isTransactionPending) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '🔄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTxId = (txId: string) => {
    if (txId.startsWith('pending-')) return 'Pending...';
    return txId.length > 12 ? `${txId.slice(0, 8)}...${txId.slice(-4)}` : txId;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⛓️</span>
        <h3 className="text-white font-semibold">Blockchain Status</h3>
      </div>
      
      {isTransactionPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded"
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-yellow-400"
          >
            🔄
          </motion.span>
          <span className="text-yellow-300 text-sm">Recording data on blockchain...</span>
        </motion.div>
      )}
      
      <div className="space-y-2">
        {recentTransactions.map((tx, index) => (
          <motion.div
            key={tx.txId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{getStatusIcon(tx.status)}</span>
              <div>
                <div className="text-sm text-white/80 capitalize">
                  {tx.type === 'progress' ? '📊 Daily Progress' : 
                   tx.type === 'profile' ? '👤 Profile Update' : 
                   tx.type === 'achievement' ? '🏆 Achievement' : tx.type}
                </div>
                <div className="text-xs text-white/50">
                  {formatTxId(tx.txId)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${getStatusColor(tx.status)}`}>
                {tx.status.toUpperCase()}
              </div>
              <div className="text-xs text-white/40">
                {new Date(tx.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {recentTransactions.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            Your fitness data is being securely recorded on the Stacks blockchain
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TransactionStatus;