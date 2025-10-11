import React from 'react';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: {
    id: number;
    name: string;
    description: string;
    earned: boolean;
    earnedDate?: string;
    nftId?: number;
  };
  delay?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`relative p-6 rounded-2xl border transition-all duration-300 ${
        achievement.earned
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
          : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
      }`}
    >
      {achievement.earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.5 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-sm">✓</span>
        </motion.div>
      )}

      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
          achievement.earned
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
            : 'bg-gray-700'
        }`}>
          {achievement.earned ? '🏆' : '🔒'}
        </div>
        <div>
          <h3 className={`font-semibold ${
            achievement.earned ? 'text-yellow-300' : 'text-gray-400'
          }`}>
            {achievement.name}
          </h3>
          {achievement.earnedDate && (
            <p className="text-sm text-gray-500">
              Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <p className={`text-sm ${
        achievement.earned ? 'text-gray-300' : 'text-gray-500'
      }`}>
        {achievement.description}
      </p>

      {achievement.earned && achievement.nftId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.5 }}
          className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30"
        >
          <p className="text-xs text-purple-300 font-medium">
            NFT #{achievement.nftId} minted
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AchievementCard;