import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnhancedStacksStore } from '../store/enhancedStacksStore';
import { 
  Users, 
  UserPlus, 
  Trophy, 
  Target, 
  Calendar,
  Medal,
  Clock,
  Search,
  Send,
  Award,
  Zap
} from 'lucide-react';
import type { Friend, FriendChallenge } from '../store/stacksStore';

interface SocialFeaturesProps {
  className?: string;
}

export const SocialFeatures: React.FC<SocialFeaturesProps> = ({ 
  className = '' 
}) => {
  const { 
    addFriend, 
    removeFriend, 
    getUserFriends, 
    createFriendChallenge, 
    acceptFriendChallenge, 
    getFriendChallenges 
  } = useEnhancedStacksStore();
  
  const [activeTab, setActiveTab] = useState<'friends' | 'challenges'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<FriendChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  
  const [newFriendAddress, setNewFriendAddress] = useState('');
  const [newChallenge, setNewChallenge] = useState({
    friendAddress: '',
    challengeType: 'workout_streak' as 'workout_streak' | 'calorie_burn' | 'distance_run' | 'weight_goal',
    targetValue: 0,
    durationDays: 7,
    description: ''
  });

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    setIsLoading(true);
    try {
      const [friendsData, challengesData] = await Promise.all([
        getUserFriends(),
        getFriendChallenges()
      ]);
      setFriends(friendsData);
      setChallenges(challengesData);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendAddress.trim()) {
      alert('Please enter a wallet address!');
      return;
    }

    try {
      await addFriend(newFriendAddress);
      setNewFriendAddress('');
      setShowAddFriend(false);
      await loadSocialData();
      console.log('✅ Friend added successfully');
    } catch (error) {
      console.error('Failed to add friend:', error);
      alert('Failed to add friend. Please check the address and try again.');
    }
  };

  const handleRemoveFriend = async (friendAddress: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      await removeFriend(friendAddress);
      await loadSocialData();
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.friendAddress.trim()) {
      alert('Please select a friend!');
      return;
    }

    try {
      await createFriendChallenge(
        newChallenge.friendAddress,
        newChallenge.challengeType as 'steps' | 'calories' | 'workouts',
        newChallenge.targetValue,
        newChallenge.durationDays
      );
      setNewChallenge({
        friendAddress: '',
        challengeType: 'workout_streak',
        targetValue: 0,
        durationDays: 7,
        description: ''
      });
      setShowCreateChallenge(false);
      await loadSocialData();
      console.log('✅ Challenge created successfully');
    } catch (error) {
      console.error('Failed to create challenge:', error);
    }
  };

  const handleAcceptChallenge = async (challengeId: number) => {
    try {
      await acceptFriendChallenge(challengeId);
      await loadSocialData();
      console.log('✅ Challenge accepted');
    } catch (error) {
      console.error('Failed to accept challenge:', error);
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'workout_streak':
        return <Trophy className="w-5 h-5 text-orange-400" />;
      case 'calorie_burn':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'distance_run':
        return <Target className="w-5 h-5 text-blue-400" />;
      case 'weight_goal':
        return <Medal className="w-5 h-5 text-green-400" />;
      default:
        return <Trophy className="w-5 h-5 text-purple-400" />;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'workout_streak':
        return 'border-orange-500/30 bg-orange-500/10';
      case 'calorie_burn':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'distance_run':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'weight_goal':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-purple-500/30 bg-purple-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-morphism rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Social Fitness</h3>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
            Community
          </span>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-black/20 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'friends'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'challenges'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Challenges
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'friends' ? (
          <motion.div
            key="friends"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Your Fitness Buddies</h4>
              <button
                onClick={() => setShowAddFriend(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 
                  border border-blue-500/30 text-blue-300 rounded-lg transition-colors"
              >
                <UserPlus size={16} />
                Add Friend
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-blue-400"
                >
                  🔄
                </motion.div>
                <span className="ml-2 text-gray-400">Loading friends...</span>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No friends yet</p>
                <p className="text-sm text-gray-500">Add some fitness buddies to get motivated!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full 
                          flex items-center justify-center text-white font-semibold">
                          {friend.address.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {friend.address.slice(0, 8)}...{friend.address.slice(-4)}
                          </div>
                          <div className="text-sm text-gray-400">
                            Added {new Date(friend.addedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setNewChallenge(prev => ({ ...prev, friendAddress: friend.address }));
                            setShowCreateChallenge(true);
                          }}
                          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Challenge Friend"
                        >
                          <Trophy size={16} className="text-purple-400" />
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend.address)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Remove Friend"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">Fitness Challenges</h4>
              <button
                onClick={() => setShowCreateChallenge(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                  border border-purple-500/30 text-purple-300 rounded-lg transition-colors"
              >
                <Trophy size={16} />
                New Challenge
              </button>
            </div>

            {challenges.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No challenges yet</p>
                <p className="text-sm text-gray-500">Create a challenge to compete with friends!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.challengeId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-lg ${getChallengeColor(challenge.challengeType)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getChallengeIcon(challenge.challengeType)}
                        <div>
                          <h5 className="font-medium text-white">
                            {challenge.challengeType.replace('_', ' ').toUpperCase()}
                          </h5>
                          <p className="text-sm text-gray-400">
                            Challenge between {challenge.challenger.slice(0, 8)}... and {challenge.challenged.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          challenge.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {challenge.isActive ? 'Active' : 'Completed'}
                        </span>
                        {!challenge.isActive && (
                          <button
                            onClick={() => handleAcceptChallenge(challenge.challengeId)}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 
                              border border-green-500/30 text-green-300 rounded text-sm transition-colors"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-2 bg-black/20 rounded">
                        <Target className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                        <div className="text-gray-400">Target</div>
                        <div className="font-semibold text-white">{challenge.targetValue}</div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                        <div className="text-gray-400">Duration</div>
                        <div className="font-semibold text-white">
                          {Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <Calendar className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                        <div className="text-gray-400">Start Date</div>
                        <div className="font-semibold text-white">
                          {new Date(challenge.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <Award className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                        <div className="text-gray-400">Progress</div>
                        <div className="font-semibold text-white">
                          {Math.round((challenge.challengerProgress / challenge.targetValue) * 100)}%
                        </div>
                      </div>
                    </div>

                    {challenge.isActive && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Your Progress</span>
                          <span className="text-white">
                            {challenge.challengerProgress} / {challenge.targetValue}
                          </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((challenge.challengerProgress / challenge.targetValue) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddFriend(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">Add Fitness Buddy</h4>
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddFriend} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Wallet Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newFriendAddress}
                      onChange={(e) => setNewFriendAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white pr-10"
                      placeholder="SP1234...ABCD"
                      required
                    />
                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFriend(false)}
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
                    Add Friend
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showCreateChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreateChallenge(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">Create Challenge</h4>
                <button
                  onClick={() => setShowCreateChallenge(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Challenge Friend</label>
                  <select
                    value={newChallenge.friendAddress}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, friendAddress: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
                    required
                  >
                    <option value="">Select a friend</option>
                    {friends.map((friend) => (
                      <option key={friend.address} value={friend.address}>
                        {friend.address.slice(0, 8)}...{friend.address.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Challenge Type</label>
                  <select
                    value={newChallenge.challengeType}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, challengeType: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
                  >
                    <option value="workout_streak">Workout Streak</option>
                    <option value="calorie_burn">Calorie Burn</option>
                    <option value="distance_run">Distance Run</option>
                    <option value="weight_goal">Weight Goal</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Target Value</label>
                    <input
                      type="number"
                      value={newChallenge.targetValue}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={newChallenge.durationDays}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 7 }))}
                      className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white"
                      min="1"
                      max="365"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Description</label>
                  <textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white resize-none"
                    rows={3}
                    placeholder="Add a motivational message..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateChallenge(false)}
                    className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 
                      text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-500/20 
                      hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-lg transition-colors"
                  >
                    <Send size={16} />
                    Create Challenge
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SocialFeatures;