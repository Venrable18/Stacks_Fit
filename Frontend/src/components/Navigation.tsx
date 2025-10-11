import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Activity, 
  Trophy, 
  Users, 
  Brain, 
  Award,
  Settings,
  LogOut,
  Search,
  Bug
} from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';
import { useNavigationStore } from '../store/navigationStore';
import { useThemeStore } from '../store/themeStore';

const Navigation: React.FC = () => {
  const { userAddress, disconnectWallet } = useStacksStore();
  const { isDarkMode } = useThemeStore();
  const { activeSection, setActiveSection } = useNavigationStore();

  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'overview' },
    { icon: Activity, label: 'Progress', id: 'record' },
    { icon: Trophy, label: 'Achievements', id: 'achievements' },
    { icon: Brain, label: 'AI Coach', id: 'ai' },
    { icon: Award, label: 'NFT Collection', id: 'nft' },
    { icon: Users, label: 'Social', id: 'social' },
    { icon: Search, label: 'Blockchain Records', id: 'analytics' },
    { icon: Bug, label: 'Blockchain Debugger', id: 'debugger' },
  ];

  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-80 backdrop-blur-xl border-r flex flex-col ${
        isDarkMode 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}
    >
      {/* Logo */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🏃</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StacksFit
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Blockchain Fitness
            </p>
          </div>
        </motion.div>
      </div>

      {/* User Profile */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-6 border-b border-white/10"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
            💪
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Fitness Warrior</h3>
            <p className="text-gray-400 text-xs truncate">
              {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Loading...'}
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">7</div>
            <div className="text-xs text-gray-400">Streak</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">12</div>
            <div className="text-xs text-gray-400">NFTs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">85</div>
            <div className="text-xs text-gray-400">Level</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => {
                  console.log('🎯 Sidebar clicked:', item.id, 'Label:', item.label);
                  setActiveSection(item.id);
                }}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? `${isDarkMode ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-600 border border-blue-200'}`
                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <Icon size={20} className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-6 border-t border-white/10 space-y-2"
      >
        <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        
        {/* User Address Display */}
        <div className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs text-gray-400 mb-1">Connected Wallet</div>
          <div className="text-xs font-mono text-green-400 truncate">
            {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-4)}` : 'Not connected'}
          </div>
        </div>
        
        <button 
          onClick={disconnectWallet}
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-red-300 hover:text-red-400 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Disconnect Wallet</span>
        </button>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-50" />
      <div className="absolute top-32 right-8 w-1 h-1 bg-purple-500 rounded-full animate-pulse opacity-30" />
      <div className="absolute bottom-32 right-6 w-3 h-3 bg-green-500 rounded-full animate-pulse opacity-40" />
    </motion.nav>
  );
};

export default Navigation;