import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Send, 
  Mic, 
  Camera, 
  Dumbbell, 
  Apple, 
  Target,
  TrendingUp
} from 'lucide-react';
import { frontendAIService } from '../services/frontendAIService';
import { useStacksStore } from '../store/stacksStore';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

// Typing dots animation component
const TypingDots: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-morphism p-4 rounded-2xl max-w-xs"
    >
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300 text-sm font-medium">AI is thinking</span>
        </div>
        <div className="flex space-x-1 ml-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hey there, fitness warrior! 🚀 I'm your AI coach, ready to help you crush your goals. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: [
        "Create a workout plan",
        "Analyze my progress",
        "Nutrition advice",
        "Form check"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { 
      icon: Dumbbell, 
      title: "Workout Plan", 
      description: "AI-generated personalized workout",
      color: "from-blue-500 to-blue-600" 
    },
    { 
      icon: Apple, 
      title: "Nutrition", 
      description: "Smart meal recommendations",
      color: "from-green-500 to-green-600" 
    },
    { 
      icon: Target, 
      title: "Goal Setting", 
      description: "Optimize your fitness targets",
      color: "from-purple-500 to-purple-600" 
    },
    { 
      icon: TrendingUp, 
      title: "Progress Analysis", 
      description: "AI insights on your journey",
      color: "from-orange-500 to-orange-600" 
    }
  ];

  const { userProfile } = useStacksStore();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true); // Show typing animation

    try {
      // Convert userProfile to the format expected by AI service
      const aiUserProfile = userProfile ? {
        fitnessLevel: userProfile.fitnessLevel,
        goals: userProfile.goals,
        age: userProfile.age,
        height: userProfile.height,
        weight: Math.round(userProfile.weight * 10), // Convert to format expected by API
        preferredWorkoutTypes: userProfile.preferredWorkoutTypes,
        weeklyWorkoutGoal: userProfile.weeklyWorkoutGoal
      } : undefined;

      // Call real AI service
      const aiResponse = await frontendAIService.chat(userMessage.content, aiUserProfile || {
        fitnessLevel: 'beginner',
        goals: 'general_fitness',
        age: 25,
        height: 170,
        weight: 700,
        weeklyWorkoutGoal: 3
      });
      
      // Add minimum delay to show typing animation (minimum 1.5 seconds)
      const minTypingTime = 1500;
      await new Promise(resolve => setTimeout(resolve, minTypingTime));
      
      let responseContent = '';
      let suggestions: string[] = [];

      // The new service returns a simple string for chat
      if (typeof aiResponse === 'string') {
        responseContent = aiResponse;
        suggestions = [
          "Create a workout plan",
          "Get nutrition advice", 
          "Track my progress",
          "Find motivation"
        ];
      } else {
        // Fallback to mock response if something goes wrong
        responseContent = generateAIResponse(userMessage.content);
        suggestions = generateSuggestions(userMessage.content);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responseContent,
        timestamp: new Date(),
        suggestions: suggestions
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response failed:', error);
      
      // Fallback to mock response on error
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting to my AI brain right now 🤖 But I can still help! " + generateAIResponse(userMessage.content),
        timestamp: new Date(),
        suggestions: generateSuggestions(userMessage.content)
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false); // Hide typing animation
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('workout') || input.includes('exercise')) {
      return "Based on your fitness profile, I recommend a balanced strength and cardio routine. Here's what I suggest: 3x strength training per week focusing on compound movements, 2x cardio sessions, and 1x active recovery. Would you like me to create a detailed weekly plan? 💪";
    }
    
    if (input.includes('nutrition') || input.includes('food') || input.includes('diet')) {
      return "Great question! For your goals, I recommend a balanced approach: 40% carbs, 30% protein, 30% fats. Focus on whole foods, stay hydrated, and eat protein within 30 minutes post-workout. Your current calorie target looks good at 2,500. Want specific meal suggestions? 🍎";
    }
    
    if (input.includes('progress') || input.includes('analytics')) {
      return "Your progress is looking fantastic! 📈 I can see consistent improvement in your daily steps (+15% vs last month) and your workout consistency is at 85%. Areas for improvement: hydration and sleep quality. Shall we dive deeper into your specific metrics?";
    }
    
    return "That's a great question! I'm here to help optimize your fitness journey using AI-powered insights. Whether it's personalized workouts, nutrition planning, or progress analysis, I've got you covered. What specific aspect would you like to explore? 🤖";
  };

  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('workout')) {
      return ["Show me upper body routine", "Create cardio plan", "Suggest recovery exercises"];
    }
    
    if (input.includes('nutrition')) {
      return ["Meal prep ideas", "Protein requirements", "Hydration tracking"];
    }
    
    return ["Analyze my week", "Set new goals", "Form check tips", "Motivation boost"];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleQuickAction = (action: any) => {
    const message = `Help me with ${action.title.toLowerCase()}`;
    setInputValue(message);
    // Auto-send the message for quick actions
    setTimeout(() => {
      if (document.querySelector('[data-send-button]')) {
        (document.querySelector('[data-send-button]') as HTMLButtonElement)?.click();
      }
    }, 100);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-white/10"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Fitness Coach</h2>
            <p className="text-gray-400">Powered by advanced ML algorithms</p>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 border-b border-white/10"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action)}
                className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white text-left group transition-all duration-300 hover:shadow-lg`}
              >
                <Icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Brain size={16} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium">AI Coach</span>
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'glass-morphism text-gray-100'
                }`}>
                  <p className="leading-relaxed">{message.content}</p>
                </div>

                {message.suggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-sm bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors text-gray-300"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Animation */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-400 font-medium">AI Coach</span>
                </div>
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 border-t border-white/10"
      >
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask your AI coach anything about fitness, nutrition, or your progress..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Mic size={18} />
              </button>
              <button className="p-1 text-gray-400 hover:text-white transition-colors">
                <Camera size={18} />
              </button>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            data-send-button
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AICoach;