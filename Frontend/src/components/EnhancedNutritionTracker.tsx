import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEnhancedStacksStore } from '../store/enhancedStacksStore';
import { 
  Apple, 
  Droplets, 
  Utensils, 
  TrendingUp, 
  Save,
  Plus,
  Minus,
  Star
} from 'lucide-react';

interface EnhancedNutritionTrackerProps {
  className?: string;
}

export const EnhancedNutritionTracker: React.FC<EnhancedNutritionTrackerProps> = ({ 
  className = '' 
}) => {
  const { recordEnhancedNutrition, getDailyNutrition } = useEnhancedStacksStore();
  
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    waterMl: 0,
    mealsLogged: 0,
    nutritionScore: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayNutrition, setTodayNutrition] = useState<any>(null);

  const handleInputChange = (field: string, value: number) => {
    setNutritionData(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nutritionData.calories && !nutritionData.protein) {
      alert('Please enter at least some nutrition data!');
      return;
    }

    setIsSubmitting(true);
    try {
      await recordEnhancedNutrition(nutritionData);
      
      // Reset form
      setNutritionData({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        waterMl: 0,
        mealsLogged: 0,
        nutritionScore: 0
      });
      
      // Refresh today's data
      const today = new Date().toISOString().split('T')[0];
      const updated = await getDailyNutrition(today);
      setTodayNutrition(updated);
      
    } catch (error) {
      console.error('Failed to record nutrition:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementValue = (field: string, amount: number) => {
    setNutritionData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev] + amount
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreStars = (score: number) => {
    const stars = Math.floor(score / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-morphism rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Apple className="w-6 h-6 text-green-400" />
        <h3 className="text-xl font-semibold text-white">Enhanced Nutrition Tracker</h3>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
          AI-Powered
        </span>
      </div>

      {/* Today's Nutrition Summary */}
      {todayNutrition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
        >
          <h4 className="text-lg font-medium text-white mb-3">Today's Nutrition</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{todayNutrition.calories}</div>
              <div className="text-xs text-gray-400">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{todayNutrition.protein}g</div>
              <div className="text-xs text-gray-400">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{todayNutrition.waterMl}ml</div>
              <div className="text-xs text-gray-400">Water</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(todayNutrition.nutritionScore)}`}>
                {todayNutrition.nutritionScore}
              </div>
              <div className="text-xs text-gray-400 flex justify-center gap-1">
                {getScoreStars(todayNutrition.nutritionScore)}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Nutrition Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Macronutrients */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Macronutrients</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calories */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Calories</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => incrementValue('calories', -50)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <input
                  type="number"
                  value={nutritionData.calories || ''}
                  onChange={(e) => handleInputChange('calories', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-center"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => incrementValue('calories', 50)}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Protein (g)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => incrementValue('protein', -5)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <input
                  type="number"
                  value={nutritionData.protein || ''}
                  onChange={(e) => handleInputChange('protein', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-center"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => incrementValue('protein', 5)}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Carbs (g)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => incrementValue('carbs', -10)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <input
                  type="number"
                  value={nutritionData.carbs || ''}
                  onChange={(e) => handleInputChange('carbs', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-center"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => incrementValue('carbs', 10)}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
            </div>

            {/* Fats */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Fats (g)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => incrementValue('fats', -2)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <input
                  type="number"
                  value={nutritionData.fats || ''}
                  onChange={(e) => handleInputChange('fats', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-center"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => incrementValue('fats', 2)}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Additional Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fiber */}
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Fiber (g)</label>
              <input
                type="number"
                value={nutritionData.fiber || ''}
                onChange={(e) => handleInputChange('fiber', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                placeholder="0"
              />
            </div>

            {/* Water */}
            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" />
                Water (ml)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => incrementValue('waterMl', -250)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Minus size={16} className="text-red-400" />
                </button>
                <input
                  type="number"
                  value={nutritionData.waterMl || ''}
                  onChange={(e) => handleInputChange('waterMl', parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white text-center"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => incrementValue('waterMl', 250)}
                  className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <Plus size={16} className="text-green-400" />
                </button>
              </div>
            </div>

            {/* Meals Logged */}
            <div className="space-y-2">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <Utensils size={16} className="text-orange-400" />
                Meals Logged
              </label>
              <input
                type="number"
                value={nutritionData.mealsLogged || ''}
                onChange={(e) => handleInputChange('mealsLogged', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                placeholder="0"
                min="0"
                max="6"
              />
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Quick Add</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => {
                incrementValue('waterMl', 250);
              }}
              className="p-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg transition-colors"
            >
              <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-sm text-white">+250ml Water</div>
            </button>
            
            <button
              type="button"
              onClick={() => {
                incrementValue('protein', 25);
                incrementValue('calories', 150);
              }}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-colors"
            >
              <div className="text-sm text-white">Protein Shake</div>
              <div className="text-xs text-gray-400">25g protein</div>
            </button>
            
            <button
              type="button"
              onClick={() => {
                incrementValue('fiber', 5);
                incrementValue('calories', 80);
              }}
              className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors"
            >
              <div className="text-sm text-white">Fruit Serving</div>
              <div className="text-xs text-gray-400">5g fiber</div>
            </button>
            
            <button
              type="button"
              onClick={() => {
                incrementValue('mealsLogged', 1);
              }}
              className="p-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-colors"
            >
              <Utensils className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="text-sm text-white">+1 Meal</div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 
            hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                🔄
              </motion.div>
              Recording on Blockchain...
            </>
          ) : (
            <>
              <Save size={20} />
              Record Enhanced Nutrition
            </>
          )}
        </motion.button>
      </form>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">AI Nutrition Insights</span>
        </div>
        <p className="text-sm text-gray-300">
          Your nutrition data will be analyzed by AI to provide personalized recommendations 
          and calculate your daily nutrition score based on your fitness goals.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedNutritionTracker;