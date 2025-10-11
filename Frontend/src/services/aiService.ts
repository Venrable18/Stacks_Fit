// AI Service for connecting to the AI middleware
const AI_MIDDLEWARE_URL = 'http://localhost:3002/api';

export interface UserProfile {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string;
  age: number;
  height: number;
  weight: number;
  preferredWorkoutTypes: string[];
  weeklyWorkoutGoal: number;
}

export interface WorkoutPlanRequest {
  userProfile: UserProfile;
  progressHistory?: any[];
  preferences?: any;
}

export interface NutritionRequest {
  userProfile: UserProfile;
  nutritionGoals: {
    targetCalories: number;
    proteinRatio?: number;
    carbRatio?: number;
    fatRatio?: number;
  };
  dietaryRestrictions?: string[];
  currentNutrition?: any;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AI_MIDDLEWARE_URL;
  }

  // Helper to convert user profile for API
  private convertUserProfile(userProfile: UserProfile) {
    return {
      ...userProfile,
      weight: Math.round(userProfile.weight * 10) // Convert kg to API format (kg * 10)
    };
  }

  // Test the connection to AI middleware
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('AI Middleware health check failed:', error);
      return false;
    }
  }

  // Generate workout plan
  async generateWorkoutPlan(request: WorkoutPlanRequest): Promise<AIResponse> {
    try {
      // Convert user profile to API format
      const convertedRequest = {
        ...request,
        userProfile: this.convertUserProfile(request.userProfile)
      };

      const response = await fetch(`${this.baseUrl}/ai/workout-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertedRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Workout plan generation failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Generate nutrition advice
  async generateNutritionAdvice(request: NutritionRequest): Promise<AIResponse> {
    try {
      // Convert user profile to API format
      const convertedRequest = {
        ...request,
        userProfile: this.convertUserProfile(request.userProfile)
      };

      const response = await fetch(`${this.baseUrl}/ai/nutrition-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertedRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Nutrition advice generation failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // General AI chat - we'll implement this as a smart router
  async chat(message: string, userProfile?: UserProfile): Promise<AIResponse> {
    try {
      console.log('🤖 AI Service: Processing message:', message);
      console.log('👤 User Profile:', userProfile);
      
      const messageType = this.detectMessageType(message);
      console.log('📋 Message Type:', messageType);
      
      if (messageType === 'workout' && userProfile) {
        console.log('🏋️ Generating workout plan...');
        const workoutRequest: WorkoutPlanRequest = {
          userProfile: this.convertUserProfile(userProfile),
          preferences: { focusArea: this.extractWorkoutFocus(message) }
        };
        const result = await this.generateWorkoutPlan(workoutRequest);
        console.log('💪 Workout Plan Result:', result);
        return result;
      }
      
      if (messageType === 'nutrition' && userProfile) {
        console.log('🍎 Generating nutrition advice...');
        const nutritionRequest: NutritionRequest = {
          userProfile: this.convertUserProfile(userProfile),
          nutritionGoals: {
            targetCalories: userProfile.age * 25 // Simple calculation
          }
        };
        const result = await this.generateNutritionAdvice(nutritionRequest);
        console.log('🥗 Nutrition Result:', result);
        return result;
      }

      // For general questions, return a smart fallback
      console.log('🔄 Using fallback response for message type:', messageType);
      return {
        success: true,
        data: {
          response: this.generateFallbackResponse(message),
          suggestions: this.generateSuggestions(message)
        }
      };
    } catch (error) {
      console.error('❌ AI chat failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private detectMessageType(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('workout') || msg.includes('exercise') || msg.includes('training')) {
      return 'workout';
    }
    if (msg.includes('nutrition') || msg.includes('food') || msg.includes('diet') || msg.includes('meal')) {
      return 'nutrition';
    }
    if (msg.includes('progress') || msg.includes('analytics') || msg.includes('stats')) {
      return 'progress';
    }
    return 'general';
  }

  private extractWorkoutFocus(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('strength') || msg.includes('weight')) return 'strength';
    if (msg.includes('cardio') || msg.includes('running')) return 'cardio';
    if (msg.includes('flexibility') || msg.includes('stretch')) return 'flexibility';
    return 'balanced';
  }

  private generateFallbackResponse(_message: string): string {
    const responses = [
      "I'm here to help you with your fitness journey! I can create personalized workout plans, provide nutrition advice, and analyze your progress. What would you like to focus on?",
      "Great question! As your AI fitness coach, I can assist with workout planning, nutrition guidance, and progress tracking. How can I help you reach your goals today?",
      "I'm powered by advanced AI to give you personalized fitness advice. Whether you need a workout routine, meal planning, or motivation, I'm here for you!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateSuggestions(message: string): string[] {
    const messageType = this.detectMessageType(message);
    
    switch (messageType) {
      case 'workout':
        return ["Create strength routine", "Plan cardio session", "Recovery exercises"];
      case 'nutrition':
        return ["Meal prep ideas", "Protein requirements", "Hydration tips"];
      case 'progress':
        return ["Weekly summary", "Goal tracking", "Performance trends"];
      default:
        return ["Create workout plan", "Nutrition advice", "Analyze progress", "Set new goals"];
    }
  }
}

export const aiService = new AIService();