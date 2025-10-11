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
// import { useStacksStore } from '../store/stacksStore'; // For future personalization

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
      content: "🔥 **WELCOME TO YOUR TRANSFORMATION!** 🔥\n\nHey there, future fitness legend! I'm your AI Coach, and I'm here to guide you through every rep, every meal, and every milestone on your journey to greatness!\n\n**I'm equipped with:**\n• Personalized workout routines\n• Real-time form coaching\n• Smart nutrition guidance\n• Progress analytics & motivation\n\n**Ready to unlock your potential?** Let's start building the strongest, healthiest version of YOU! 💪\n\nWhat's your fitness goal today?",
      timestamp: new Date(),
      suggestions: [
        "Start a workout routine",
        "I need motivation",
        "Plan my nutrition",
        "Check my progress"
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

  // Note: Can integrate with useStacksStore() for personalized responses

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
      // Simulate realistic AI thinking time (3-5 seconds)
      const thinkingTime = 3000 + Math.random() * 2000; // 3-5 seconds
      
      // Show typing animation for realistic duration
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      // Generate contextual AI response based on user input
      let aiResponse = generateAIResponse(userMessage.content);
      
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
    
    // Workout routine responses
    if (input.includes('workout') || input.includes('exercise') || input.includes('routine')) {
      const workoutResponses = [
        "Perfect! Let's create a personalized workout routine just for you! 🏋️‍♂️\n\nBased on your profile, I'm designing a progressive 4-week program:\n\n**Week 1-2: Foundation Building**\n• 3x full-body workouts\n• Focus on form and movement patterns\n• 45-60 minutes per session\n\n**Week 3-4: Intensity Boost**\n• Split routines (Upper/Lower)\n• Progressive overload\n• Add cardio intervals\n\nReady to start with Day 1? I'll guide you through each exercise! 💪",
        
        "Excellent choice! Time to get those endorphins flowing! 🔥\n\n**Today's Workout Menu:**\n\n🎯 **Option 1:** HIIT Cardio Blast (20 mins)\n🎯 **Option 2:** Strength Circuit (30 mins)\n🎯 **Option 3:** Yoga Flow (25 mins)\n🎯 **Option 4:** Custom Routine\n\nWhat's calling to you today? I'll provide step-by-step guidance with proper form cues and timing! Which option sounds most appealing?",
        
        "Time to unleash your inner athlete! 🚀\n\nI'm sensing you're ready for something challenging. How about we try my **'Metabolic Meltdown'** routine?\n\n**The Plan:**\n• 5-minute dynamic warm-up\n• 4 rounds of compound movements\n• Active recovery between sets\n• Cool-down and stretching\n\nThis will boost your metabolism for hours post-workout! Should we jump in, or would you prefer something different?"
      ];
      return workoutResponses[Math.floor(Math.random() * workoutResponses.length)];
    }
    
    // Start workout responses
    if (input.includes('start') || input.includes('begin') || input.includes('ready') || input.includes('day 1')) {
      return "🔥 **LET'S DO THIS!** 🔥\n\n**WARM-UP PHASE** (5 minutes)\n\n1️⃣ **Arm Circles** - 30 seconds\n   • Forward circles, then backward\n   • Keep shoulders relaxed\n\n2️⃣ **Leg Swings** - 30 seconds each leg\n   • Hold wall for balance\n   • Front to back, then side to side\n\n3️⃣ **Jumping Jacks** - 1 minute\n   • Land softly, engage core\n\n4️⃣ **Bodyweight Squats** - 1 minute\n   • Focus on form over speed\n\n5️⃣ **High Knees** - 1 minute\n   • Drive knees up, pump arms\n\nReady? Type 'warmed up' when you complete this! 💪";
    }
    
    // Warmed up response
    if (input.includes('warmed up') || input.includes('warm up done') || input.includes('finished warm')) {
      return "🔥 **AMAZING WORK!** Now you're primed and ready! 🔥\n\n**MAIN WORKOUT** - Circuit Training (20 minutes)\n\n**Round 1** (3 sets, 45 seconds work / 15 seconds rest)\n\n💪 **Exercise 1: Push-ups**\n• Keep straight line from head to heels\n• Lower chest to floor, push up explosively\n• Modify on knees if needed\n\n⏱️ **Ready?** Do push-ups for 45 seconds, then rest 15 seconds.\n\nType 'done push-ups' when you finish this set! I'll be timing you! ⏰";
    }
    
    // Exercise completion responses
    if (input.includes('done push') || input.includes('finished push')) {
      return "🎉 **CRUSHING IT!** Those push-ups looked solid! 🎉\n\n**Exercise 2: Bodyweight Squats**\n• Feet shoulder-width apart\n• Lower like sitting in a chair\n• Keep chest up, knees track over toes\n• Drive through heels to stand\n\n⏱️ **45 seconds of squats, GO!**\n\nFocus on that mind-muscle connection! Type 'done squats' when complete! 🔥";
    }
    
    if (input.includes('done squat') || input.includes('finished squat')) {
      return "🚀 **PHENOMENAL!** You're on fire! 🚀\n\n**Exercise 3: Plank Hold**\n• Forearms on ground, body in straight line\n• Engage core, breathe steadily\n• Don't let hips sag or pike up\n• Think 'steel rod' from head to heels\n\n⏱️ **Hold for 45 seconds!**\n\nThis is where mental toughness kicks in! You've got this! Type 'done plank' when finished! 💪";
    }
    
    if (input.includes('done plank') || input.includes('finished plank')) {
      return "🏆 **INCREDIBLE STRENGTH!** Round 1 COMPLETE! 🏆\n\n**Rest Break** (60 seconds)\n• Walk around, shake out your muscles\n• Take deep breaths\n• Stay hydrated 💧\n\nThat was just Round 1 of 3! Your body is adapting and getting stronger with each rep!\n\n**Round 2** starts in 60 seconds. Feeling good to continue? Type 'round 2' when ready! 🔥";
    }
    
    // Nutrition responses
    if (input.includes('nutrition') || input.includes('food') || input.includes('diet') || input.includes('meal')) {
      const nutritionResponses = [
        "🍎 **FUEL YOUR FITNESS!** 🍎\n\nNutrition is 70% of your results! Here's your personalized nutrition game plan:\n\n**Pre-Workout (30-60 mins before):**\n• Banana + almond butter\n• Oatmeal with berries\n• Green tea for natural energy\n\n**Post-Workout (within 30 mins):**\n• Protein shake + fruit\n• Greek yogurt with granola\n• Chocolate milk (seriously!)\n\n**Daily Targets:**\n• Protein: 1g per lb bodyweight\n• Water: Half your bodyweight in ounces\n• 5-7 servings fruits/vegetables\n\nWhat's your biggest nutrition challenge?",
        
        "🥗 **LET'S OPTIMIZE YOUR NUTRITION!** 🥗\n\nI'm creating your **Smart Meal Strategy**:\n\n**The 80/20 Rule:**\n• 80% whole, unprocessed foods\n• 20% foods you love (balance!)\n\n**Meal Timing Magic:**\n• Eat protein with every meal\n• Carbs around workouts\n• Healthy fats for hormone production\n\n**Quick Meal Ideas:**\n🥙 **Breakfast:** Protein smoothie bowl\n🍗 **Lunch:** Grilled chicken salad\n🐟 **Dinner:** Salmon with sweet potato\n\nNeed specific recipes or meal prep tips?"
      ];
      return nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)];
    }
    
    // Progress and motivation responses
    if (input.includes('progress') || input.includes('analytics') || input.includes('result')) {
      return "📈 **YOUR PROGRESS IS INSPIRING!** 📈\n\n**This Week's Wins:**\n✅ Consistency: 6/7 workout days\n✅ Strength gains: +15% in compound lifts\n✅ Endurance: Running 2 mins longer\n✅ Recovery: Better sleep quality\n\n**Key Insights:**\n🎯 Your Monday workouts are strongest\n🎯 Hydration improved performance by 12%\n🎯 Rest days boost next-day energy\n\n**Next Week's Focus:**\n• Increase workout intensity by 5%\n• Add 2 new exercises for variety\n• Track protein intake more consistently\n\nYour transformation is happening! What feels different in your body?";
    }
    
    // Motivation and encouragement
    if (input.includes('tired') || input.includes('can\'t') || input.includes('hard') || input.includes('difficult')) {
      const motivationResponses = [
        "💪 **I HEAR YOU, BUT I BELIEVE IN YOU!** 💪\n\nFatigue is just weakness leaving your body! Here's what we're going to do:\n\n**Energy Reset Protocol:**\n1. Take 5 deep breaths\n2. Drink some water 💧\n3. Think about WHY you started\n4. Remember: You're stronger than you think\n\n**Modified Options:**\n• Drop to 30 seconds instead of 45\n• Reduce intensity by 20%\n• Focus on perfect form over speed\n\nEvery rep counts! Even 50% effort is 100% more than doing nothing! Ready to push through? You've got this! 🔥",
        
        "🔥 **THIS IS WHERE CHAMPIONS ARE MADE!** 🔥\n\nThe discomfort you feel? That's your body adapting, growing stronger, becoming unstoppable!\n\n**Remember:**\n• Your future self is counting on you\n• Discipline weighs ounces, regret weighs tons\n• You've overcome challenges before\n\n**Quick Energy Boost:**\n• 10 jumping jacks\n• Positive self-talk\n• Visualize crushing your goals\n\nYou came this far - don't stop now! What would the strongest version of yourself do right now?"
      ];
      return motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
    }
    
    // Default response with personality
    const defaultResponses = [
      "🤖 **AI COACH ACTIVATED!** 🤖\n\nI'm here to transform your fitness journey! I can help you with:\n\n🏋️ **Personalized Workouts** - Custom routines\n🍎 **Smart Nutrition** - Meal planning & timing\n📊 **Progress Analytics** - Data-driven insights\n💪 **Live Coaching** - Real-time form feedback\n🎯 **Goal Setting** - SMART fitness objectives\n\nWhat's your fitness goal today? Let's make it happen!",
      
      "🚀 **READY TO LEVEL UP?** 🚀\n\nI'm your AI fitness companion, powered by advanced algorithms and a passion for your success!\n\n**I specialize in:**\n• Creating workouts that adapt to YOU\n• Nutrition strategies that actually work\n• Motivation when you need it most\n• Tracking progress that matters\n\nThink of me as your pocket personal trainer! What would you like to work on first?",
      
      "💫 **YOUR FITNESS JOURNEY STARTS NOW!** 💫\n\nI've analyzed thousands of fitness transformations to bring you the most effective strategies!\n\n**Today's Options:**\n🎯 Start a workout routine\n🎯 Plan your nutrition\n🎯 Set SMART goals\n🎯 Review your progress\n🎯 Get motivated!\n\nI'm here 24/7 to support, guide, and celebrate every win with you! What sounds exciting to you?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('workout') || input.includes('exercise') || input.includes('routine')) {
      return ["Start Day 1 workout", "Show me HIIT routine", "Upper body focus", "Quick 15-min session"];
    }
    
    if (input.includes('start') || input.includes('begin') || input.includes('ready')) {
      return ["I'm warmed up!", "Skip to main workout", "Modify for beginner", "Need motivation"];
    }
    
    if (input.includes('warmed up') || input.includes('done push') || input.includes('done squat')) {
      return ["Ready for next exercise", "Need a break", "Increase intensity", "Form check please"];
    }
    
    if (input.includes('nutrition') || input.includes('food')) {
      return ["Pre-workout meal ideas", "Post-workout recovery", "Meal prep guide", "Healthy snack options"];
    }
    
    if (input.includes('progress') || input.includes('analytics')) {
      return ["Show weekly summary", "Compare to last month", "Set new challenges", "Celebrate achievements"];
    }
    
    if (input.includes('tired') || input.includes('difficult') || input.includes('hard')) {
      return ["Modify exercises", "Give me motivation", "Quick energy boost", "Different workout"];
    }
    
    // Default suggestions based on common user needs
    return ["Start a workout", "Plan my nutrition", "Check my progress", "I need motivation"];
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