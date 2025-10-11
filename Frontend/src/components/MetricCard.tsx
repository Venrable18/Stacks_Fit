import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  target: string;
  progress: number;
  color: 'blue' | 'orange' | 'red' | 'cyan' | 'green' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  target,
  progress,
  color
}) => {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  const textColorMap = {
    blue: 'text-blue-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  };

  const progressClamped = Math.min(Math.max(progress, 0), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="metric-card card-hover relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorMap[color]} opacity-10`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]}`}>
            <Icon size={24} className="text-white" />
          </div>
          <span className="text-2xl">
            {progressClamped >= 100 ? '🎉' : progressClamped >= 80 ? '🔥' : '💪'}
          </span>
        </div>

        <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
        
        <div className="flex items-baseline space-x-2 mb-3">
          <span className={`text-3xl font-bold ${textColorMap[color]}`}>
            {value}
          </span>
          <span className="text-gray-500 text-sm">/ {target}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressClamped}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full bg-gradient-to-r ${colorMap[color]}`}
            />
          </div>
          <span className="text-xs text-gray-400 mt-1 block">
            {progressClamped.toFixed(0)}% of goal
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;