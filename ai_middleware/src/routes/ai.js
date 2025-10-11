import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { validateWorkoutRequest, validateNutritionRequest, validateFormAnalysisRequest } from '../middleware/validation.js';
import { geminiService } from '../services/geminiService.js';
import { smartAIService } from '../services/smartAIService.js';

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize OpenAI with environment variable
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// Generate personalized workout plan
router.post('/workout-plan', validateWorkoutRequest, async (req, res) => {
  try {
    const { userProfile, progressHistory, preferences } = req.body;
    
    const prompt = `Generate a personalized weekly workout plan for a user with the following profile:
    
    Fitness Level: ${userProfile.fitnessLevel}
    Goals: ${userProfile.goals}
    Age: ${userProfile.age}
    Height: ${userProfile.height}cm
    Weight: ${userProfile.weight/10}kg
    Preferred Workouts: ${userProfile.preferredWorkoutTypes.join(', ')}
    Weekly Workout Goal: ${userProfile.weeklyWorkoutGoal} sessions
    
    ${progressHistory ? `Recent Progress: ${JSON.stringify(progressHistory)}` : ''}
    
    Create a structured 7-day workout plan with:
    1. Daily workout descriptions
    2. Exercise names, sets, reps, and duration
    3. Difficulty progression
    4. Rest day recommendations
    5. Equipment needed
    6. Safety tips for their fitness level
    
    Format the response as a JSON object with this structure:
    {
      "planName": "string",
      "durationWeeks": number,
      "difficulty": "beginner|intermediate|advanced",
      "weeklySchedule": [
        {
          "day": "Monday",
          "workoutType": "string",
          "exercises": [
            {
              "name": "string",
              "sets": number,
              "reps": "string",
              "duration": "string",
              "instructions": "string"
            }
          ],
          "estimatedDuration": "string",
          "caloriesBurned": number
        }
      ],
      "equipment": ["string"],
      "tips": ["string"],
      "progressionNotes": "string"
    }`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a certified personal trainer and fitness expert. Provide safe, effective, and personalized workout plans. Always prioritize user safety and proper form.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const workoutPlan = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: {
        plan: workoutPlan,
        generatedAt: new Date().toISOString(),
        aiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      }
    });

  } catch (error) {
    console.error('Workout plan generation error:', error);
    
    // Provide fallback workout plan when OpenAI fails
    const fallbackPlan = {
      planName: `Personalized ${req.body.userProfile.fitnessLevel} Workout Plan`,
      durationWeeks: 4,
      difficulty: req.body.userProfile.fitnessLevel,
      weeklySchedule: [
        {
          day: "Monday",
          workoutType: "Upper Body Strength",
          exercises: [
            { name: "Push-ups", sets: 3, reps: "8-12", duration: "2 min", restBetweenSets: "60 sec" },
            { name: "Pull-ups or Rows", sets: 3, reps: "6-10", duration: "2 min", restBetweenSets: "60 sec" },
            { name: "Overhead Press", sets: 3, reps: "8-10", duration: "2 min", restBetweenSets: "90 sec" }
          ]
        },
        {
          day: "Tuesday", 
          workoutType: "Cardio",
          exercises: [
            { name: "Brisk Walking/Jogging", sets: 1, reps: "20-30 min", duration: "30 min" }
          ]
        },
        {
          day: "Wednesday",
          workoutType: "Lower Body Strength", 
          exercises: [
            { name: "Squats", sets: 3, reps: "10-15", duration: "3 min", restBetweenSets: "60 sec" },
            { name: "Lunges", sets: 3, reps: "8-12 each leg", duration: "3 min", restBetweenSets: "60 sec" }
          ]
        }
      ],
      equipment: ["Bodyweight", "Dumbbells (optional)"],
      tips: [
        "Focus on proper form over heavy weights",
        "Listen to your body and rest when needed", 
        "Stay hydrated throughout your workouts"
      ],
      progressionNotes: "Increase reps or sets by 10-20% each week as you get stronger"
    };
    
    res.json({
      success: true,
      data: {
        plan: fallbackPlan,
        generatedAt: new Date().toISOString(),
        aiModel: 'fallback',
        note: 'Using intelligent fallback due to API limitations'
      }
    });
  }
});

// Generate nutrition plan and meal suggestions
router.post('/nutrition-plan', validateNutritionRequest, async (req, res) => {
  try {
    const { userProfile, nutritionGoals, dietaryRestrictions, currentNutrition } = req.body;
    
    const prompt = `Create a personalized nutrition plan for a user with the following profile:
    
    Age: ${userProfile.age}
    Weight: ${userProfile.weight/10}kg
    Height: ${userProfile.height}cm
    Goals: ${userProfile.goals}
    Dietary Restrictions: ${dietaryRestrictions?.join(', ') || 'None'}
    Target Daily Calories: ${nutritionGoals.targetCalories}
    
    ${currentNutrition ? `Current Nutrition Patterns: ${JSON.stringify(currentNutrition)}` : ''}
    
    Provide:
    1. Daily meal plan with macro breakdown
    2. Meal timing recommendations
    3. Hydration goals
    4. Supplement suggestions (if applicable)
    5. Healthy snack options
    6. Meal prep tips
    
    Format as JSON:
    {
      "dailyTargets": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fats": number,
        "fiber": number,
        "water": number
      },
      "mealPlan": [
        {
          "meal": "Breakfast|Lunch|Dinner|Snack",
          "time": "string",
          "foods": [
            {
              "name": "string",
              "portion": "string",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fats": number
            }
          ],
          "totalCalories": number,
          "prepTime": "string"
        }
      ],
      "hydrationPlan": {
        "dailyWaterGoal": "string",
        "schedule": ["string"]
      },
      "tips": ["string"],
      "supplements": ["string"]
    }`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a certified nutritionist and dietitian. Provide safe, evidence-based nutrition advice. Consider user health conditions and dietary restrictions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const nutritionPlan = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: {
        nutritionPlan,
        generatedAt: new Date().toISOString(),
        aiModel: process.env.OPENAI_MODEL || 'gpt-4',
      }
    });

  } catch (error) {
    console.error('Nutrition plan generation error:', error);
    
    // If it's an OpenAI quota/rate limit error, provide fallback response
    if (error.status === 429 || error.code === 'insufficient_quota') {
      const { userProfile, nutritionGoals, dietaryRestrictions } = req.body;
      
      // Generate intelligent fallback nutrition plan
      const fallbackNutritionPlan = {
        planName: `Personalized ${userProfile.goals} Nutrition Plan`,
        durationWeeks: 4,
        targetCalories: nutritionGoals.targetCalories,
        macroBreakdown: {
          protein: Math.round(nutritionGoals.targetCalories * 0.25 / 4), // 25% protein
          carbs: Math.round(nutritionGoals.targetCalories * 0.45 / 4),    // 45% carbs
          fats: Math.round(nutritionGoals.targetCalories * 0.30 / 9)      // 30% fats
        },
        mealPlan: [
          {
            meal: "Breakfast",
            time: "7:00-8:00 AM",
            foods: [
              { name: "Oatmeal with berries", portion: "1 cup", calories: 300, protein: 10, carbs: 55, fats: 6 },
              { name: "Greek yogurt", portion: "150g", calories: 130, protein: 15, carbs: 6, fats: 0 }
            ],
            totalCalories: 430,
            prepTime: "10 minutes"
          },
          {
            meal: "Lunch", 
            time: "12:00-1:00 PM",
            foods: [
              { name: "Grilled chicken salad", portion: "200g", calories: 350, protein: 35, carbs: 15, fats: 18 },
              { name: "Quinoa", portion: "1/2 cup", calories: 110, protein: 4, carbs: 20, fats: 2 }
            ],
            totalCalories: 460,
            prepTime: "15 minutes"
          },
          {
            meal: "Dinner",
            time: "6:00-7:00 PM", 
            foods: [
              { name: "Baked salmon", portion: "150g", calories: 280, protein: 25, carbs: 0, fats: 20 },
              { name: "Steamed vegetables", portion: "1 cup", calories: 50, protein: 3, carbs: 10, fats: 0 },
              { name: "Brown rice", portion: "1/2 cup", calories: 110, protein: 3, carbs: 22, fats: 1 }
            ],
            totalCalories: 440,
            prepTime: "25 minutes"
          },
          {
            meal: "Snack",
            time: "3:00 PM",
            foods: [
              { name: "Apple with almond butter", portion: "1 medium + 1 tbsp", calories: 190, protein: 4, carbs: 20, fats: 8 }
            ],
            totalCalories: 190,
            prepTime: "2 minutes"
          }
        ],
        hydrationPlan: {
          dailyWaterGoal: `${Math.round((userProfile.weight/10) * 35)}ml`, // 35ml per kg
          schedule: ["Upon waking", "Before meals", "During workouts", "Before bed"]
        },
        tips: [
          "Eat slowly and mindfully",
          "Include protein with every meal",
          "Choose whole foods over processed",
          "Plan and prep meals in advance",
          "Listen to your hunger cues"
        ],
        supplements: userProfile.goals === 'weight_loss' ? 
          ["Multivitamin", "Omega-3", "Vitamin D"] : 
          ["Multivitamin", "Protein powder", "Creatine"]
      };
      
      return res.json({
        success: true,
        data: {
          nutritionPlan: fallbackNutritionPlan,
          generatedAt: new Date().toISOString(),
          aiModel: 'fallback',
          note: 'Using intelligent fallback due to OpenAI quota exceeded'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate nutrition plan',
      message: error.message
    });
  }
});

// Analyze progress and provide insights
router.post('/progress-analysis', async (req, res) => {
  try {
    const { userProfile, progressData, timeframe } = req.body;
    
    const prompt = `Analyze the fitness progress for a user with the following data:
    
    User Profile: ${JSON.stringify(userProfile)}
    Progress Data (${timeframe}): ${JSON.stringify(progressData)}
    
    Provide insights on:
    1. Progress trends and patterns
    2. Goal achievement status
    3. Areas for improvement
    4. Motivational feedback
    5. Recommendations for next steps
    6. Potential challenges and solutions
    
    Format as JSON:
    {
      "overallScore": number,
      "trends": {
        "steps": "improving|declining|stable",
        "calories": "improving|declining|stable",
        "consistency": "improving|declining|stable"
      },
      "achievements": ["string"],
      "insights": ["string"],
      "recommendations": ["string"],
      "motivation": "string",
      "nextGoals": ["string"]
    }`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI fitness coach. Provide encouraging, data-driven insights while being realistic and supportive.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: {
        analysis,
        generatedAt: new Date().toISOString(),
        aiModel: process.env.OPENAI_MODEL || 'gpt-4',
      }
    });

  } catch (error) {
    console.error('Progress analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze progress',
      message: error.message
    });
  }
});

// Exercise form correction (placeholder for future computer vision integration)
router.post('/form-analysis', validateFormAnalysisRequest, async (req, res) => {
  try {
    const { exerciseType, videoData, userProfile } = req.body;
    
    // Placeholder response - in production, this would integrate with computer vision
    const formAnalysis = {
      exerciseType,
      overallScore: 85,
      feedback: [
        "Good form overall!",
        "Keep your back straight during the movement",
        "Focus on controlled movement speed"
      ],
      corrections: [
        {
          bodyPart: "back",
          issue: "slight rounding",
          correction: "Engage your core and imagine a string pulling you up from the top of your head"
        }
      ],
      safetyNotes: [
        "Reduce weight if you cannot maintain proper form",
        "Take breaks between sets to prevent fatigue-related form breakdown"
      ]
    };
    
    res.json({
      success: true,
      data: {
        formAnalysis,
        generatedAt: new Date().toISOString(),
        note: "Computer vision integration coming soon!"
      }
    });

  } catch (error) {
    console.error('Form analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze form',
      message: error.message
    });
  }
});

// ==================== GEMINI AI ENDPOINTS ====================

// Gemini-powered workout plan generation
router.post('/gemini/workout-plan', validateWorkoutRequest, async (req, res) => {
  try {
    const { userProfile, progressHistory, preferences } = req.body;
    
    if (!geminiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI service is not available',
        message: 'Please check if GEMINI_API_KEY is configured'
      });
    }

    console.log('🤖 Generating Gemini workout plan for user:', userProfile);
    
    const result = await geminiService.generateWorkoutPlan(userProfile, progressHistory, preferences);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate workout plan with Gemini',
        details: result.error,
        rawResponse: result.rawResponse
      });
    }

    res.json({
      success: true,
      data: {
        workoutPlan: result.data,
        provider: 'gemini',
        generatedAt: new Date().toISOString(),
        userProfile: {
          fitnessLevel: userProfile.fitnessLevel,
          goals: userProfile.goals,
          weeklyWorkoutGoal: userProfile.weeklyWorkoutGoal
        }
      }
    });

  } catch (error) {
    console.error('Gemini workout plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate workout plan with Gemini',
      message: error.message
    });
  }
});

// Gemini-powered nutrition plan generation
router.post('/gemini/nutrition-plan', validateNutritionRequest, async (req, res) => {
  try {
    const { userProfile, nutritionGoals } = req.body;
    
    if (!geminiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI service is not available',
        message: 'Please check if GEMINI_API_KEY is configured'
      });
    }

    console.log('🍎 Generating Gemini nutrition plan for user:', userProfile);
    
    const result = await geminiService.generateNutritionPlan(userProfile, nutritionGoals);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate nutrition plan with Gemini',
        details: result.error,
        rawResponse: result.rawResponse
      });
    }

    res.json({
      success: true,
      data: {
        nutritionPlan: result.data,
        provider: 'gemini',
        generatedAt: new Date().toISOString(),
        userProfile: {
          age: userProfile.age,
          weight: userProfile.weight,
          goals: userProfile.goals
        }
      }
    });

  } catch (error) {
    console.error('Gemini nutrition plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate nutrition plan with Gemini',
      message: error.message
    });
  }
});

// Gemini-powered form analysis
router.post('/gemini/form-analysis', validateFormAnalysisRequest, async (req, res) => {
  try {
    const { exerciseName, description, issues } = req.body;
    
    if (!geminiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI service is not available',
        message: 'Please check if GEMINI_API_KEY is configured'
      });
    }

    console.log('💪 Analyzing form with Gemini for:', exerciseName);
    
    const result = await geminiService.analyzeWorkoutForm(exerciseName, description, issues);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to analyze form with Gemini',
        details: result.error,
        rawResponse: result.rawResponse
      });
    }

    res.json({
      success: true,
      data: {
        formAnalysis: result.data,
        provider: 'gemini',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Gemini form analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze form with Gemini',
      message: error.message
    });
  }
});

// Gemini motivational coaching
router.post('/gemini/motivation', async (req, res) => {
  try {
    const { userProfile, progressData, context } = req.body;
    
    if (!geminiService.isAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Gemini AI service is not available',
        message: 'Please check if GEMINI_API_KEY is configured'
      });
    }

    console.log('🎯 Generating motivational message with Gemini');
    
    const result = await geminiService.getMotivationalMessage(userProfile, progressData, context);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate motivation with Gemini',
        message: result.error
      });
    }

    res.json({
      success: true,
      data: {
        message: result.message,
        provider: 'gemini',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Gemini motivation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate motivation with Gemini',
      message: error.message
    });
  }
});

// Health check for Gemini service
router.get('/gemini/health', (req, res) => {
  const isAvailable = geminiService.isAvailable();
  
  res.json({
    success: true,
    data: {
      geminiAvailable: isAvailable,
      status: isAvailable ? 'ready' : 'unavailable',
      message: isAvailable ? 'Gemini AI service is ready' : 'Gemini API key not configured'
    }
  });
});

// =============================================================================
// SMART AI ROUTES WITH FALLBACK SYSTEM (OpenAI → Gemini → Dummy)
// =============================================================================

// Smart workout plan with fallback
router.post('/smart/workout-plan', validateWorkoutRequest, async (req, res) => {
  try {
    const { userProfile, progressHistory, preferences } = req.body;
    
    console.log('🚀 Smart workout plan generation started...');
    
    const result = await smartAIService.generateWorkoutPlan(userProfile, progressHistory, preferences);
    
    res.json({
      success: true,
      data: result.data,
      metadata: {
        provider: result.provider,
        fallbackUsed: result.fallbackUsed,
        fallbackReason: result.fallbackReason || null,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Smart workout plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate workout plan',
      message: error.message
    });
  }
});

// Smart nutrition plan with fallback
router.post('/smart/nutrition-plan', validateNutritionRequest, async (req, res) => {
  try {
    const { userProfile, nutritionGoals } = req.body;
    
    console.log('🚀 Smart nutrition plan generation started...');
    
    const result = await smartAIService.generateNutritionPlan(userProfile, nutritionGoals);
    
    res.json({
      success: true,
      data: result.data,
      metadata: {
        provider: result.provider,
        fallbackUsed: result.fallbackUsed,
        fallbackReason: result.fallbackReason || null,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Smart nutrition plan error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate nutrition plan',
      message: error.message
    });
  }
});

// Smart AI service health check
router.get('/smart/health', (req, res) => {
  const healthStatus = smartAIService.getHealthStatus();
  
  res.json({
    success: true,
    data: healthStatus
  });
});

export default router;