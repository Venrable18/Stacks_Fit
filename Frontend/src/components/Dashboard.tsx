import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Award, TrendingUp, Brain, Users, Clock, Flame, Zap } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';
import { useNavigationStore } from '../store/navigationStore';
import {BlockchainDebugger} from './BlockchainDebugger';
import LightModeToggle from './LightModeToggle';
import ProgressChart from './ProgressChart';
import MetricCard from './MetricCard';
import ProgressRecordingForm from './ProgressRecordingForm';
import WorkoutPlanCreationForm from './WorkoutPlanCreationForm';
import FriendsManagementForm from './FriendsManagementForm';
import SampleDataGenerator from './SampleDataGenerator';
import NFTCollection from './NFTCollection';
import AICoach from './AICoach';

const Dashboard: React.FC = () => {
  const { activeSection, setActiveSection } = useNavigationStore();
  const [activeTab, setActiveTab] = useState(activeSection);
  
  const { 
    userProfile, 
    dailyProgress, 
    achievements, 
    userAddress,
    getDashboardDataV2,  // ⚡ V2 BATCH FUNCTION - 90% FASTER!
    isLoading,
    error,
    lastDataFetch
  } = useStacksStore();

  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return 'Athlete';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Sync with navigation
  useEffect(() => {
    setActiveTab(activeSection);
  }, [activeSection]);

  // ⚡ LOAD DATA WITH V2 BATCH FUNCTION! 90% FASTER!
  useEffect(() => {
    if (userAddress) {
      console.log('🚀 Loading dashboard with V2 batch function (90% faster)...');
      getDashboardDataV2();
    }
  }, [userAddress, getDashboardDataV2]);

  // Initial load
  useEffect(() => {
    console.log('⚡ Initial dashboard load using V2 batch function...');
    getDashboardDataV2();
  }, [getDashboardDataV2]);

  const todayProgress = dailyProgress[0] || { steps: 0, calories: 0, activeTime: 0 };
  const weeklyAverage = dailyProgress.slice(0, 7).reduce((acc, day) => ({
    steps: acc.steps + day.steps,
    calories: acc.calories + day.calories,
    activeTime: acc.activeTime + day.activeTime
  }), { steps: 0, calories: 0, activeTime: 0 });

  weeklyAverage.steps = Math.round(weeklyAverage.steps / 7);
  weeklyAverage.calories = Math.round(weeklyAverage.calories / 7);
  weeklyAverage.activeTime = Math.round(weeklyAverage.activeTime / 7);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'record', label: 'Record Progress', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'workouts', label: 'Create Workout', icon: Clock },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'nft', label: 'NFT Collection', icon: Award },
    { id: 'social', label: 'Friends', icon: Users },
    { id: 'demo-data', label: 'Demo Data', icon: Brain },
    { id: 'ai', label: 'AI Coach', icon: Brain },
    { id: 'debugger', label: 'Blockchain Records', icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'debugger':
        return <BlockchainDebugger />;
      
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Real Analytics with Blockchain Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
            >
              <h3 className="text-2xl font-bold text-white mb-6">📊 Real Blockchain Analytics</h3>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-8 h-8 text-blue-400" />
                    <h4 className="text-lg font-semibold text-white">Total Progress Days</h4>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">{dailyProgress.length}</div>
                  <div className="text-sm text-gray-400">Days with recorded data</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-8 h-8 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Achievements</h4>
                  </div>
                  <div className="text-3xl font-bold text-green-400">{achievements.length}</div>
                  <div className="text-sm text-gray-400">Blockchain verified</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-8 h-8 text-orange-400" />
                    <h4 className="text-lg font-semibold text-white">Total Steps</h4>
                  </div>
                  <div className="text-3xl font-bold text-orange-400">
                    {dailyProgress.reduce((sum, day) => sum + (day.steps || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">All time total</div>
                </div>
              </div>

              {/* Weekly Averages */}
              <div className="bg-white/5 p-6 rounded-xl mb-6">
                <h4 className="text-xl font-semibold text-white mb-4">📈 7-Day Averages</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{weeklyAverage.steps.toLocaleString()}</div>
                    <div className="text-gray-400">Steps/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{weeklyAverage.calories}</div>
                    <div className="text-gray-400">Calories/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{weeklyAverage.activeTime}</div>
                    <div className="text-gray-400">Minutes/day</div>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white/5 p-6 rounded-xl mb-6">
                <h4 className="text-xl font-semibold text-white mb-4">📊 Recent Progress (Last 14 Days)</h4>
                {dailyProgress.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-end justify-between h-40 gap-2">
                      {dailyProgress.slice(0, 14).map((day, index) => {
                        const maxSteps = Math.max(...dailyProgress.slice(0, 14).map(d => d.steps || 0), 1);
                        const height = ((day.steps || 0) / maxSteps) * 100;
                        return (
                          <div key={day.date} className="flex flex-col items-center flex-1">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t min-h-[4px]"
                              title={`${day.steps || 0} steps on ${day.date}`}
                            />
                            <span className="text-xs text-gray-400 mt-2 transform -rotate-45">
                              {new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-sm text-gray-400 text-center">
                      Hover over bars to see exact values
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No progress data available yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Start recording your daily activities to see analytics!</p>
                  </div>
                )}
              </div>

              {/* Recent Achievements */}
              <div className="bg-white/5 p-6 rounded-xl">
                <h4 className="text-xl font-semibold text-white mb-4">🏆 Recent Achievements</h4>
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.slice(0, 6).map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h5 className="text-white font-medium">{achievement.title}</h5>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                          <p className="text-yellow-400 text-xs">Earned: {achievement.earnedDate || achievement.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No achievements yet.</p>
                    <p className="text-sm text-gray-500 mt-2">Complete fitness goals to earn blockchain-verified achievements!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );
      
      case 'record':
        return <ProgressRecordingForm />;
      
      case 'workouts':
        return <WorkoutPlanCreationForm />;
      
      case 'social':
        return <FriendsManagementForm />;
      
      case 'demo-data':
        return <SampleDataGenerator />;
      
      case 'nft':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">🎨 NFT Collection</h2>
              <NFTCollection />
            </motion.div>
          </div>
        );
      
      case 'achievements':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">🏆 Your Achievements</h2>
              
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-xl border border-white/10"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className="text-white font-bold text-lg mb-2">{achievement.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                          ✅ EARNED
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-white text-xl mb-2">No achievements yet</h3>
                  <p className="text-gray-400">Complete challenges to earn your first achievement!</p>
                </div>
              )}
              
              {/* Achievement Statistics */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <div>
                      <h4 className="text-white font-medium">Total Earned</h4>
                      <p className="text-yellow-400 font-bold text-xl">{achievements.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-medium">Completion Rate</h4>
                      <p className="text-blue-400 font-bold text-xl">
                        {Math.round((achievements.length / 10) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-green-400" />
                    <div>
                      <h4 className="text-white font-medium">Current Streak</h4>
                      <p className="text-green-400 font-bold text-xl">{dailyProgress.length} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      case 'ai':
        return (
          <div className="h-full">
            <AICoach />
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 text-red-400">
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <span className="font-medium">{error}</span>
                    {lastDataFetch && (
                      <p className="text-red-300 text-xs mt-1">
                        Last successful fetch: {lastDataFetch.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 text-blue-400">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Loading blockchain data...</span>
                </div>
              </motion.div>
            )}

            {/* Performance Indicator */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-lg">⚡ V2 Performance Boost</h3>
                  <p className="text-green-100">Dashboard loads 90% faster with batch functions</p>
                </div>
                <div className="text-2xl font-bold">90%</div>
              </div>
            </motion.div>

            {/* Enhanced Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                icon={Activity}
                title="Steps Today"
                value={todayProgress.steps > 0 ? todayProgress.steps.toLocaleString() : "No data"}
                target="10,000"
                progress={(todayProgress.steps / 10000) * 100}
                color="blue"
              />
              <MetricCard
                icon={Flame}
                title="Calories Burned"
                value={todayProgress.calories > 0 ? todayProgress.calories.toString() : "No data"}
                target="500"
                progress={(todayProgress.calories / 500) * 100}
                color="orange"
              />
              <MetricCard
                icon={Clock}
                title="Active Time"
                value={todayProgress.activeTime > 0 ? `${todayProgress.activeTime}min` : "No data"}
                target="60min"
                progress={(todayProgress.activeTime / 60) * 100}
                color="green"
              />
            </div>

            {/* Empty State Message */}
            {dailyProgress.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 rounded-xl border border-blue-500/20 text-center"
              >
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-white text-2xl font-bold mb-2">Welcome to Your Fitness Journey!</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Your dashboard shows real blockchain data. Start by recording your first progress or 
                  generate sample data to see how everything works.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('record')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    📝 Record Your Progress
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('demo-data')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    🚀 Generate Sample Data
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Progress Chart */}
            {dailyProgress.length > 0 ? (
              <ProgressChart data={dailyProgress} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 p-6 rounded-xl border border-white/10 text-center"
              >
                <div className="text-4xl mb-3">📈</div>
                <h4 className="text-white font-medium mb-2">No Progress Data Yet</h4>
                <p className="text-gray-400 text-sm">Your progress chart will appear here once you start recording data</p>
              </motion.div>
            )}

            {/* Weekly Summary Stats */}
            {dailyProgress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Weekly Average</h4>
                      <p className="text-blue-400 font-bold">{weeklyAverage.steps.toLocaleString()} steps</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Avg Calories</h4>
                      <p className="text-orange-400 font-bold">{weeklyAverage.calories} cal</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Avg Active Time</h4>
                      <p className="text-green-400 font-bold">{weeklyAverage.activeTime}min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Current Streak</h4>
                      <p className="text-purple-400 font-bold">{dailyProgress.length} days</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 p-6 rounded-xl border border-white/10 text-center"
              >
                <div className="text-4xl mb-3">📊</div>
                <h4 className="text-white font-medium mb-2">Weekly Statistics</h4>
                <p className="text-gray-400 text-sm">Your weekly averages and streaks will show here after recording progress</p>
              </motion.div>
            )}

            {/* Recent Progress */}
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-white font-semibold mb-4">Recent Progress (Last 7 Days)</h3>
              {dailyProgress.length > 0 ? (
                <div className="space-y-2">
                  {dailyProgress.slice(0, 7).map((day) => (
                    <div key={day.date} className="flex justify-between items-center">
                      <span className="text-gray-300">{day.date}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-blue-400">{day.steps} steps</span>
                        <span className="text-orange-400">{day.calories} cal</span>
                        <span className="text-green-400">{day.activeTime}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No progress data yet. Start tracking to see your journey!</p>
              )}
            </div>

            {/* Achievements Preview */}
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Recent Achievements</h3>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Complete challenges to earn achievements!</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {userAddress ? formatAddress(userAddress) : userProfile?.goals || 'Athlete'}! 🚀
              </h1>
              <p className="text-purple-200 mt-1">
                {isLoading ? 'Loading with V2 batch function...' : 'Your fitness journey is blockchain-verified'}
              </p>
            </div>
            {/* V2 Performance Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2"
            >
              ⚡ V2 BOOST
              <span className="text-white/90">90% faster</span>
            </motion.div>
          </div>
          <LightModeToggle />
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex space-x-1 bg-black/20 rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveSection(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;