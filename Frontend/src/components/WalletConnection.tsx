import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Zap, TrendingUp } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

const WalletConnection: React.FC = () => {
  const { connectWallet, isLoading } = useStacksStore();

  const features = [
    {
      icon: Shield,
      title: 'Secure & Decentralized',
      description: 'Your fitness data is stored securely on the Stacks blockchain'
    },
    {
      icon: Zap,
      title: 'AI-Powered Coaching',
      description: 'Get personalized workout plans and nutrition advice from our AI'
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your fitness journey with detailed analytics and insights'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                StacksFit
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              The Future of Fitness is Here.
              <br />
              <span className="text-lg text-gray-400">
                Track your progress, earn NFT rewards, and get AI-powered coaching on the blockchain.
              </span>
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('🔗 Connect wallet button clicked');
                connectWallet();
              }}
              disabled={isLoading}
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center justify-center">
                <Wallet className="mr-3" size={24} />
                {isLoading ? 'Connecting...' : 'Connect Stacks Wallet'}
              </div>
            </motion.button>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-sm text-gray-500 mt-4"
            >
              New to Stacks? <a href="https://www.hiro.so/wallet" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Get Hiro Wallet</a>
            </motion.p>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                className="glass-morphism p-6 rounded-2xl card-hover"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 mt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50M+</div>
                <div className="text-sm text-gray-400">Steps Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">5K+</div>
                <div className="text-sm text-gray-400">NFTs Earned</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full opacity-20 blur-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;