import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Gift, Eye } from 'lucide-react';

interface NFTShowcaseProps {
  collection: Array<{
    id: number;
    name: string;
    image: string;
    achievement: string;
  }>;
}

const NFTShowcase: React.FC<NFTShowcaseProps> = ({ collection }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Your NFT Collection</h2>
        <p className="text-gray-400">Achievement badges minted on the Stacks blockchain</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-6"
      >
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400">{collection.length}</div>
          <div className="text-gray-400 text-sm">NFTs Owned</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">12</div>
          <div className="text-gray-400 text-sm">Total Achievements</div>
        </div>
        <div className="glass-morphism rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-400">85%</div>
          <div className="text-gray-400 text-sm">Collection Progress</div>
        </div>
      </motion.div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collection.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="nft-card group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-t-2xl">
              <div className="w-full h-48 bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 flex items-center justify-center">
                <div className="text-6xl">
                  {nft.id === 1 ? '🏃' : nft.id === 2 ? '🏆' : '💪'}
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                <Award size={16} className="text-yellow-400" />
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{nft.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Achievement: {nft.achievement}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-sm text-gray-300">Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Eye size={16} className="text-gray-300" />
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Gift size={16} className="text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Coming Soon Cards */}
        {Array.from({ length: 6 - collection.length }, (_, index) => (
          <motion.div
            key={`coming-soon-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (collection.length + index) * 0.1, duration: 0.5 }}
            className="nft-card border-dashed border-2 border-gray-600 flex flex-col items-center justify-center text-center p-6 min-h-[300px]"
          >
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Coming Soon</h3>
            <p className="text-gray-500 text-sm">Unlock by completing achievements</p>
          </motion.div>
        ))}
      </div>

      {/* Collection Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-morphism rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Collection Insights</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-2xl font-bold text-green-400">0.5 STX</div>
            <div className="text-gray-400 text-sm">Estimated Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">Rare</div>
            <div className="text-gray-400 text-sm">Rarest NFT</div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm text-gray-300 mb-2">Collection Completion</div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
              style={{ width: `${(collection.length / 12) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {collection.length} of 12 achievements unlocked
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NFTShowcase;