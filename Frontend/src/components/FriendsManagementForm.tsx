import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Trophy, 
  Target,
  Loader,
  Check,
  X
} from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

interface FriendRequest {
  address: string;
  displayName?: string;
  isValid: boolean;
}

export const FriendsManagementForm: React.FC = () => {
  const { addFriend, isTransactionPending, userAddress } = useStacksStore();
  const [friendAddress, setFriendAddress] = useState('');
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Mock data for demonstration
  const currentFriends = [
    { address: 'SP1ABCD...XYZ', displayName: 'FitFriend123', streak: 15, lastActive: '2 hours ago' },
    { address: 'SP2EFGH...ABC', displayName: 'GymBuddy', streak: 8, lastActive: '1 day ago' },
    { address: 'SP3IJKL...DEF', displayName: 'RunnerPro', streak: 22, lastActive: '3 hours ago' },
  ];

  const validateStacksAddress = (address: string): boolean => {
    // Basic Stacks address validation (starts with SP or ST, followed by 39 characters)
    const stacksAddressRegex = /^S[PT][0-9A-HJKMNP-Z]{39}$/;
    return stacksAddressRegex.test(address);
  };

  const handleAddressChange = async (address: string) => {
    setFriendAddress(address);
    setErrors({});

    if (address.length > 10) { // Start validation when enough characters are entered
      setIsValidating(true);
      
      // Simulate address validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isValid = validateStacksAddress(address);
      
      if (!isValid && address.length >= 41) {
        setErrors({ address: 'Invalid Stacks address format' });
      }
      
      setIsValidating(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateStacksAddress(friendAddress)) {
      setErrors({ address: 'Please enter a valid Stacks address' });
      return;
    }

    if (friendAddress === userAddress) {
      setErrors({ address: 'You cannot add yourself as a friend' });
      return;
    }

    setIsSubmitting(true);

    try {
      await addFriend(friendAddress);
      console.log('✅ Friend request sent successfully!');
      
      // Add to pending requests
      setPendingRequests(prev => [...prev, {
        address: friendAddress,
        displayName: `User-${friendAddress.slice(0, 8)}`,
        isValid: true
      }]);
      
      // Reset form
      setFriendAddress('');
      setErrors({});
      
    } catch (error) {
      console.error('❌ Failed to add friend:', error);
      setErrors({ address: 'Failed to send friend request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (!userAddress) {
    return (
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-center">
        <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Connect Wallet Required</h3>
        <p className="text-gray-300">Please connect your Stacks wallet to manage friends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Friend Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Add Friend</h2>
        </div>

        <form onSubmit={handleAddFriend} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Friend's Stacks Address</label>
            <div className="relative">
              <input
                type="text"
                value={friendAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none pr-10"
                placeholder="SP1ABC...XYZ (Stacks address)"
                maxLength={41}
              />
              {isValidating && (
                <div className="absolute right-3 top-3">
                  <Loader className="w-5 h-5 text-yellow-400 animate-spin" />
                </div>
              )}
              {!isValidating && friendAddress.length >= 41 && (
                <div className="absolute right-3 top-3">
                  {validateStacksAddress(friendAddress) ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
            <p className="text-gray-400 text-sm mt-1">
              Enter a valid Stacks address (starts with SP or ST)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isTransactionPending || !validateStacksAddress(friendAddress)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting || isTransactionPending ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending Friend Request...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Send Friend Request on Blockchain
              </>
            )}
          </button>
        </form>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-1">🤝 How it works</h4>
          <p className="text-gray-300 text-sm">
            Friend requests are recorded on the Stacks blockchain, creating permanent and verifiable connections.
          </p>
        </div>
      </motion.div>

      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Pending Requests</h3>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{request.displayName}</p>
                  <p className="text-gray-400 text-sm">{formatAddress(request.address)}</p>
                </div>
                <div className="text-yellow-400 text-sm">Pending...</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Current Friends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Your Fitness Friends ({currentFriends.length})</h3>
        </div>

        {currentFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFriends.map((friend, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{friend.displayName}</h4>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm">{friend.streak}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{formatAddress(friend.address)}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">Active {friend.lastActive}</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors">
                      <Target className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h4 className="text-white text-lg mb-2">No friends yet</h4>
            <p className="text-gray-400">Add your first fitness friend to start building your network!</p>
          </div>
        )}
      </motion.div>

      {/* Friend Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
      >
        <h3 className="text-lg font-semibold text-white mb-4">🤝 Friendship Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-white font-medium mb-1">Compete</h4>
            <p className="text-gray-400 text-sm">Challenge friends to fitness competitions</p>
          </div>
          
          <div className="text-center p-4">
            <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h4 className="text-white font-medium mb-1">Share Goals</h4>
            <p className="text-gray-400 text-sm">Share workout plans and progress</p>
          </div>
          
          <div className="text-center p-4">
            <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h4 className="text-white font-medium mb-1">Motivate</h4>
            <p className="text-gray-400 text-sm">Send encouragement and celebrate wins</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FriendsManagementForm;