import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Trophy, Target, MessageCircle } from 'lucide-react';

const Social: React.FC = () => {
  const [activeTab, setActiveTab] = useState('friends');

  const friends = [
    { id: 1, name: 'Alex Chen', steps: 12500, status: 'online', avatar: '👨‍💻' },
    { id: 2, name: 'Sarah Kim', steps: 9800, status: 'offline', avatar: '👩‍🏃' },
    { id: 3, name: 'Mike Johnson', steps: 15200, status: 'online', avatar: '🏃‍♂️' },
  ];

  const challenges = [
    { 
      id: 1, 
      name: 'Weekly Step Challenge', 
      participants: 8, 
      endDate: '2024-01-20',
      progress: 75,
      reward: '100 STX'
    },
    { 
      id: 2, 
      name: 'Cardio Kings', 
      participants: 12, 
      endDate: '2024-01-25',
      progress: 60,
      reward: 'Exclusive NFT'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'You', score: 15420, trend: '+5%' },
    { rank: 2, name: 'Mike Johnson', score: 15200, trend: '+3%' },
    { rank: 3, name: 'Alex Chen', score: 12500, trend: '+8%' },
    { rank: 4, name: 'Sarah Kim', score: 9800, trend: '-2%' },
  ];

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Social Hub</h2>
          <p className="text-gray-400">Connect with friends and join challenges</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white font-semibold hover:shadow-lg transition-all duration-300">
          <UserPlus size={20} />
          <span>Add Friend</span>
        </button>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-black/20 rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'friends' && <FriendsTab friends={friends} />}
          {activeTab === 'challenges' && <ChallengesTab challenges={challenges} />}
          {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={leaderboard} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FriendsTab: React.FC<{ friends: any[] }> = ({ friends }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-morphism rounded-2xl p-6 card-hover"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                  {friend.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${
                  friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{friend.name}</h3>
                <p className="text-gray-400 text-sm capitalize">{friend.status}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-2xl font-bold text-blue-400">{friend.steps.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Steps today</div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors">
                <Target size={16} />
                <span className="text-sm">Challenge</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors">
                <MessageCircle size={16} />
                <span className="text-sm">Message</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ChallengesTab: React.FC<{ challenges: any[] }> = ({ challenges }) => {
  return (
    <div className="space-y-6">
      {challenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-morphism rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{challenge.name}</h3>
              <p className="text-gray-400">{challenge.participants} participants • Ends {challenge.endDate}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-400">{challenge.reward}</div>
              <div className="text-gray-400 text-sm">Reward</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Progress</span>
              <span className="text-blue-400 font-semibold">{challenge.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300">
              View Details
            </button>
            <button className="px-6 py-3 border border-white/20 rounded-xl text-gray-300 hover:bg-white/5 transition-colors">
              Share
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const LeaderboardTab: React.FC<{ leaderboard: any[] }> = ({ leaderboard }) => {
  return (
    <div className="glass-morphism rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-semibold text-white">Weekly Leaderboard</h3>
        <p className="text-gray-400">Top performers this week</p>
      </div>
      
      <div className="divide-y divide-white/10">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 flex items-center justify-between hover:bg-white/5 transition-colors ${
              entry.name === 'You' ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                entry.rank === 1 ? 'bg-yellow-500 text-black' :
                entry.rank === 2 ? 'bg-gray-400 text-black' :
                entry.rank === 3 ? 'bg-orange-500 text-black' :
                'bg-gray-700 text-white'
              }`}>
                {entry.rank}
              </div>
              <div>
                <div className={`font-semibold ${entry.name === 'You' ? 'text-blue-400' : 'text-white'}`}>
                  {entry.name}
                </div>
                <div className="text-gray-400 text-sm">{entry.score.toLocaleString()} points</div>
              </div>
            </div>
            
            <div className={`text-sm font-medium ${
              entry.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
            }`}>
              {entry.trend}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Social;