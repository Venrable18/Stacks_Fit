import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface LightModeToggleProps {
  className?: string;
}

export const LightModeToggle: React.FC<LightModeToggleProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Settings Icon */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 45 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="p-3 glass-morphism rounded-xl hover:bg-white/10 transition-colors"
      >
        <Settings size={20} className="text-gray-300" />
      </motion.button>

      {/* Theme Toggle - Appears on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1/2 right-full mr-3 -translate-y-1/2 z-50"
          >
            <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-2xl min-w-[200px]">
              {/* Header with title */}
              <div className="flex items-center gap-2 mb-3">
                <Settings size={16} className="text-blue-400" />
                <span className="text-white text-sm font-semibold">Theme Settings</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
                    isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <motion.div
                    initial={false}
                    animate={{ 
                      x: isDarkMode ? -24 : -8,
                      opacity: 1
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {isDarkMode ? (
                      <Moon size={12} className="text-white ml-1" />
                    ) : (
                      <Sun size={12} className="text-gray-600 mr-1" />
                    )}
                  </motion.div>
                </button>
              </div>
              
              {/* Theme Preview */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400 mb-2">Preview:</div>
                <div className="flex gap-2">
                  <div 
                    className={`w-8 h-6 rounded border-2 cursor-pointer transition-all ${
                      isDarkMode ? 'bg-gray-900 border-blue-400' : 'bg-gray-900 border-gray-600'
                    }`}
                    onClick={() => !isDarkMode && toggleTheme()}
                  >
                    <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-sm"></div>
                  </div>
                  <div 
                    className={`w-8 h-6 rounded border-2 cursor-pointer transition-all ${
                      !isDarkMode ? 'bg-white border-blue-400' : 'bg-white border-gray-300'
                    }`}
                    onClick={() => isDarkMode && toggleTheme()}
                  >
                    <div className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LightModeToggle;