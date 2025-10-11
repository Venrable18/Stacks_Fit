import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Loader } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

interface ProfileData {
  displayName: string;
  age: number;
  goalDescription: string;
  goals: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  height: number;
  weight: number;
  targetDailySteps: number;
  targetDailyCalories: number;
  preferredWorkoutTypes: string[];
}

export const ProfileCreationForm: React.FC = () => {
  const { createUserProfile, isTransactionPending, userAddress } = useStacksStore();
  const [formData, setFormData] = useState<ProfileData>({
    displayName: '',
    age: 25,
    goalDescription: '',
    goals: 'general_fitness',
    fitnessLevel: 'beginner',
    height: 170,
    weight: 70,
    targetDailySteps: 10000,
    targetDailyCalories: 500,
    preferredWorkoutTypes: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fitnessLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting my fitness journey' },
    { value: 'intermediate', label: 'Intermediate', description: 'Regular exercise, some experience' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced athlete or trainer' }
  ];

  const workoutTypes = [
    'Cardio', 'Strength Training', 'Yoga', 'Running', 'Swimming', 
    'Cycling', 'Dancing', 'Martial Arts', 'Rock Climbing', 'CrossFit'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be 50 characters or less';
    }

    if (formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    if (formData.goalDescription.trim() && formData.goalDescription.length > 200) {
      newErrors.goalDescription = 'Goal description must be 200 characters or less';
    }

    if (formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Height must be between 100-250 cm';
    }

    if (formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Weight must be between 30-300 kg';
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
      // Convert form data to the format expected by the contract
      const profileData = {
        fitnessLevel: formData.fitnessLevel,
        goals: formData.goals,
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
        preferredWorkoutTypes: formData.preferredWorkoutTypes,
        dietaryRestrictions: [], // Default empty
        targetDailySteps: formData.targetDailySteps,
        targetDailyCalories: formData.targetDailyCalories,
        weeklyWorkoutGoal: 3 // Default 3 workouts per week
      };

      await createUserProfile(profileData);
      console.log('✅ Profile created successfully!');
      
    } catch (error) {
      console.error('❌ Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkoutTypeToggle = (workoutType: string) => {
    setFormData(prev => ({
      ...prev,
      preferredWorkoutTypes: prev.preferredWorkoutTypes.includes(workoutType)
        ? prev.preferredWorkoutTypes.filter(type => type !== workoutType)
        : [...prev.preferredWorkoutTypes, workoutType]
    }));
  };

  if (!userAddress) {
    return (
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-center">
        <User className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Connect Wallet Required</h3>
        <p className="text-gray-300">Please connect your Stacks wallet to create your fitness profile.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 p-6 rounded-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Create Your Fitness Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name */}
        <div>
          <label className="block text-white font-medium mb-2">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            placeholder="Enter your display name"
            maxLength={50}
          />
          {errors.displayName && <p className="text-red-400 text-sm mt-1">{errors.displayName}</p>}
        </div>

        {/* Age and Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              min="13"
              max="120"
            />
            {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              min="100"
              max="250"
            />
            {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              min="30"
              max="300"
            />
            {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
          </div>
        </div>

        {/* Fitness Level */}
        <div>
          <label className="block text-white font-medium mb-2">Fitness Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {fitnessLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, fitnessLevel: level.value as any }))}
                className={`p-4 rounded-lg border transition-colors ${
                  formData.fitnessLevel === level.value
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <h4 className="text-white font-medium">{level.label}</h4>
                <p className="text-gray-300 text-sm mt-1">{level.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-white font-medium mb-2">Fitness Goals</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'weight_loss', label: 'Weight Loss', description: 'Burn fat and lose weight' },
              { value: 'muscle_gain', label: 'Muscle Gain', description: 'Build strength and muscle mass' },
              { value: 'endurance', label: 'Endurance', description: 'Improve cardio and stamina' },
              { value: 'general_fitness', label: 'General Fitness', description: 'Overall health and wellness' }
            ].map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, goals: goal.value as any }))}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  formData.goals === goal.value
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <h4 className="text-white font-medium">{goal.label}</h4>
                <p className="text-gray-300 text-sm mt-1">{goal.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Description */}
        <div>
          <label className="block text-white font-medium mb-2">Goal Description (Optional)</label>
          <textarea
            value={formData.goalDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, goalDescription: e.target.value }))}
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
            placeholder="Describe your specific goals or provide more details..."
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.goalDescription && <p className="text-red-400 text-sm">{errors.goalDescription}</p>}
            <p className="text-gray-400 text-sm">{formData.goalDescription.length}/200</p>
          </div>
        </div>

        {/* Daily Targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Daily Steps Target</label>
            <input
              type="number"
              value={formData.targetDailySteps}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDailySteps: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              min="1000"
              max="50000"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Daily Calories Target</label>
            <input
              type="number"
              value={formData.targetDailyCalories}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDailyCalories: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              min="100"
              max="2000"
              step="50"
            />
          </div>
        </div>

        {/* Preferred Workout Types */}
        <div>
          <label className="block text-white font-medium mb-2">Preferred Workout Types</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {workoutTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleWorkoutTypeToggle(type)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  formData.preferredWorkoutTypes.includes(type)
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-400'
                    : 'bg-white/5 text-gray-300 border border-white/20 hover:border-white/40'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isTransactionPending}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || isTransactionPending ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Creating Profile on Blockchain...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Create Profile on Blockchain
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
        <h4 className="text-blue-400 font-medium mb-2">📋 What happens next?</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Your profile will be securely stored on the Stacks blockchain</li>
          <li>• You'll be able to track your fitness progress permanently</li>
          <li>• Earn achievements and NFT rewards for your accomplishments</li>
          <li>• Your data is owned by you, not centralized platforms</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ProfileCreationForm;