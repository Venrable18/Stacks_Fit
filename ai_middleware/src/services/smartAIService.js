import OpenAI from 'openai';
import { geminiService } from './geminiService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Smart AI Service with Fallback System
 * Order: OpenAI → Gemini → Dummy Text
 */
export class SmartAIService {
  constructor() {
    this.openaiClient = null;
    this.initializeOpenAI();
  }

  initializeOpenAI() {
    try {
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        this.openaiClient = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        console.log('✅ OpenAI client initialized');
      } else {
        console.log('⚠️ OpenAI API key not found, will use Gemini as primary');
      }
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI:', error);
      this.openaiClient = null;
    }
  }

  /**
   * Get dummy workout plan as fallback
   */
  getDummyWorkoutPlan(userProfile) {
    return {
      planName: `${userProfile.fitnessLevel.charAt(0).toUpperCase() + userProfile.fitnessLevel.slice(1)} Fitness Plan`,
      durationWeeks: 4,
      difficulty: userProfile.fitnessLevel,
      workoutDays: [
        {
          day: 1,
          dayName: "Monday",
          workoutType: "Full Body Strength",
          duration: 45,
          exercises: [
            {
              name: "Push-ups",
              sets: userProfile.fitnessLevel === 'beginner' ? 2 : 3,
              reps: userProfile.fitnessLevel === 'beginner' ? "5-8" : "8-12",
              duration: null,
              rest: "60 seconds",
              instructions: "Keep your core tight and maintain proper form",
              modifications: {
                beginner: "Knee push-ups or wall push-ups",
                advanced: "Diamond push-ups or decline push-ups"
              }
            },
            {
              name: "Bodyweight Squats",
              sets: userProfile.fitnessLevel === 'beginner' ? 2 : 3,
              reps: userProfile.fitnessLevel === 'beginner' ? "8-12" : "12-15",
              duration: null,
              rest: "60 seconds",
              instructions: "Keep your chest up and weight in your heels",
              modifications: {
                beginner: "Chair-assisted squats",
                advanced: "Jump squats or single-leg squats"
              }
            },
            {
              name: "Plank",
              sets: 3,
              reps: null,
              duration: userProfile.fitnessLevel === 'beginner' ? "20-30 seconds" : "30-60 seconds",
              rest: "45 seconds",
              instructions: "Keep your body in a straight line from head to toe",
              modifications: {
                beginner: "Knee plank or wall plank",
                advanced: "Plank with leg lifts or side planks"
              }
            }
          ],
          equipment: ["None - Bodyweight only"],
          warmup: "5 minutes of light movement and dynamic stretching",
          cooldown: "5-10 minutes of static stretching"
        },
        {
          day: 2,
          dayName: "Tuesday",
          workoutType: "Cardio & Core",
          duration: 30,
          exercises: [
            {
              name: "Walking/Jogging",
              sets: 1,
              reps: null,
              duration: "15-20 minutes",
              rest: null,
              instructions: "Maintain a pace where you can still hold a conversation",
              modifications: {
                beginner: "Brisk walking",
                advanced: "Interval running"
              }
            },
            {
              name: "Mountain Climbers",
              sets: 3,
              reps: userProfile.fitnessLevel === 'beginner' ? "10 each leg" : "15 each leg",
              duration: null,
              rest: "45 seconds",
              instructions: "Keep your core engaged and maintain quick, controlled movements",
              modifications: {
                beginner: "Slow mountain climbers",
                advanced: "Cross-body mountain climbers"
              }
            }
          ],
          equipment: ["None"],
          warmup: "5 minutes light cardio",
          cooldown: "5 minutes stretching"
        },
        {
          day: 3,
          dayName: "Wednesday",
          workoutType: "Rest Day",
          duration: 0,
          exercises: [],
          equipment: [],
          warmup: "Light stretching or gentle yoga",
          cooldown: "Focus on recovery and hydration"
        }
      ],
      nutritionTips: `For ${userProfile.goals}, focus on balanced meals with adequate protein, complex carbohydrates, and healthy fats. Stay hydrated and eat within 30 minutes post-workout.`,
      safetyNotes: "Always warm up before exercising. Stop if you feel pain or dizziness. Consult a healthcare provider before starting any new exercise program."
    };
  }

  /**
   * Get dummy nutrition plan as fallback
   */
  getDummyNutritionPlan(userProfile, nutritionGoals) {
    const baseCalories = nutritionGoals.targetCalories || 2000;
    const proteinGrams = Math.round(userProfile.weight / 10 * 1.2); // 1.2g per kg bodyweight
    
    return {
      planName: "Balanced Nutrition Plan",
      dailyTargets: {
        calories: baseCalories,
        protein: proteinGrams,
        carbs: Math.round(baseCalories * 0.45 / 4), // 45% of calories from carbs
        fats: Math.round(baseCalories * 0.25 / 9), // 25% of calories from fats
        fiber: 25,
        water: 2500
      },
      meals: [
        {
          mealType: "Breakfast",
          time: "7:00 AM",
          calories: Math.round(baseCalories * 0.25),
          foods: [
            {
              name: "Oatmeal with banana and nuts",
              portion: "1 cup oats + 1 banana + 1 tbsp nuts",
              calories: Math.round(baseCalories * 0.2),
              protein: Math.round(proteinGrams * 0.15),
              carbs: 45,
              fats: 8
            },
            {
              name: "Greek yogurt",
              portion: "1/2 cup",
              calories: Math.round(baseCalories * 0.05),
              protein: 10,
              carbs: 6,
              fats: 0
            }
          ],
          tips: "Start your day with complex carbs and protein for sustained energy"
        },
        {
          mealType: "Lunch",
          time: "12:30 PM",
          calories: Math.round(baseCalories * 0.35),
          foods: [
            {
              name: "Grilled chicken with quinoa and vegetables",
              portion: "4oz chicken + 1/2 cup quinoa + 1 cup mixed vegetables",
              calories: Math.round(baseCalories * 0.35),
              protein: Math.round(proteinGrams * 0.4),
              carbs: 35,
              fats: 8
            }
          ],
          tips: "Include lean protein and fiber-rich carbohydrates"
        },
        {
          mealType: "Dinner",
          time: "6:00 PM",
          calories: Math.round(baseCalories * 0.3),
          foods: [
            {
              name: "Baked fish with sweet potato and greens",
              portion: "4oz fish + 1 medium sweet potato + 2 cups greens",
              calories: Math.round(baseCalories * 0.3),
              protein: Math.round(proteinGrams * 0.35),
              carbs: 30,
              fats: 6
            }
          ],
          tips: "Keep dinner moderate and include plenty of vegetables"
        },
        {
          mealType: "Snacks",
          time: "Throughout day",
          calories: Math.round(baseCalories * 0.1),
          foods: [
            {
              name: "Mixed nuts and fruit",
              portion: "1 small handful nuts + 1 piece fruit",
              calories: Math.round(baseCalories * 0.1),
              protein: Math.round(proteinGrams * 0.1),
              carbs: 15,
              fats: 8
            }
          ],
          tips: "Choose nutrient-dense snacks when hungry between meals"
        }
      ],
      hydrationPlan: {
        dailyWater: "2.5-3 liters",
        timing: "Sip throughout the day",
        preworkout: "500ml 1-2 hours before exercise",
        postworkout: "150% of fluid lost during exercise"
      },
      supplementRecommendations: ["Vitamin D3 (if deficient)", "Omega-3 fatty acids"],
      mealTiming: {
        preworkout: "Light snack 1-2 hours before training",
        postworkout: "Protein and carbs within 30-60 minutes after training"
      }
    };
  }

  /**
   * Generate workout plan with fallback system
   */
  async generateWorkoutPlan(userProfile, progressHistory = null, preferences = {}) {
    console.log('🎯 Starting workout plan generation with fallback system...');

    // Try OpenAI first
    if (this.openaiClient) {
      try {
        console.log('🤖 Attempting OpenAI workout plan generation...');
        const result = await this.generateOpenAIWorkoutPlan(userProfile, progressHistory, preferences);
        console.log('✅ OpenAI workout plan generated successfully');
        return {
          success: true,
          data: result,
          provider: 'openai',
          fallbackUsed: false
        };
      } catch (error) {
        console.error('❌ OpenAI failed:', error.message);
        console.log('🔄 Falling back to Gemini...');
      }
    }

    // Try Gemini as fallback
    if (geminiService.isAvailable()) {
      try {
        console.log('🧠 Attempting Gemini workout plan generation...');
        const result = await geminiService.generateWorkoutPlan(userProfile, progressHistory, preferences);
        if (result.success) {
          console.log('✅ Gemini workout plan generated successfully');
          return {
            success: true,
            data: result.data,
            provider: 'gemini',
            fallbackUsed: true,
            fallbackReason: 'OpenAI unavailable'
          };
        }
      } catch (error) {
        console.error('❌ Gemini also failed:', error.message);
        console.log('🔄 Using dummy data as final fallback...');
      }
    }

    // Final fallback: dummy data
    console.log('📝 Using dummy workout plan as final fallback');
    const dummyPlan = this.getDummyWorkoutPlan(userProfile);
    return {
      success: true,
      data: dummyPlan,
      provider: 'dummy',
      fallbackUsed: true,
      fallbackReason: 'Both OpenAI and Gemini unavailable'
    };
  }

  /**
   * Generate nutrition plan with fallback system
   */
  async generateNutritionPlan(userProfile, nutritionGoals = {}) {
    console.log('🍎 Starting nutrition plan generation with fallback system...');

    // Try OpenAI first
    if (this.openaiClient) {
      try {
        console.log('🤖 Attempting OpenAI nutrition plan generation...');
        const result = await this.generateOpenAINutritionPlan(userProfile, nutritionGoals);
        console.log('✅ OpenAI nutrition plan generated successfully');
        return {
          success: true,
          data: result,
          provider: 'openai',
          fallbackUsed: false
        };
      } catch (error) {
        console.error('❌ OpenAI failed:', error.message);
        console.log('🔄 Falling back to Gemini...');
      }
    }

    // Try Gemini as fallback
    if (geminiService.isAvailable()) {
      try {
        console.log('🧠 Attempting Gemini nutrition plan generation...');
        const result = await geminiService.generateNutritionPlan(userProfile, nutritionGoals);
        if (result.success) {
          console.log('✅ Gemini nutrition plan generated successfully');
          return {
            success: true,
            data: result.data,
            provider: 'gemini',
            fallbackUsed: true,
            fallbackReason: 'OpenAI unavailable'
          };
        }
      } catch (error) {
        console.error('❌ Gemini also failed:', error.message);
        console.log('🔄 Using dummy data as final fallback...');
      }
    }

    // Final fallback: dummy data
    console.log('📝 Using dummy nutrition plan as final fallback');
    const dummyPlan = this.getDummyNutritionPlan(userProfile, nutritionGoals);
    return {
      success: true,
      data: dummyPlan,
      provider: 'dummy',
      fallbackUsed: true,
      fallbackReason: 'Both OpenAI and Gemini unavailable'
    };
  }

  /**
   * OpenAI workout plan generation
   */
  async generateOpenAIWorkoutPlan(userProfile, progressHistory, preferences) {
    const prompt = `Generate a personalized weekly workout plan for a user with the following profile:
    
    Fitness Level: ${userProfile.fitnessLevel}
    Goals: ${userProfile.goals}
    Age: ${userProfile.age}
    Height: ${userProfile.height}cm
    Weight: ${userProfile.weight/10}kg
    Preferred Workouts: ${userProfile.preferredWorkoutTypes?.join(', ') || 'Not specified'}
    Weekly Workout Goal: ${userProfile.weeklyWorkoutGoal} sessions
    
    ${progressHistory ? `Recent Progress: ${JSON.stringify(progressHistory)}` : ''}
    
    Create a structured 7-day workout plan. Return ONLY a JSON object with this exact structure:
    {
      "planName": "string",
      "durationWeeks": number,
      "difficulty": "beginner|intermediate|advanced",
      "workoutDays": [
        {
          "day": number,
          "dayName": "string",
          "workoutType": "string",
          "duration": number,
          "exercises": [
            {
              "name": "string",
              "sets": number,
              "reps": "string",
              "duration": "string or null",
              "rest": "string",
              "instructions": "string",
              "modifications": {
                "beginner": "string",
                "advanced": "string"
              }
            }
          ],
          "equipment": ["string"],
          "warmup": "string",
          "cooldown": "string"
        }
      ],
      "nutritionTips": "string",
      "safetyNotes": "string"
    }`;

    const completion = await this.openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content.trim();
    return JSON.parse(responseText);
  }

  /**
   * OpenAI nutrition plan generation
   */
  async generateOpenAINutritionPlan(userProfile, nutritionGoals) {
    const prompt = `Create a personalized daily nutrition plan for this user:

    Age: ${userProfile.age} years
    Height: ${userProfile.height}cm  
    Weight: ${userProfile.weight/10}kg
    Fitness Level: ${userProfile.fitnessLevel}
    Goals: ${userProfile.goals}
    Target Calories: ${nutritionGoals.targetCalories || 'Calculate based on profile'}

    Return ONLY a JSON object with this exact structure:
    {
      "planName": "string",
      "dailyTargets": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fats": number,
        "fiber": number,
        "water": number
      },
      "meals": [
        {
          "mealType": "string",
          "time": "string",
          "calories": number,
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
          "tips": "string"
        }
      ],
      "hydrationPlan": {
        "dailyWater": "string",
        "timing": "string",
        "preworkout": "string",
        "postworkout": "string"
      },
      "supplementRecommendations": ["string"],
      "mealTiming": {
        "preworkout": "string",
        "postworkout": "string"
      }
    }`;

    const completion = await this.openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    });

    const responseText = completion.choices[0].message.content.trim();
    return JSON.parse(responseText);
  }

  /**
   * Service health check
   */
  getHealthStatus() {
    return {
      openai: {
        available: this.openaiClient !== null,
        configured: process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'
      },
      gemini: {
        available: geminiService.isAvailable(),
        configured: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
      },
      fallbackStrategy: 'OpenAI → Gemini → Dummy Data'
    };
  }
}

// Export singleton instance
export const smartAIService = new SmartAIService();