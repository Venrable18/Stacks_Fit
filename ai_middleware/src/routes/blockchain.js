import express from 'express';
import { 
  StacksTestnet, 
  StacksMainnet 
} from '@stacks/network';
import { 
  callReadOnlyFunction,
  cvToJSON,
  uintCV,
  principalCV
} from '@stacks/transactions';

const router = express.Router();

// Initialize Stacks network
const network = process.env.STACKS_NETWORK === 'mainnet' 
  ? new StacksMainnet() 
  : new StacksTestnet();

const contractAddress = process.env.STACKS_CONTRACT_ADDRESS;
const contractName = process.env.STACKS_CONTRACT_NAME || 'fitness';

// Get user profile from blockchain
router.get('/profile/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'get-user-profile',
      functionArgs: [principalCV(address)],
      network,
      senderAddress: address,
    };

    const result = await callReadOnlyFunction(options);
    const profileData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        profile: profileData,
        address,
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
});

// Get user progress history
router.get('/progress/:address/:date', async (req, res) => {
  try {
    const { address, date } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'get-progress-history',
      functionArgs: [principalCV(address), uintCV(parseInt(date))],
      network,
      senderAddress: address,
    };

    const result = await callReadOnlyFunction(options);
    const progressData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        progress: progressData,
        address,
        date,
      }
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress data',
      message: error.message
    });
  }
});

// Get user nutrition data
router.get('/nutrition/:address/:date', async (req, res) => {
  try {
    const { address, date } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'get-daily-nutrition',
      functionArgs: [principalCV(address), uintCV(parseInt(date))],
      network,
      senderAddress: address,
    };

    const result = await callReadOnlyFunction(options);
    const nutritionData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        nutrition: nutritionData,
        address,
        date,
      }
    });

  } catch (error) {
    console.error('Nutrition fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nutrition data',
      message: error.message
    });
  }
});

// Get user achievements
router.get('/achievements/:address/:achievementId', async (req, res) => {
  try {
    const { address, achievementId } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'get-user-achievement',
      functionArgs: [principalCV(address), uintCV(parseInt(achievementId))],
      network,
      senderAddress: address,
    };

    const result = await callReadOnlyFunction(options);
    const achievementData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        achievement: achievementData,
        address,
        achievementId,
      }
    });

  } catch (error) {
    console.error('Achievement fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement data',
      message: error.message
    });
  }
});

// Get workout plan
router.get('/workout-plan/:address/:planId', async (req, res) => {
  try {
    const { address, planId } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'get-workout-plan',
      functionArgs: [principalCV(address), uintCV(parseInt(planId))],
      network,
      senderAddress: address,
    };

    const result = await callReadOnlyFunction(options);
    const workoutPlanData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        workoutPlan: workoutPlanData,
        address,
        planId,
      }
    });

  } catch (error) {
    console.error('Workout plan fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch workout plan',
      message: error.message
    });
  }
});

// Get user streak
router.get('/streak/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'get-user-streak',
      functionArgs: [principalCV(address)],
      network,
      senderAddress: address,
    };

    const result = await callReadOnlyFunction(options);
    const streakData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        streak: streakData,
        address,
      }
    });

  } catch (error) {
    console.error('Streak fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch streak data',
      message: error.message
    });
  }
});

// Check friendship status
router.get('/friends/:address1/:address2', async (req, res) => {
  try {
    const { address1, address2 } = req.params;
    
    const options = {
      contractAddress,
      contractName,
      functionName: 'are-friends',
      functionArgs: [principalCV(address1), principalCV(address2)],
      network,
      senderAddress: address1,
    };

    const result = await callReadOnlyFunction(options);
    const friendshipData = cvToJSON(result);

    res.json({
      success: true,
      data: {
        areFriends: friendshipData,
        address1,
        address2,
      }
    });

  } catch (error) {
    console.error('Friendship check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check friendship status',
      message: error.message
    });
  }
});

// Aggregate user dashboard data
router.get('/dashboard/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const today = parseInt(req.query.date) || Math.floor(Date.now() / 86400000) + 20241001;
    
    // Fetch multiple pieces of data in parallel
    const [profileResult, progressResult, nutritionResult, streakResult] = await Promise.all([
      callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-user-profile',
        functionArgs: [principalCV(address)],
        network,
        senderAddress: address,
      }),
      callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-progress-history',
        functionArgs: [principalCV(address), uintCV(today)],
        network,
        senderAddress: address,
      }),
      callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-daily-nutrition',
        functionArgs: [principalCV(address), uintCV(today)],
        network,
        senderAddress: address,
      }),
      callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: 'get-user-streak',
        functionArgs: [principalCV(address)],
        network,
        senderAddress: address,
      })
    ]);

    const dashboardData = {
      profile: cvToJSON(profileResult),
      todayProgress: cvToJSON(progressResult),
      todayNutrition: cvToJSON(nutritionResult),
      currentStreak: cvToJSON(streakResult),
      date: today,
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

export default router;