import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Flame, 
  Clock, 
  MapPin, 
  Utensils, 
  Droplets, 
  Dumbbell,
  Heart,
  Save,
  Loader
} from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

interface ProgressFormData {
  steps: number;
  calories: number;
  activeTime: number;
  distance: number;
  caloriesConsumed: number;
  protein: number;
  carbs: number;
  fats: number;
  waterMl: number;
  workoutType: string;
  workoutDuration: number;
  workoutIntensity: number;
  moodRating: number;
  notes: string;
}

export const ProgressRecordingForm: React.FC = () => {
  const { recordDailyProgress, isTransactionPending, userAddress } = useStacksStore();
  const [formData, setFormData] = useState<ProgressFormData>({
    steps: 0,
    calories: 0,
    activeTime: 0,
    distance: 0,
    caloriesConsumed: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    waterMl: 0,
    workoutType: 'General',
    workoutDuration: 0,
    workoutIntensity: 5,
    moodRating: 7,
    notes: ''
  });

  const [activeTab, setActiveTab] = useState<'activity' | 'nutrition' | 'workout' | 'wellness'>('activity');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workoutTypes = [
    'General', 'Cardio', 'Strength', 'Yoga', 'Running', 'Swimming', 
    'Cycling', 'Dancing', 'Sports', 'Walking', 'HIIT', 'Stretching'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.steps < 0 || formData.steps > 200000) {
      newErrors.steps = 'Steps must be between 0 and 200,000';
    }

    if (formData.calories < 0 || formData.calories > 10000) {
      newErrors.calories = 'Calories must be between 0 and 10,000';
    }

    if (formData.activeTime < 0 || formData.activeTime > 1440) {
      newErrors.activeTime = 'Active time must be between 0 and 1440 minutes';
    }

    if (formData.workoutIntensity < 1 || formData.workoutIntensity > 10) {
      newErrors.workoutIntensity = 'Intensity must be between 1 and 10';
    }

    if (formData.moodRating < 1 || formData.moodRating > 10) {
      newErrors.moodRating = 'Mood rating must be between 1 and 10';
    }

    if (formData.notes.length > 200) {
      newErrors.notes = 'Notes must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert form data to the format expected by recordDailyProgress
      const progressData = {
        steps: formData.steps,
        calories: formData.calories,
        activeTime: formData.activeTime
      };

      await recordDailyProgress(progressData);
      console.log('✅ Progress recorded successfully!');
      
      // Reset form after successful submission
      setFormData({
        steps: 0,
        calories: 0,
        activeTime: 0,
        distance: 0,
        caloriesConsumed: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        waterMl: 0,
        workoutType: 'General',
        workoutDuration: 0,
        workoutIntensity: 5,
        moodRating: 7,
        notes: ''
      });
      
    } catch (error) {
      console.error('❌ Failed to record progress:', error);
      alert('Failed to record progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProgressFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!userAddress) {
    return (
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-center">
        <Activity className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Connect Wallet Required</h3>
        <p className="text-gray-300">Please connect your Stacks wallet to record your fitness progress.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'wellness', label: 'Wellness', icon: Heart }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  <Activity className="w-4 h-4 inline mr-2" />
                  Steps
                </label>
                <input
                  type="number"
                  value={formData.steps}
                  onChange={(e) => handleInputChange('steps', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  min="0"
                  max="200000"
                  placeholder="10,000"
                />
                {errors.steps && <p className="text-red-400 text-sm mt-1">{errors.steps}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Flame className="w-4 h-4 inline mr-2" />
                  Calories Burned
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => handleInputChange('calories', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-orange-400 focus:outline-none"
                  min="0"
                  max="10000"
                  placeholder="500"
                />
                {errors.calories && <p className="text-red-400 text-sm mt-1">{errors.calories}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Active Time (min)
                </label>
                <input
                  type="number"
                  value={formData.activeTime}
                  onChange={(e) => handleInputChange('activeTime', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  min="0"
                  max="1440"
                  placeholder="60"
                />
                {errors.activeTime && <p className="text-red-400 text-sm mt-1">{errors.activeTime}</p>}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Distance (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => handleInputChange('distance', parseFloat(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                  min="0"
                  placeholder="5.0"
                />
              </div>
            </div>
          </div>
        );

      case 'nutrition':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Calories Consumed</label>
                <input
                  type="number"
                  value={formData.caloriesConsumed}
                  onChange={(e) => handleInputChange('caloriesConsumed', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-orange-400 focus:outline-none"
                  min="0"
                  placeholder="2000"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => handleInputChange('protein', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-red-400 focus:outline-none"
                  min="0"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => handleInputChange('carbs', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                  min="0"
                  placeholder="250"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Fats (g)</label>
                <input
                  type="number"
                  value={formData.fats}
                  onChange={(e) => handleInputChange('fats', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-green-400 focus:outline-none"
                  min="0"
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Droplets className="w-4 h-4 inline mr-2" />
                Water Intake (ml)
              </label>
              <input
                type="number"
                value={formData.waterMl}
                onChange={(e) => handleInputChange('waterMl', parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                min="0"
                placeholder="2000"
              />
            </div>
          </div>
        );

      case 'workout':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Workout Type</label>
                <select
                  value={formData.workoutType}
                  onChange={(e) => handleInputChange('workoutType', e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  {workoutTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-800">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Duration (min)</label>
                <input
                  type="number"
                  value={formData.workoutDuration}
                  onChange={(e) => handleInputChange('workoutDuration', parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  min="0"
                  placeholder="45"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Intensity (1-10)
                  <span className="ml-2 text-sm text-gray-400">Current: {formData.workoutIntensity}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.workoutIntensity}
                  onChange={(e) => handleInputChange('workoutIntensity', parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                {errors.workoutIntensity && <p className="text-red-400 text-sm mt-1">{errors.workoutIntensity}</p>}
              </div>
            </div>
          </div>
        );

      case 'wellness':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Mood Rating (1-10)
                <span className="ml-2 text-sm text-gray-400">Current: {formData.moodRating}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.moodRating}
                onChange={(e) => handleInputChange('moodRating', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>😔 Poor</span>
                <span>😐 Okay</span>
                <span>😊 Great</span>
              </div>
              {errors.moodRating && <p className="text-red-400 text-sm mt-1">{errors.moodRating}</p>}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                placeholder="How are you feeling today? Any observations about your workout or nutrition?"
                rows={4}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes && <p className="text-red-400 text-sm">{errors.notes}</p>}
                <p className="text-gray-400 text-sm">{formData.notes.length}/200</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Record Daily Progress</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-black/20 rounded-xl p-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderTabContent()}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isTransactionPending}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || isTransactionPending ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Recording on Blockchain...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Record Progress on Blockchain
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
        <h4 className="text-green-400 font-medium mb-2">🔗 Blockchain Benefits</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Your progress is permanently recorded and tamper-proof</li>
          <li>• Earn achievements and NFT rewards automatically</li>
          <li>• Build a verifiable fitness history you truly own</li>
          <li>• Share your progress with trusted fitness partners</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ProgressRecordingForm;