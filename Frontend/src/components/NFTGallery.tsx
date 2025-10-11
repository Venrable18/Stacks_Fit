import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnhancedStacksStore } from '../store/enhancedStacksStore';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  Gift,
  Send,
  Copy,
  ExternalLink,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  Zap
} from 'lucide-react';
import type { NFTAsset } from '../store/stacksStore';

interface NFTGalleryProps {
  className?: string;
}

interface NFTCollection {
  achievements: NFTAsset[];
  badges: NFTAsset[];
  rewards: NFTAsset[];
}

export const NFTGallery: React.FC<NFTGalleryProps> = ({ 
  className = '' 
}) => {
  const { 
    getUserNFTs, 
    transferNFT, 
    mintAchievementNFT
  } = useEnhancedStacksStore();
  
  const [nftCollection, setNftCollection] = useState<NFTCollection>({
    achievements: [],
    badges: [],
    rewards: []
  });
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'rewards'>('achievements');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRarity, setFilterRarity] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [selectedNFT, setSelectedNFT] = useState<NFTAsset | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);

  useEffect(() => {
    loadNFTCollection();
  }, []);

  const loadNFTCollection = async () => {
    setIsLoading(true);
    try {
      const nfts = await getUserNFTs();
      
      // Categorize NFTs
      setNftCollection({
        achievements: nfts.filter((nft: NFTAsset) => nft.achievement?.includes('Achievement') || nft.name.includes('Achievement')),
        badges: nfts.filter((nft: NFTAsset) => nft.achievement?.includes('Badge') || nft.name.includes('Badge')),
        rewards: nfts.filter((nft: NFTAsset) => !nft.achievement?.includes('Achievement') && !nft.achievement?.includes('Badge'))
      });
    } catch (error) {
      console.error('Failed to load NFT collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNFT || !transferAddress.trim()) {
      alert('Please enter a valid address!');
      return;
    }

    try {
      await transferNFT(selectedNFT.id, transferAddress);
      setShowTransferModal(false);
      setTransferAddress('');
      setSelectedNFT(null);
      await loadNFTCollection();
      console.log('✅ NFT transferred successfully');
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      alert('Failed to transfer NFT. Please try again.');
    }
  };

  const handleMintAchievement = async (achievementTypeId: number) => {
    try {
      setIsLoading(true);
      await mintAchievementNFT(achievementTypeId);
      await loadNFTCollection();
      setShowMintModal(false);
      console.log('✅ Achievement NFT minted successfully');
    } catch (error) {
      console.error('Failed to mint achievement NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'border-gray-500/50 bg-gray-500/10';
      case 'rare':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'epic':
        return 'border-purple-500/50 bg-purple-500/10';
      case 'legendary':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-green-500/50 bg-green-500/10';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 'rare':
        return <Star className="w-4 h-4 text-blue-400" />;
      case 'epic':
        return <Crown className="w-4 h-4 text-purple-400" />;
      case 'legendary':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      default:
        return <Trophy className="w-4 h-4 text-green-400" />;
    }
  };

  const getCurrentCollection = () => {
    const collection = nftCollection[activeTab];
    if (filterRarity === 'all') return collection;
    return collection.filter(nft => nft.achievement?.toLowerCase().includes(filterRarity));
  };

  const NFTCard = ({ nft }: { nft: NFTAsset }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${getRarityColor(nft.achievement)}`}
      onClick={() => setSelectedNFT(nft)}
    >
      {/* NFT Image */}
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
        {nft.image ? (
          <img 
            src={nft.image} 
            alt={nft.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {nft.achievement?.includes('Streak') ? '🔥' : 
             nft.achievement?.includes('Workout') ? '💪' :
             nft.achievement?.includes('Nutrition') ? '🥗' :
             nft.achievement?.includes('Social') ? '👥' : '🏆'}
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white truncate">{nft.name}</h4>
          {getRarityIcon(nft.achievement)}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{nft.achievement}</p>
        <div className="text-xs text-purple-400">#{nft.id}</div>
      </div>

      {/* Rarity Badge */}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 text-xs rounded-full ${getRarityColor(nft.achievement)} border`}>
          {nft.achievement?.split(' ')[0] || 'Fitness'}
        </span>
      </div>
    </motion.div>
  );

  const NFTListItem = ({ nft }: { nft: NFTAsset }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
      onClick={() => setSelectedNFT(nft)}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex-shrink-0">
        {nft.image ? (
          <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {nft.achievement?.includes('Streak') ? '🔥' : '🏆'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white truncate">{nft.name}</h4>
        <p className="text-sm text-gray-400 truncate">{nft.achievement}</p>
        <div className="text-xs text-purple-400">#{nft.id}</div>
      </div>
      <div className="flex items-center gap-2">
        {getRarityIcon(nft.achievement)}
        <span className={`px-2 py-1 text-xs rounded-full ${getRarityColor(nft.achievement)} border`}>
          {nft.achievement?.split(' ')[0] || 'Fitness'}
        </span>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">NFT Collection</h3>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
            Blockchain Assets
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={16} />
            </button>
          </div>

          {/* Mint Achievement Button */}
          <button
            onClick={() => setShowMintModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 
              border border-green-500/30 text-green-300 rounded-lg transition-colors"
          >
            <Zap size={16} />
            Mint NFT
          </button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex items-center justify-between">
        {/* Category Tabs */}
        <div className="flex bg-black/20 rounded-lg p-1">
          {[
            { id: 'achievements', label: 'Achievements', count: nftCollection.achievements.length },
            { id: 'badges', label: 'Badges', count: nftCollection.badges.length },
            { id: 'rewards', label: 'Rewards', count: nftCollection.rewards.length }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value as any)}
            className="px-3 py-1 bg-black/20 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
      </div>

      {/* Collection Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-purple-400"
          >
            🔄
          </motion.div>
          <span className="ml-2 text-gray-400">Loading collection...</span>
        </div>
      ) : getCurrentCollection().length === 0 ? (
        <div className="text-center py-12">
          <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400">No NFTs in this category yet</p>
          <p className="text-sm text-gray-500">Complete achievements to earn NFTs!</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {getCurrentCollection().map((nft) => (
            viewMode === 'grid' ? (
              <NFTCard key={nft.id} nft={nft} />
            ) : (
              <NFTListItem key={nft.id} nft={nft} />
            )
          ))}
        </div>
      )}

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">NFT Details</h4>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* NFT Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  {selectedNFT.image ? (
                    <img 
                      src={selectedNFT.image} 
                      alt={selectedNFT.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {selectedNFT.achievement?.includes('Streak') ? '🔥' : '🏆'}
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="space-y-4">
                  <div>
                    <h5 className="text-lg font-semibold text-white">{selectedNFT.name}</h5>
                    <p className="text-gray-400">{selectedNFT.achievement}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <span className="text-gray-400">Token ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white">#{selectedNFT.id}</span>
                      <button
                        onClick={() => copyToClipboard(selectedNFT.id.toString())}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 
                        hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-colors"
                    >
                      <Send size={16} />
                      Transfer
                    </button>
                    <button
                      onClick={() => window.open(`https://explorer.stacks.co/txid/nft-${selectedNFT.id}`, '_blank')}
                      className="flex items-center justify-center px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 
                        border border-purple-500/30 text-purple-300 rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowTransferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">Transfer NFT</h4>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleTransferNFT} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
                    placeholder="SP1234...ABCD"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 
                      text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 
                      text-blue-300 rounded-lg transition-colors"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mint Achievement Modal */}
      <AnimatePresence>
        {showMintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowMintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">Mint Achievement NFT</h4>
                <button
                  onClick={() => setShowMintModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-400">
                  Mint an NFT for one of your completed achievements. This will create a permanent blockchain record of your fitness milestone.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {[1, 2, 3].map((achievementId) => (
                    <button
                      key={achievementId}
                      onClick={() => handleMintAchievement(achievementId)}
                      disabled={isLoading}
                      className="p-4 text-left bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 
                        rounded-lg transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <div className="font-medium text-white">Achievement #{achievementId}</div>
                          <div className="text-sm text-gray-400">Ready to mint as NFT</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowMintModal(false)}
                  className="w-full px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 
                    text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NFTGallery;