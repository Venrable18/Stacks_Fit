import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Calendar, 
  Target, 
  Globe, 
  Lock,
  Save,
  Loader,
  Plus,
  Trash2
} from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
}

interface WorkoutPlanFormData {
  planName: string;
  durationWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  workoutDataHash: string;
  aiModelVersion: string;
  isActive: boolean;
  exercises: Exercise[];
}

export const WorkoutPlanCreationForm: React.FC = () => {
  const { createWorkoutPlan, isTransactionPending, userAddress } = useStacksStore();
  const [formData, setFormData] = useState<WorkoutPlanFormData>({
    planName: '',
    durationWeeks: 4,
    difficulty: 'beginner',
    workoutDataHash: '',
    aiModelVersion: 'v1.0',
    isActive: true,
    exercises: [
      { name: '', sets: 3, reps: 10, weight: 0, duration: 0, restTime: 60 }
    ]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.planName.trim()) {
      newErrors.planName = 'Plan name is required';
    } else if (formData.planName.length > 100) {
      newErrors.planName = 'Plan name must be 100 characters or less';
    }

    if (formData.durationWeeks < 1 || formData.durationWeeks > 52) {
      newErrors.durationWeeks = 'Duration must be between 1 and 52 weeks';
    }

    if (formData.exercises.length === 0) {
      newErrors.exercises = 'At least one exercise is required';
    }

    // Validate each exercise
    formData.exercises.forEach((exercise, index) => {
      if (!exercise.name.trim()) {
        newErrors[`exercise_${index}_name`] = 'Exercise name is required';
      }
      if (exercise.sets < 1 || exercise.sets > 20) {
        newErrors[`exercise_${index}_sets`] = 'Sets must be between 1 and 20';
      }
      if (exercise.reps < 1 || exercise.reps > 100) {
        newErrors[`exercise_${index}_reps`] = 'Reps must be between 1 and 100';
      }
    });

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
      // Generate a mock IPFS hash for the workout data
      const workoutDataJson = JSON.stringify({
        exercises: formData.exercises,
        metadata: {
          aiModelVersion: formData.aiModelVersion,
          createdAt: new Date().toISOString()
        }
      });
      
      // In production, this would be uploaded to IPFS
      const mockIpfsHash = 'Qm' + btoa(workoutDataJson).slice(0, 44);

      const planData = {
        planName: formData.planName,
        durationWeeks: formData.durationWeeks,
        difficulty: formData.difficulty,
        workoutDataHash: mockIpfsHash,
        aiModelVersion: formData.aiModelVersion,
        isActive: formData.isActive,
        exercises: formData.exercises
      };

      const planId = await createWorkoutPlan(planData);
      console.log('✅ Workout plan created successfully with ID:', planId);
      
      // Reset form after successful submission
      setFormData({
        planName: '',
        durationWeeks: 4,
        difficulty: 'beginner',
        workoutDataHash: '',
        aiModelVersion: 'v1.0',
        isActive: true,
        exercises: [
          { name: '', sets: 3, reps: 10, weight: 0, duration: 0, restTime: 60 }
        ]
      });
      
    } catch (error) {
      console.error('❌ Failed to create workout plan:', error);
      alert('Failed to create workout plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: '', sets: 3, reps: 10, weight: 0, duration: 0, restTime: 60 }
      ]
    }));
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  if (!userAddress) {
    return (
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md text-center">
        <Dumbbell className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">Connect Wallet Required</h3>
        <p className="text-gray-300">Please connect your Stacks wallet to create workout plans.</p>
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
        <Dumbbell className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Create Workout Plan</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Plan Name</label>
            <input
              type="text"
              value={formData.planName}
              onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              placeholder="e.g. 6-Week Strength Builder"
              maxLength={100}
            />
            {errors.planName && <p className="text-red-400 text-sm mt-1">{errors.planName}</p>}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Duration (weeks)
            </label>
            <input
              type="number"
              value={formData.durationWeeks}
              onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) || 0 }))}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              min="1"
              max="52"
            />
            {errors.durationWeeks && <p className="text-red-400 text-sm mt-1">{errors.durationWeeks}</p>}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-white font-medium mb-2">
            <Target className="w-4 h-4 inline mr-2" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                className={`p-4 rounded-lg border transition-colors ${
                  formData.difficulty === level
                    ? 'bg-purple-500/30 border-purple-400'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <h4 className="text-white font-medium capitalize">{level}</h4>
                <p className="text-gray-300 text-sm mt-1">
                  {level === 'beginner' && 'Perfect for fitness newcomers'}
                  {level === 'intermediate' && 'For regular gym-goers'}
                  {level === 'advanced' && 'Challenging for athletes'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-white font-medium">
              <Dumbbell className="w-4 h-4 inline mr-2" />
              Exercises
            </label>
            <button
              type="button"
              onClick={addExercise}
              className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          </div>

          <div className="space-y-4">
            {formData.exercises.map((exercise, index) => (
              <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Exercise {index + 1}</h4>
                  {formData.exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-1">Exercise Name</label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:border-purple-400 focus:outline-none"
                      placeholder="e.g. Push-ups"
                    />
                    {errors[`exercise_${index}_name`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`exercise_${index}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Sets</label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:border-blue-400 focus:outline-none"
                      min="1"
                      max="20"
                    />
                    {errors[`exercise_${index}_sets`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`exercise_${index}_sets`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Reps</label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:border-green-400 focus:outline-none"
                      min="1"
                      max="100"
                    />
                    {errors[`exercise_${index}_reps`] && (
                      <p className="text-red-400 text-xs mt-1">{errors[`exercise_${index}_reps`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={exercise.weight || ''}
                      onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:border-orange-400 focus:outline-none"
                      min="0"
                      step="0.5"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Rest (sec)</label>
                    <input
                      type="number"
                      value={exercise.restTime}
                      onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 0)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded text-white text-sm focus:border-cyan-400 focus:outline-none"
                      min="0"
                      step="15"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.exercises && <p className="text-red-400 text-sm mt-1">{errors.exercises}</p>}
        </div>

        {/* Privacy Settings */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="ml-2 text-white flex items-center gap-2">
              {formData.isActive ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {formData.isActive ? 'Public Plan' : 'Private Plan'}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isTransactionPending}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || isTransactionPending ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Creating Plan on Blockchain...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Create Workout Plan on Blockchain
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
        <h4 className="text-purple-400 font-medium mb-2">💡 Blockchain Benefits</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Your workout plan is permanently stored and tamper-proof</li>
          <li>• Share your successful plans with the fitness community</li>
          <li>• Track completion rates and optimize your training</li>
          <li>• Monetize effective plans through decentralized fitness marketplace</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default WorkoutPlanCreationForm;