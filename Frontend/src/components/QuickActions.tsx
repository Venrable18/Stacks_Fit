import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStacksStore } from '../store/stacksStore';
import { Activity, Flame, Heart, Save } from 'lucide-react';

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ className = '' }) => {
  const { recordDailyProgress, isTransactionPending, userAddress } = useStacksStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    steps: 0,
    calories: 0,
    activeTime: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 Custom form submitted:', formData);
    console.log('🔗 User address:', userAddress);
    
    if (!userAddress) {
      alert('Please connect your wallet first!');
      return;
    }
    
    if (formData.steps === 0 && formData.calories === 0 && formData.activeTime === 0) {
      alert('Please enter at least some activity data!');
      return;
    }
    
    await recordDailyProgress(formData);
    setShowForm(false);
    setFormData({ steps: 0, calories: 0, activeTime: 0 });
  };

  const quickPresets = [
    { 
      name: 'Morning Walk', 
      data: { steps: 3000, calories: 150, activeTime: 30 },
      icon: Activity,
      color: 'blue'
    },
    { 
      name: 'Gym Session', 
      data: { steps: 1500, calories: 400, activeTime: 60 },
      icon: Flame,
      color: 'orange'
    },
    { 
      name: 'Evening Run', 
      data: { steps: 5000, calories: 300, activeTime: 45 },
      icon: Heart,
      color: 'red'
    }
  ];

  if (!userAddress) {
    return (
      <div className={`glass-morphism rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <p className="text-white/60 mb-2">Connect your wallet to test blockchain recording</p>
          <button 
            disabled 
            className="px-4 py-2 bg-gray-600 text-white/40 rounded-lg cursor-not-allowed"
          >
            Wallet Required
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-morphism rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⚡</span>
        <h3 className="text-white font-semibold">Quick Actions</h3>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
          Blockchain Test
        </span>
      </div>
      
      {!showForm ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickPresets.map((preset) => {
              const IconComponent = preset.icon;
              const getButtonStyles = (color: string) => {
                const styles = {
                  blue: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400',
                  orange: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 text-orange-400',
                  red: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400'
                };
                return styles[color as keyof typeof styles] || styles.blue;
              };

              return (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('🎯 Quick action clicked:', preset.name, preset.data);
                    recordDailyProgress(preset.data);
                  }}
                  disabled={isTransactionPending}
                  className={`p-3 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyles(preset.color)}`}
                >
                  <IconComponent className="w-5 h-5 mx-auto mb-2" />
                  <div className="text-sm text-white font-medium">{preset.name}</div>
                  <div className="text-xs text-white/60">
                    {preset.data.steps} steps, {preset.data.calories} cal
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => setShowForm(true)}
              disabled={isTransactionPending}
              className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 
                text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Custom Entry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/60 mb-1">Steps</label>
              <input
                type="number"
                value={formData.steps}
                onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Minutes</label>
              <input
                type="number"
                value={formData.activeTime}
                onChange={(e) => setFormData({...formData, activeTime: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isTransactionPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 
                border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isTransactionPending ? 'Recording...' : 'Record on Blockchain'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-300 
                rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {isTransactionPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-yellow-400"
            >
              🔄
            </motion.div>
            <span className="text-yellow-300 text-sm">Recording your data on the blockchain...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuickActions;