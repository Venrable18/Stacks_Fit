import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Zap } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

const NFTCollection: React.FC = () => {
  const { 
    nftCollection, 
    userAddress, 
    getNFTCollection, 
    isLoading,
    achievements 
  } = useStacksStore();

  // Load NFT collection when component mounts
  useEffect(() => {
    if (userAddress) {
      console.log('🎨 Loading NFT collection for user:', userAddress);
      getNFTCollection();
    }
  }, [userAddress, getNFTCollection]);

  // NFT rarity levels based on achievement difficulty
  const getNFTRarity = (nftId: number) => {
    const rarities = {
      1: { level: 'Common', color: 'from-gray-500 to-gray-600', icon: '🥉' },
      2: { level: 'Rare', color: 'from-blue-500 to-blue-600', icon: '🥈' },
      3: { level: 'Epic', color: 'from-purple-500 to-purple-600', icon: '🥇' },
      4: { level: 'Legendary', color: 'from-yellow-500 to-orange-500', icon: '👑' }
    };
    return rarities[nftId as keyof typeof rarities] || rarities[1];
  };

  // Get achievement NFT descriptions
  const getNFTDescription = (nftId: number) => {
    const descriptions = {
      1: 'Awarded for maintaining a consistent workout streak',
      2: 'Earned through exceptional consistency in daily activities',
      3: 'Granted for achieving significant step milestones',
      4: 'Bestowed upon nutrition goal champions'
    };
    return descriptions[nftId as keyof typeof descriptions] || 'Special achievement NFT';
  };

  if (!userAddress) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h3 className="text-white text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Connect your Stacks wallet to view your NFT collection</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🎨
        </motion.div>
        <p className="text-white text-lg">Loading your NFT collection from blockchain...</p>
        <p className="text-gray-400 text-sm mt-2">Checking your achievements on StacksFit V2 contract</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/30 rounded-lg">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Total NFTs</h4>
              <p className="text-blue-400 font-bold text-xl">{nftCollection.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-4 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/30 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Achievements</h4>
              <p className="text-purple-400 font-bold text-xl">{achievements.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/30 rounded-lg">
              <Star className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Collection Rate</h4>
              <p className="text-green-400 font-bold text-xl">{Math.round((nftCollection.length / 4) * 100)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-xl border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/30 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Rarest NFT</h4>
              <p className="text-yellow-400 font-bold text-lg">
                {nftCollection.length > 0 ? getNFTRarity(Math.max(...nftCollection.map(nft => nft.id))).level : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {nftCollection.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nftCollection.map((nft, index) => {
            const rarity = getNFTRarity(nft.id);
            return (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                {/* NFT Card */}
                <div className={`bg-gradient-to-br ${rarity.color} p-1 rounded-2xl shadow-2xl`}>
                  <div className="bg-black/80 p-6 rounded-xl backdrop-blur-md h-full">
                    {/* Rarity Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 bg-gradient-to-r ${rarity.color} text-white text-xs font-bold rounded-full`}>
                        {rarity.level}
                      </span>
                      <div className="text-2xl">{rarity.icon}</div>
                    </div>

                    {/* NFT Image Placeholder */}
                    <div className="w-full h-40 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-6xl">
                        {nft.id === 1 ? '🔥' : 
                         nft.id === 2 ? '⚡' :
                         nft.id === 3 ? '🚀' : '🎯'}
                      </div>
                    </div>

                    {/* NFT Info */}
                    <div className="space-y-3">
                      <h3 className="text-white font-bold text-lg">{nft.name}</h3>
                      <p className="text-gray-300 text-sm">{getNFTDescription(nft.id)}</p>
                      
                      {/* Achievement Badge */}
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">{nft.achievement}</span>
                      </div>

                      {/* Blockchain Verification */}
                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Token ID</span>
                          <span className="text-xs text-green-400 font-mono">#{nft.id}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">Blockchain</span>
                          <span className="text-xs text-purple-400">Stacks</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                  </div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${rarity.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10`} />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-8xl mb-6">🏆</div>
          <h3 className="text-white text-2xl font-bold mb-4">No NFTs Yet</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Start your fitness journey and earn achievements to unlock exclusive NFT rewards!
          </p>
          
          {/* Achievement Progress */}
          <div className="bg-white/5 p-6 rounded-xl max-w-lg mx-auto">
            <h4 className="text-white font-semibold mb-4">🎯 Available NFTs to Earn</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 1, name: 'Streak Warrior', icon: '🔥', requirement: '7-day streak' },
                { id: 2, name: 'Consistency Champion', icon: '⚡', requirement: '14 days active' },
                { id: 3, name: 'Step Master', icon: '🚀', requirement: '100,000 total steps' },
                { id: 4, name: 'Nutrition Guardian', icon: '🎯', requirement: 'Complete nutrition tracking' }
              ].map((nft) => (
                <div key={nft.id} className="bg-white/5 p-3 rounded-lg">
                  <div className="text-2xl mb-1">{nft.icon}</div>
                  <h5 className="text-white text-sm font-medium">{nft.name}</h5>
                  <p className="text-gray-400 text-xs">{nft.requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Blockchain Info */}
      <div className="bg-black/20 p-4 rounded-lg border border-white/10">
        <h4 className="text-white font-medium mb-2">🔗 Blockchain Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Contract:</span>
            <span className="text-blue-400 ml-2 font-mono">stacksfit-v2</span>
          </div>
          <div>
            <span className="text-gray-400">Network:</span>
            <span className="text-green-400 ml-2">Stacks Testnet</span>
          </div>
          <div>
            <span className="text-gray-400">Your Address:</span>
            <span className="text-purple-400 ml-2 font-mono">
              {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}` : 'Not connected'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Last Updated:</span>
            <span className="text-yellow-400 ml-2">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCollection;