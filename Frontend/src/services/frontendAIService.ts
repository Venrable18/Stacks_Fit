/**
 * Frontend AI Service with Smart Fallback
 * Uses the backend smart AI service that implements: OpenAI → Gemini → Dummy Text
 */

const AI_BASE_URL = 'http://localhost:3002/api/ai';

interface UserProfile {
  fitnessLevel: string;
  goals: string;
  age: number;
  height: number;
  weight: number;
  preferredWorkoutTypes?: string[];
  weeklyWorkoutGoal: number;
}

interface AIResponse<T> {
  success: boolean;
  data: T;
  provider: string;
  fallbackUsed: boolean;
  error?: string;
}

interface HealthStatus {
  openai: { available: boolean; configured: boolean };
  gemini: { available: boolean; configured: boolean };
  fallbackStrategy: string;
}

export class FrontendAIService {
  private baseURL: string;

  constructor() {
    this.baseURL = AI_BASE_URL;
  }

  /**
   * Generate workout plan using smart fallback system
   */
  async generateWorkoutPlan(userProfile: UserProfile, progressHistory: any = null, preferences: any = {}): Promise<AIResponse<any>> {
    try {
      console.log('🎯 Frontend: Requesting smart workout plan...');
      
      const response = await fetch(`${this.baseURL}/smart/workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          progressHistory,
          preferences
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Frontend: Workout plan generated via ${result.metadata.provider}`);
        
        // Log fallback information
        if (result.metadata.fallbackUsed) {
          console.log(`🔄 Frontend: Fallback used - ${result.metadata.fallbackReason}`);
        }
        
        return {
          success: true,
          data: result.data,
          provider: result.metadata.provider,
          fallbackUsed: result.metadata.fallbackUsed
        };
      } else {
        throw new Error(result.message || 'Failed to generate workout plan');
      }
    } catch (error: any) {
      console.error('❌ Frontend AI Service Error:', error);
      
      // Return a basic fallback plan if everything fails
      return {
        success: true,
        data: this.getEmergencyWorkoutPlan(userProfile),
        provider: 'emergency_fallback',
        fallbackUsed: true,
        error: error.message
      };
    }
  }

  /**
   * Generate nutrition plan using smart fallback system
   */
  async generateNutritionPlan(userProfile: UserProfile, nutritionGoals: any = {}): Promise<AIResponse<any>> {
    try {
      console.log('🍎 Frontend: Requesting smart nutrition plan...');
      
      const response = await fetch(`${this.baseURL}/smart/nutrition-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile,
          nutritionGoals
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Frontend: Nutrition plan generated via ${result.metadata.provider}`);
        
        // Log fallback information
        if (result.metadata.fallbackUsed) {
          console.log(`🔄 Frontend: Fallback used - ${result.metadata.fallbackReason}`);
        }
        
        return {
          success: true,
          data: result.data,
          provider: result.metadata.provider,
          fallbackUsed: result.metadata.fallbackUsed
        };
      } else {
        throw new Error(result.message || 'Failed to generate nutrition plan');
      }
    } catch (error: any) {
      console.error('❌ Frontend AI Service Error:', error);
      
      // Return a basic fallback plan if everything fails
      return {
        success: true,
        data: this.getEmergencyNutritionPlan(),
        provider: 'emergency_fallback',
        fallbackUsed: true,
        error: error.message
      };
    }
  }

  /**
   * Simple chat interface for backward compatibility
   */
  async chat(message: string, userProfile: UserProfile): Promise<string> {
    try {
      // For simple chat, generate a motivational response based on the message
      const motivationalResponses = [
        `Great question! Based on your ${userProfile.fitnessLevel} fitness level, I'd recommend focusing on consistency over intensity. Your goal of ${userProfile.goals} is achievable with the right approach!`,
        `I love your dedication! Remember, fitness is a journey, not a destination. For someone with your profile, steady progress is key.`,
        `That's an excellent mindset! Your current fitness level (${userProfile.fitnessLevel}) means you have so much potential for growth. Keep pushing forward!`,
        `Smart thinking! Given your goals around ${userProfile.goals}, staying motivated is crucial. You're asking the right questions!`,
        `Perfect question for your fitness journey! At ${userProfile.fitnessLevel} level, understanding these concepts will really help you succeed.`
      ];
      
      const randomResponse = motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)];
      
      // Add some context based on the message content
      if (message.toLowerCase().includes('workout')) {
        return `${randomResponse} Would you like me to create a personalized workout plan for you?`;
      } else if (message.toLowerCase().includes('nutrition') || message.toLowerCase().includes('diet')) {
        return `${randomResponse} I can also help you with a nutrition plan tailored to your goals!`;
      } else {
        return `${randomResponse} I'm here to help with workouts, nutrition, and motivation!`;
      }
      
    } catch (error: any) {
      console.error('❌ Chat error:', error);
      return "I'm here to help you on your fitness journey! Feel free to ask about workouts, nutrition, or motivation. Let's achieve your goals together! 💪";
    }
  }

  /**
   * Health check for backward compatibility
   */
  async healthCheck(): Promise<boolean> {
    try {
      const health = await this.getServiceHealth();
      return health.openai.available || health.gemini.available;
    } catch {
      return false; // Always return false if health check fails, but app continues working
    }
  }

  /**
   * Check AI service health
   */
  async getServiceHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.baseURL}/smart/health`);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        openai: { available: false, configured: false },
        gemini: { available: false, configured: false },
        fallbackStrategy: 'All services unavailable'
      };
    }
  }

  /**
   * Emergency workout plan (minimal fallback)
   */
  getEmergencyWorkoutPlan(userProfile: UserProfile): any {
    return {
      planName: "Basic Fitness Plan",
      durationWeeks: 1,
      difficulty: userProfile.fitnessLevel || 'beginner',
      workoutDays: [
        {
          day: 1,
          dayName: "Monday",
          workoutType: "Basic Movement",
          duration: 20,
          exercises: [
            {
              name: "Walking",
              sets: 1,
              reps: null,
              duration: "15 minutes",
              rest: null,
              instructions: "Walk at a comfortable pace",
              modifications: {
                beginner: "Start with 10 minutes",
                advanced: "Add light jogging intervals"
              }
            },
            {
              name: "Stretching",
              sets: 1,
              reps: null,
              duration: "5 minutes",
              rest: null,
              instructions: "Gentle full-body stretching",
              modifications: {
                beginner: "Hold each stretch for 15 seconds",
                advanced: "Hold each stretch for 30 seconds"
              }
            }
          ],
          equipment: ["None"],
          warmup: "Light movement",
          cooldown: "Deep breathing"
        }
      ],
      nutritionTips: "Stay hydrated and eat balanced meals",
      safetyNotes: "Listen to your body and stop if you feel any pain"
    };
  }

  /**
   * Emergency nutrition plan (minimal fallback)
   */
  getEmergencyNutritionPlan(): any {
    return {
      planName: "Basic Nutrition Guidelines",
      dailyTargets: {
        calories: 2000,
        protein: 60,
        carbs: 250,
        fats: 65,
        fiber: 25,
        water: 2000
      },
      meals: [
        {
          mealType: "Breakfast",
          time: "Morning",
          calories: 500,
          foods: [
            {
              name: "Balanced breakfast",
              portion: "1 serving",
              calories: 500,
              protein: 20,
              carbs: 60,
              fats: 15
            }
          ],
          tips: "Include protein, carbs, and healthy fats"
        },
        {
          mealType: "Lunch",
          time: "Midday",
          calories: 700,
          foods: [
            {
              name: "Balanced lunch",
              portion: "1 serving",
              calories: 700,
              protein: 25,
              carbs: 80,
              fats: 20
            }
          ],
          tips: "Focus on vegetables and lean protein"
        },
        {
          mealType: "Dinner",
          time: "Evening",
          calories: 600,
          foods: [
            {
              name: "Balanced dinner",
              portion: "1 serving",
              calories: 600,
              protein: 20,
              carbs: 70,
              fats: 18
            }
          ],
          tips: "Keep dinner lighter than lunch"
        },
        {
          mealType: "Snacks",
          time: "As needed",
          calories: 200,
          foods: [
            {
              name: "Healthy snacks",
              portion: "1-2 servings",
              calories: 200,
              protein: 5,
              carbs: 25,
              fats: 8
            }
          ],
          tips: "Choose fruits, nuts, or yogurt"
        }
      ],
      hydrationPlan: {
        dailyWater: "8 glasses (2 liters)",
        timing: "Throughout the day",
        preworkout: "Drink water before exercise",
        postworkout: "Rehydrate after exercise"
      },
      supplementRecommendations: ["Consult with healthcare provider"],
      mealTiming: {
        preworkout: "Light snack 1 hour before",
        postworkout: "Protein within 30 minutes after"
      }
    };
  }

  /**
   * Get AI provider display name
   */
  getProviderDisplayName(provider: string): string {
    const names: Record<string, string> = {
      'openai': 'OpenAI GPT',
      'gemini': 'Google Gemini',
      'dummy': 'Offline Mode',
      'emergency_fallback': 'Basic Plan'
    };
    return names[provider] || provider;
  }

  /**
   * Check if AI services are available
   */
  async isAIAvailable(): Promise<boolean> {
    try {
      const health = await this.getServiceHealth();
      return health.openai.available || health.gemini.available;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const frontendAIService = new FrontendAIService();