#!/bin/bash

echo "Testing StacksFit AI Middleware..."
echo "=================================="

# Health check
echo "1. Health Check:"
curl -s http://localhost:3002/api/health | jq . 2>/dev/null || echo "Health endpoint failed"

echo -e "\n2. Detailed Health Check:"
curl -s http://localhost:3002/api/health/detailed | jq . 2>/dev/null || echo "Detailed health endpoint failed"

echo -e "\n3. Testing AI Workout Plan Generation:"
curl -s -X POST http://localhost:3002/api/ai/workout-plan \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "fitnessLevel": "intermediate",
      "goals": "muscle_gain",
      "age": 28,
      "height": 175,
      "weight": 705,
      "preferredWorkoutTypes": ["strength", "cardio"],
      "weeklyWorkoutGoal": 5
    }
  }' | jq . 2>/dev/null || echo "Workout plan generation failed"

echo -e "\nAI Middleware test completed!"