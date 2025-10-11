import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnhancedStacksStore } from '../store/enhancedStacksStore';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Brain, 
  Plus, 
  Edit3, 
  Trash2, 
  Play,
  AlertCircle
} from 'lucide-react';
import type { WorkoutPlan, Exercise } from '../store/stacksStore';

interface WorkoutPlanManagerProps {
  className?: string;
}

export const WorkoutPlanManager: React.FC<WorkoutPlanManagerProps> = ({ 
  className = '' 
}) => {
  const { 
    createWorkoutPlan, 
    getUserWorkoutPlans, 
    getWorkoutPlan, 
    deleteWorkoutPlan 
  } = useEnhancedStacksStore();
  
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newPlan, setNewPlan] = useState({
    planName: '',
    durationWeeks: 4,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    workoutDataHash: '',
    aiModelVersion: 'v2.1',
    isActive: true,
    exercises: [] as Exercise[]
  });

  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  const loadWorkoutPlans = async () => {
    setIsLoading(true);
    try {
      const plans = await getUserWorkoutPlans();
      setWorkoutPlans(plans);
    } catch (error) {
      console.error('Failed to load workout plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.planName.trim()) {
      alert('Please enter a plan name!');
      return;
    }

    setIsLoading(true);
    try {
      const planId = await createWorkoutPlan(newPlan);
      
      // Reset form
      setNewPlan({
        planName: '',
        durationWeeks: 4,
        difficulty: 'beginner',
        workoutDataHash: '',
        aiModelVersion: 'v2.1',
        isActive: true,
        exercises: []
      });
      setShowCreateForm(false);
      
      // Reload plans
      await loadWorkoutPlans();
      
      console.log('✅ Workout plan created with ID:', planId);
    } catch (error) {
      console.error('Failed to create workout plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (planId: number) => {
    try {
      const plan = await getWorkoutPlan(planId);
      setSelectedPlan(plan);
    } catch (error) {
      console.error('Failed to load plan details:', error);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this workout plan?')) {
      return;
    }

    try {
      await deleteWorkoutPlan(planId);
      await loadWorkoutPlans();
      if (selectedPlan?.planId === planId) {
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Failed to delete workout plan:', error);
    }
  };

  const addExercise = () => {
    setNewPlan(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          name: '',
          sets: 3,
          reps: 10,
          weight: 0,
          duration: 0,
          restTime: 60
        }
      ]
    }));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    setNewPlan(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const removeExercise = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'advanced':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-morphism rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Dumbbell className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">AI Workout Plans</h3>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
            Smart Training
          </span>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
            border border-purple-500/30 text-purple-300 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plans List */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Your Plans</h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-purple-400"
              >
                🔄
              </motion.div>
              <span className="ml-2 text-gray-400">Loading plans...</span>
            </div>
          ) : workoutPlans.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">No workout plans yet</p>
              <p className="text-sm text-gray-500">Create your first AI-powered plan!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutPlans.map((plan) => (
                <motion.div
                  key={plan.planId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    selectedPlan?.planId === plan.planId
                      ? 'bg-purple-500/20 border-purple-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleSelectPlan(plan.planId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-white mb-1">{plan.planName}</h5>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {plan.durationWeeks} weeks
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(plan.difficulty)}`}>
                          {plan.difficulty}
                        </span>
                        {plan.isActive && (
                          <span className="text-green-400 text-xs">● Active</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan.planId);
                        }}
                        className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                      >
                        <Play size={14} className="text-purple-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.planId);
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Plan Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Plan Details</h4>
          
          {selectedPlan ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-white">{selectedPlan.planName}</h5>
                <span className={`px-3 py-1 rounded-full text-sm border ${getDifficultyColor(selectedPlan.difficulty)}`}>
                  {selectedPlan.difficulty}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="font-semibold text-white">{selectedPlan.durationWeeks} weeks</div>
                </div>
                <div className="text-center p-3 bg-black/20 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400">AI Model</div>
                  <div className="font-semibold text-white">{selectedPlan.aiModelVersion}</div>
                </div>
              </div>

              {selectedPlan.exercises && selectedPlan.exercises.length > 0 && (
                <div>
                  <h6 className="font-medium text-white mb-3">Exercises</h6>
                  <div className="space-y-3">
                    {selectedPlan.exercises.map((exercise, index) => (
                      <div key={index} className="p-3 bg-black/20 rounded-lg">
                        <div className="font-medium text-white mb-2">{exercise.name}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight && exercise.weight > 0 && (
                            <span>{exercise.weight}kg</span>
                          )}
                          {exercise.duration && exercise.duration > 0 && (
                            <span>{exercise.duration}s</span>
                          )}
                          <span>{exercise.restTime}s rest</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 
                  hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-lg transition-colors">
                  <Play size={16} />
                  Start Workout
                </button>
                <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 
                  text-blue-300 rounded-lg transition-colors">
                  <Edit3 size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Select a plan to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Plan Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">Create New Workout Plan</h4>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={newPlan.planName}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, planName: e.target.value }))}
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                      placeholder="My Awesome Plan"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Duration (weeks)</label>
                    <input
                      type="number"
                      value={newPlan.durationWeeks}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, durationWeeks: parseInt(e.target.value) || 4 }))}
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                      min="1"
                      max="52"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Difficulty</label>
                    <select
                      value={newPlan.difficulty}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-white/70 mb-2">AI Model Version</label>
                    <input
                      type="text"
                      value={newPlan.aiModelVersion}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, aiModelVersion: e.target.value }))}
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white"
                      placeholder="v2.1"
                    />
                  </div>
                </div>

                {/* Exercises */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm text-white/70">Exercises</label>
                    <button
                      type="button"
                      onClick={addExercise}
                      className="flex items-center gap-2 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 
                        border border-green-500/30 text-green-300 rounded-lg transition-colors text-sm"
                    >
                      <Plus size={14} />
                      Add Exercise
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {newPlan.exercises.map((exercise, index) => (
                      <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="font-medium text-white">Exercise {index + 1}</h6>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            className="px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                            placeholder="Exercise name"
                          />
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                            className="px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                            placeholder="Sets"
                            min="1"
                          />
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                            className="px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                            placeholder="Reps"
                            min="1"
                          />
                          <input
                            type="number"
                            value={exercise.weight || ''}
                            onChange={(e) => updateExercise(index, 'weight', parseInt(e.target.value) || 0)}
                            className="px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                            placeholder="Weight (kg)"
                            min="0"
                          />
                          <input
                            type="number"
                            value={exercise.duration || ''}
                            onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value) || 0)}
                            className="px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                            placeholder="Duration (s)"
                            min="0"
                          />
                          <input
                            type="number"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 60)}
                            className="px-3 py-2 bg-black/20 border border-white/10 rounded text-white text-sm"
                            placeholder="Rest (s)"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 
                      text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 
                      text-purple-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Creating...' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkoutPlanManager;