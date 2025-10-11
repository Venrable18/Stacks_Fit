import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Gemini AI Service for StacksFit
 * Provides AI-powered fitness coaching using Google's Gemini model
 */
export class GeminiAIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not found. Gemini AI features will be disabled.');
      this.client = null;
      return;
    }
    
    try {
      this.client = new GoogleGenerativeAI(this.apiKey);
      this.model = this.client.getGenerativeModel({ model: 'gemini-pro' });
      console.log('✅ Gemini AI service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error);
      this.client = null;
    }
  }

  /**
   * Check if Gemini AI is available
   */
  isAvailable() {
    return this.client !== null;
  }

  /**
   * Generate personalized workout plan using Gemini
   */
  async generateWorkoutPlan(userProfile, progressHistory = null, preferences = {}) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI is not available. Please check your API key.');
    }

    const prompt = `You are a professional fitness trainer and nutritionist. Create a personalized weekly workout plan for the following user:

**USER PROFILE:**
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals}
- Age: ${userProfile.age} years
- Height: ${userProfile.height}cm
- Weight: ${userProfile.weight/10}kg
- Preferred Workout Types: ${userProfile.preferredWorkoutTypes?.join(', ') || 'Not specified'}
- Weekly Workout Goal: ${userProfile.weeklyWorkoutGoal} sessions

${progressHistory ? `**RECENT PROGRESS:**\n${JSON.stringify(progressHistory, null, 2)}` : ''}

**REQUIREMENTS:**
Create a structured 7-day workout plan that includes:
1. Daily workout descriptions with specific exercises
2. Sets, reps, duration, and rest periods
3. Progressive difficulty based on fitness level
4. Equipment needed (prefer bodyweight/minimal equipment)
5. Safety tips and form cues
6. Modifications for different fitness levels

**OUTPUT FORMAT:**
Please respond with a valid JSON object following this exact structure:
{
  "planName": "Descriptive plan name",
  "durationWeeks": 1,
  "difficulty": "${userProfile.fitnessLevel}",
  "workoutDays": [
    {
      "day": 1,
      "dayName": "Monday",
      "workoutType": "Upper Body Strength",
      "duration": 45,
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "8-12",
          "duration": null,
          "rest": "60 seconds",
          "instructions": "Keep core tight, full range of motion",
          "modifications": {
            "beginner": "Knee push-ups",
            "advanced": "Diamond push-ups"
          }
        }
      ],
      "equipment": ["None", "Yoga mat"],
      "warmup": "5 minutes arm circles and light stretching",
      "cooldown": "5 minutes upper body stretches"
    }
  ],
  "nutritionTips": "Brief nutrition advice",
  "safetyNotes": "Important safety considerations"
}

Make sure the response is ONLY the JSON object, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse as JSON
      try {
        const workoutPlan = JSON.parse(text);
        return {
          success: true,
          data: workoutPlan,
          provider: 'gemini'
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError);
        return {
          success: false,
          error: 'Invalid JSON response from Gemini',
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Generate personalized nutrition plan using Gemini
   */
  async generateNutritionPlan(userProfile, nutritionGoals = {}) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI is not available. Please check your API key.');
    }

    const prompt = `You are a certified nutritionist. Create a personalized daily nutrition plan for this user:

**USER PROFILE:**
- Age: ${userProfile.age} years
- Height: ${userProfile.height}cm  
- Weight: ${userProfile.weight/10}kg
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}

**NUTRITION GOALS:**
- Target Calories: ${nutritionGoals.targetCalories || 'Calculate based on profile'}
- Protein Goal: ${nutritionGoals.proteinGoal || 'Calculate based on goals'}
- Carb Preference: ${nutritionGoals.carbPreference || 'Moderate'}
- Fat Preference: ${nutritionGoals.fatPreference || 'Healthy fats'}

**REQUIREMENTS:**
Create a comprehensive nutrition plan including:
1. Daily calorie and macro targets
2. Meal timing and portions
3. Specific food recommendations
4. Hydration guidelines
5. Pre/post workout nutrition
6. Supplement recommendations (if appropriate)

