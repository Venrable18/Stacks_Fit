import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEnhancedStacksStore } from '../store/enhancedStacksStore';
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  Flame,
  Users,
  Clock,
  Zap,
  Heart,
  Trophy
} from 'lucide-react';
import type { DailyProgress, UserStreak } from '../store/stacksStore';

interface AnalyticsDashboardProps {
  className?: string;
}

interface WeeklyStats {
  totalSteps: number;
  totalCalories: number;
  totalActiveTime: number;
  averageSteps: number;
  averageCalories: number;
  averageActiveTime: number;
  workoutCount: number;
  goalAchievementRate: number;
}

interface LeaderboardEntry {
  address: string;
  streak: number;
  nickname?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  className = '' 
}) => {
  const { 
    getProgressHistory, 
    getWeeklyStats, 
    getUserStreak, 
    getStreakLeaderboard 
  } = useEnhancedStacksStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'streaks' | 'leaderboard'>('overview');
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [userStreak, setUserStreak] = useState<UserStreak | null>(null);
  const [progressHistory, setProgressHistory] = useState<DailyProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - (parseInt(timeRange) * 24 * 60 * 60 * 1000))
        .toISOString().split('T')[0];

      const [weeklyStatsData, streakData, progressData, leaderboardData] = await Promise.all([
        getWeeklyStats(),
        getUserStreak(),
        getProgressHistory(startDate, endDate),
        getStreakLeaderboard()
      ]);

      setWeeklyStats({
        ...weeklyStatsData,
        workoutCount: 12, // Mock data
        goalAchievementRate: 85 // Mock data
      });
      setUserStreak(streakData);
      setProgressHistory(progressData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 7 Days';
    }
  };

  const StatCard = ({ icon, title, value, change, color }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 glass-morphism rounded-xl border ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('/30', '/20')}`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );

  const ProgressChart = ({ data }: { data: DailyProgress[] }) => {
    const maxSteps = Math.max(...data.map(d => d.steps || 0), 1);
    
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Daily Steps Progress</h4>
        <div className="flex items-end justify-between h-40 gap-2">
          {data.map((day, index) => (
            <div key={day.date} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${((day.steps || 0) / maxSteps) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t min-h-[4px]"
                title={`${day.steps || 0} steps`}
              />
              <span className="text-xs text-gray-400 mt-2">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StreakDisplay = ({ streak }: { streak: UserStreak }) => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white">Fitness Streaks</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-orange-400 font-medium">Current Streak</span>
          </div>
          <div className="text-3xl font-bold text-white">{streak.currentStreak}</div>
          <div className="text-sm text-gray-400">days in a row</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Best Streak</span>
          </div>
          <div className="text-3xl font-bold text-white">{streak.longestStreak}</div>
          <div className="text-sm text-gray-400">personal record</div>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        Last active: {new Date(streak.lastActiveDate).toLocaleDateString()}
      </div>
    </div>
  );

  const LeaderboardList = ({ data }: { data: LeaderboardEntry[] }) => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-white">Streak Leaderboard</h4>
      <div className="space-y-3">
        {data.map((entry, index) => (
          <motion.div
            key={entry.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg ${
              index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
              index === 1 ? 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border border-gray-400/30' :
              index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-600/30' :
              'bg-white/5 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-500 text-black' :
                index === 1 ? 'bg-gray-400 text-black' :
                index === 2 ? 'bg-orange-600 text-white' :
                'bg-purple-500 text-white'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-white">
                  {entry.nickname || `${entry.address.slice(0, 8)}...${entry.address.slice(-4)}`}
                </div>
                <div className="text-xs text-gray-400">{entry.address.slice(0, 12)}...</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-bold text-white">{entry.streak}</span>
              <span className="text-sm text-gray-400">days</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Analytics Dashboard</h3>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
            Data Insights
          </span>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-black/20 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === range
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/20 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'progress', label: 'Progress', icon: Activity },
          { id: 'streaks', label: 'Streaks', icon: Flame },
          { id: 'leaderboard', label: 'Leaderboard', icon: Users }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-purple-400"
          >
            🔄
          </motion.div>
          <span className="ml-2 text-gray-400">Loading analytics...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'overview' && weeklyStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-white">{getTimeRangeLabel()} Overview</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<Activity className="w-5 h-5 text-blue-400" />}
                  title="Total Steps"
                  value={formatNumber(weeklyStats.totalSteps)}
                  change="+12.5%"
                  color="border-blue-500/30"
                />
                <StatCard
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                  title="Calories Burned"
                  value={formatNumber(weeklyStats.totalCalories)}
                  change="+8.3%"
                  color="border-yellow-500/30"
                />
                <StatCard
                  icon={<Clock className="w-5 h-5 text-green-400" />}
                  title="Active Time"
                  value={`${Math.round(weeklyStats.totalActiveTime / 60)}h`}
                  change="+15.2%"
                  color="border-green-500/30"
                />
                <StatCard
                  icon={<Heart className="w-5 h-5 text-red-400" />}
                  title="Workouts"
                  value={weeklyStats.workoutCount}
                  change="+3"
                  color="border-red-500/30"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-morphism rounded-xl p-6">
                  <h5 className="text-lg font-medium text-white mb-4">Daily Averages</h5>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Steps</span>
                      <span className="text-white font-semibold">{formatNumber(weeklyStats.averageSteps)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Calories</span>
                      <span className="text-white font-semibold">{formatNumber(weeklyStats.averageCalories)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Time</span>
                      <span className="text-white font-semibold">{Math.round(weeklyStats.averageActiveTime / 60)}h</span>
                    </div>
                  </div>
                </div>

                <div className="glass-morphism rounded-xl p-6">
                  <h5 className="text-lg font-medium text-white mb-4">Goal Achievement</h5>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {Math.round(weeklyStats.goalAchievementRate)}%
                    </div>
                    <div className="text-gray-400 mb-4">Goals Achieved</div>
                    <div className="w-full bg-black/20 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${weeklyStats.goalAchievementRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-morphism rounded-xl p-6"
            >
              <ProgressChart data={progressHistory} />
            </motion.div>
          )}

          {activeTab === 'streaks' && userStreak && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-morphism rounded-xl p-6"
            >
              <StreakDisplay streak={userStreak} />
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-morphism rounded-xl p-6"
            >
              <LeaderboardList data={leaderboard} />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsDashboard;