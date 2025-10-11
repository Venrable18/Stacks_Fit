import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Users, Calendar, Database, AlertCircle } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

const SampleDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const { 
    recordDailyProgress,
    createWorkoutPlan,
    addFriend,
    userAddress,
    isTransactionPending
  } = useStacksStore();

  const generateSampleProfile = async () => {
    const sampleProfile = {
      age: 28,
      height: 175,
      weight: 70,
      fitnessLevel: 'Intermediate',
      goals: 'Weight Loss & Strength Building',
      targetDailySteps: 10000
    };

    setGenerationStatus('Creating sample profile...');
    // Note: This would need the createUserProfile function to be called
    console.log('Sample profile would be:', sampleProfile);
  };

  const generateSampleProgress = async () => {
    setGenerationStatus('Generating sample progress data...');
    
    // Generate 7 days of realistic progress data
    const progressData = [
      { steps: 8500, calories: 420, activeTime: 45 },
      { steps: 12000, calories: 580, activeTime: 65 },
      { steps: 9800, calories: 490, activeTime: 55 },
      { steps: 11200, calories: 650, activeTime: 70 },
      { steps: 7600, calories: 380, activeTime: 40 },
      { steps: 13500, calories: 720, activeTime: 85 },
      { steps: 10100, calories: 520, activeTime: 60 }
    ];

    for (let i = 0; i < progressData.length; i++) {
      try {
        setGenerationStatus(`Recording day ${i + 1} of 7...`);
        await recordDailyProgress(progressData[i]);
        // Add delay to prevent overwhelming the blockchain
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to record day ${i + 1}:`, error);
        setGenerationStatus(`Error recording day ${i + 1}. Continuing...`);
      }
    }
  };

  const generateSampleWorkouts = async () => {
    setGenerationStatus('Creating sample workout plans...');
    
    const sampleWorkouts = [
      {
        planName: 'Morning Cardio Blast',
        durationWeeks: 4,
        difficulty: 'intermediate' as const,
        workoutDataHash: 'QmSampleCardioHash123',
        aiModelVersion: 'v2.0',
        isActive: true,
        exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: 60, restTime: 30 },
          { name: 'Burpees', sets: 3, reps: 15, restTime: 45 },
          { name: 'Mountain Climbers', sets: 3, reps: 40, restTime: 30 },
          { name: 'High Knees', sets: 4, reps: 30, restTime: 20 }
        ]
      },
      {
        planName: 'Strength Builder',
        durationWeeks: 6,
        difficulty: 'beginner' as const,
        workoutDataHash: 'QmSampleStrengthHash456',
        aiModelVersion: 'v2.0',
        isActive: true,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 10, restTime: 60 },
          { name: 'Squats', sets: 3, reps: 15, restTime: 45 },
          { name: 'Plank', sets: 3, reps: 1, duration: 30, restTime: 60 },
          { name: 'Lunges', sets: 3, reps: 12, restTime: 45 }
        ]
      }
    ];

    for (let i = 0; i < sampleWorkouts.length; i++) {
      try {
        setGenerationStatus(`Creating workout plan ${i + 1} of ${sampleWorkouts.length}...`);
        await createWorkoutPlan(sampleWorkouts[i]);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Failed to create workout ${i + 1}:`, error);
        setGenerationStatus(`Error creating workout ${i + 1}. Continuing...`);
      }
    }
  };

  const generateSampleFriends = async () => {
    setGenerationStatus('Adding sample friends...');
    
    // Sample Stacks addresses (these would be real addresses in production)
    const sampleFriends = [
      'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      'ST2JHG361ZXG51QTQTQGWTCCJFX9DNETVQH7HY9SE'
    ];

    for (let i = 0; i < sampleFriends.length; i++) {
      try {
        setGenerationStatus(`Adding friend ${i + 1} of ${sampleFriends.length}...`);
        await addFriend(sampleFriends[i]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to add friend ${i + 1}:`, error);
        setGenerationStatus(`Error adding friend ${i + 1}. Continuing...`);
      }
    }
  };

  const generateAllSampleData = async () => {
    if (!userAddress) {
      setGenerationStatus('❌ Please connect your wallet first');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('🚀 Starting sample data generation...');

    try {
      // Generate data in sequence to avoid overwhelming the blockchain
      await generateSampleProfile();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await generateSampleProgress();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await generateSampleWorkouts();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await generateSampleFriends();
      
      setGenerationStatus('✅ Sample data generation completed!');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setGenerationStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Sample data generation failed:', error);
      setGenerationStatus('❌ Sample data generation failed. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 p-6 rounded-xl backdrop-blur-md space-y-6"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Database className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Sample Data Generator</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Generate realistic sample data to test your fitness dashboard with blockchain integration
        </p>
      </div>

      {/* Warning Notice */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">Demo Data Notice</h4>
            <p className="text-yellow-200 text-sm">
              This will create real blockchain transactions with sample data. 
              Each transaction requires STX tokens for gas fees.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Generation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateSampleProgress}
          disabled={isGenerating || isTransactionPending}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-400/40 transition-all"
        >
          <Activity className="w-6 h-6 text-blue-400 mb-2" />
          <h3 className="text-white font-medium mb-1">Progress Data</h3>
          <p className="text-gray-300 text-xs">7 days of activity</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateSampleWorkouts}
          disabled={isGenerating || isTransactionPending}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-400/40 transition-all"
        >
          <Calendar className="w-6 h-6 text-green-400 mb-2" />
          <h3 className="text-white font-medium mb-1">Workout Plans</h3>
          <p className="text-gray-300 text-xs">2 sample workouts</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateSampleFriends}
          disabled={isGenerating || isTransactionPending}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-400/40 transition-all"
        >
          <Users className="w-6 h-6 text-purple-400 mb-2" />
          <h3 className="text-white font-medium mb-1">Friends</h3>
          <p className="text-gray-300 text-xs">3 sample friends</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateAllSampleData}
          disabled={isGenerating || isTransactionPending || !userAddress}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-orange-400/40 transition-all"
        >
          <Zap className="w-6 h-6 text-orange-400 mb-2" />
          <h3 className="text-white font-medium mb-1">Generate All</h3>
          <p className="text-gray-300 text-xs">Complete dataset</p>
        </motion.button>
      </div>

      {/* Status Display */}
      {generationStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 p-4 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {isGenerating && (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span className="text-white font-medium">{generationStatus}</span>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-black/20 p-4 rounded-lg">
        <h4 className="text-white font-medium mb-2">📋 Instructions</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Ensure your wallet is connected and has STX tokens</li>
          <li>• Each transaction will require approval in your wallet</li>
          <li>• Generation may take several minutes due to blockchain confirmation times</li>
          <li>• You can generate individual data types or use "Generate All" for everything</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default SampleDataGenerator;