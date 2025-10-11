import Joi from 'joi';

// Validation schemas
const userProfileSchema = Joi.object({
  fitnessLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  goals: Joi.string().max(50).required(),
  age: Joi.number().min(13).max(120).required(),
  height: Joi.number().min(100).max(250).required(), // cm
  weight: Joi.number().min(300).max(3000).required(), // kg * 10 for decimals
  preferredWorkoutTypes: Joi.array().items(Joi.string().max(30)).max(5),
  weeklyWorkoutGoal: Joi.number().min(1).max(14).required(),
});

const workoutRequestSchema = Joi.object({
  userProfile: userProfileSchema.required(),
  progressHistory: Joi.array().items(Joi.object()).optional(),
  preferences: Joi.object().optional(),
});

const nutritionRequestSchema = Joi.object({
  userProfile: userProfileSchema.required(),
  nutritionGoals: Joi.object({
    targetCalories: Joi.number().min(800).max(5000).required(),
    proteinRatio: Joi.number().min(0.1).max(0.5).optional(),
    carbRatio: Joi.number().min(0.2).max(0.7).optional(),
    fatRatio: Joi.number().min(0.1).max(0.5).optional(),
  }).required(),
  dietaryRestrictions: Joi.array().items(Joi.string().max(30)).max(10),
  currentNutrition: Joi.object().optional(),
});

const formAnalysisRequestSchema = Joi.object({
  exerciseType: Joi.string().max(50).required(),
  videoData: Joi.string().optional(), // Base64 encoded video or URL
  userProfile: userProfileSchema.required(),
});

// Validation middleware functions
export const validateWorkoutRequest = (req, res, next) => {
  const { error } = workoutRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }
  next();
};

export const validateNutritionRequest = (req, res, next) => {
  const { error } = nutritionRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }
  next();
};

export const validateFormAnalysisRequest = (req, res, next) => {
  const { error } = formAnalysisRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }
  next();
};

// General validation helper
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    next();
  };
};