**OUTPUT FORMAT:**
Respond with ONLY a JSON object in this exact format:
{
  "planName": "Personalized Nutrition Plan",
  "dailyTargets": {
    "calories": 2000,
    "protein": 150,
    "carbs": 200,
    "fats": 67,
    "fiber": 25,
    "water": 2500
  },
  "meals": [
    {
      "mealType": "Breakfast",
      "time": "7:00 AM",
      "calories": 400,
      "foods": [
        {
          "name": "Oatmeal with berries",
          "portion": "1 cup",
          "calories": 300,
          "protein": 10,
          "carbs": 54,
          "fats": 6
        }
      ],
      "tips": "Eat within 1 hour of waking"
    }
  ],
  "hydrationPlan": {
    "dailyWater": "2.5-3 liters",
    "timing": "Glass every hour",
    "preworkout": "500ml 1-2 hours before",
    "postworkout": "150% of fluid lost during exercise"
  },
  "supplementRecommendations": ["Vitamin D3", "Omega-3"],
  "mealTiming": {
    "preworkout": "Light snack 1-2 hours before",
    "postworkout": "Protein + carbs within 30 minutes"
  }
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const nutritionPlan = JSON.parse(text);
        return {
          success: true,
          data: nutritionPlan,
          provider: 'gemini'
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini nutrition response:', parseError);
        return {
          success: false,
          error: 'Invalid JSON response from Gemini',
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Gemini nutrition API error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Analyze workout form using Gemini (for future video analysis)
   */
  async analyzeWorkoutForm(exerciseName, description, issues = []) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI is not available. Please check your API key.');
    }

    const prompt = `You are a professional fitness trainer specializing in exercise form and injury prevention.

**EXERCISE:** ${exerciseName}
**USER DESCRIPTION:** ${description}
**REPORTED ISSUES:** ${issues.join(', ') || 'None reported'}

**TASK:**
Provide detailed form analysis and corrections for this exercise. Focus on:
1. Common form mistakes
2. Specific corrections needed
3. Safety considerations
4. Progressive improvements
5. Alternative exercises if needed

**OUTPUT FORMAT:**
Respond with ONLY a JSON object:
{
  "exerciseName": "${exerciseName}",
  "overallAssessment": "Good/Needs Improvement/Poor",
  "formCorrections": [
    {
      "issue": "Specific form problem",
      "correction": "How to fix it",
      "priority": "High/Medium/Low"
    }
  ],
  "safetyNotes": ["Safety tip 1", "Safety tip 2"],
  "alternatives": [
    {
      "name": "Alternative exercise",
      "reason": "Why this alternative is better",
      "difficulty": "Easier/Same/Harder"
    }
  ],
  "progressionTips": ["How to improve over time"],
  "commonMistakes": ["Mistake 1", "Mistake 2"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const analysis = JSON.parse(text);
        return {
          success: true,
          data: analysis,
          provider: 'gemini'
        };
      } catch (parseError) {
        return {
          success: false,
          error: 'Invalid JSON response from Gemini',
          rawResponse: text
        };
      }
    } catch (error) {
      console.error('Gemini form analysis error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Get motivational coaching message
   */
  async getMotivationalMessage(userProfile, progressData, context = '') {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI is not available. Please check your API key.');
    }

    const prompt = `You are an encouraging and motivational fitness coach. Create a personalized motivational message for this user:

**USER:** ${userProfile.fitnessLevel} level, goals: ${userProfile.goals}
**RECENT PROGRESS:** ${JSON.stringify(progressData)}
**CONTEXT:** ${context}

Create a brief, encouraging message (2-3 sentences) that:
1. Acknowledges their effort
2. Highlights progress or provides motivation
3. Gives a specific actionable tip
4. Maintains a positive, supportive tone

Keep it personal and specific to their situation. Don't use generic motivational quotes.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      return {
        success: true,
        message: text,
        provider: 'gemini'
      };
    } catch (error) {
      console.error('Gemini motivation error:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiAIService();