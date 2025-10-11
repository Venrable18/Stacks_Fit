# 🏃‍♂️ StacksFit - Revolutionary Blockchain Fitness dApp

**The Future of Fitness is Here!** StacksFit is a cutting-edge decentralized fitness application built on the Stacks blockchain, combining AI-powered coaching, NFT achievements, and social features to revolutionize your fitness journey.

![StacksFit Dashboard](./Assets/Screenshot%202025-10-02%20at%2011.31.39%20pm.png)

## ✨ Key Features

### 🔗 **Blockchain Integration**
- **Stacks Wallet Connection**: Seamless integration with Hiro Wallet and other Stacks wallets
- **Smart Contract Powered**: All fitness data and achievements stored immutably on-chain
- **Contract Address**: `STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E.fitness` (Testnet)

### 🤖 **AI-Powered Coaching**
- **Intelligent Recommendations**: Personalized workout plans based on your fitness level
- **Real-time Analysis**: AI analyzes your progress and suggests optimizations
- **Interactive Chat**: Natural language interface with your personal AI fitness coach
- **Form Check Assistance**: AI-powered movement analysis and correction tips

### 🏆 **NFT Achievement System**
- **Blockchain Rewards**: Earn unique NFTs for fitness milestones
- **Collection Showcase**: Beautiful 3D gallery of your achievement badges
- **Rarity System**: Different tiers of achievements with varying rarity
- **Tradeable Assets**: NFTs can be traded on Stacks marketplaces

### 📊 **Advanced Analytics**
- **Progress Tracking**: Comprehensive fitness metrics and historical data
- **Visual Dashboards**: Beautiful charts and graphs powered by Recharts
- **Goal Setting**: AI-assisted target setting and progress monitoring
- **Streak Tracking**: Maintain consistency with gamified streak systems

### 👥 **Social Features**
- **Friend Connections**: Connect with other fitness enthusiasts
- **Challenges**: Create and participate in group fitness challenges
- **Leaderboards**: Weekly and monthly rankings with rewards
- **Community**: Share achievements and motivate each other

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful glassmorphic cards and components
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Layout**: Perfect experience on desktop, tablet, and mobile
- **Dark Theme**: Elegant dark theme with gradient accents
- **3D Elements**: Three.js powered 3D visualizations

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Recharts** for data visualization
- **Three.js** for 3D elements
- **Zustand** for state management

### Blockchain
- **Stacks Blockchain** for decentralized data storage
- **@stacks/connect** for wallet integration
- **@stacks/transactions** for contract interactions
- **Clarity Smart Contracts** for business logic

### AI Integration
- **RESTful API** endpoints for AI model communication
- **Real-time Chat** interface for coaching
- **Progress Analysis** algorithms
- **Recommendation Engine** for personalized content

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Hiro Wallet browser extension
- STX tokens for testnet transactions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Venrable18/Stacks_Fitness.git
   cd Stacks_Fitness/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Connect your wallet**
   - Install Hiro Wallet extension
   - Get testnet STX from [faucet](https://explorer.stacks.co/sandbox/faucet)
   - Connect wallet to start using StacksFit

## 📱 Usage Guide

### First Time Setup
1. **Connect Wallet**: Click "Connect Stacks Wallet" on the landing page
2. **Create Profile**: Set up your fitness profile with goals and preferences
3. **Explore Dashboard**: Navigate through different sections using the sidebar
4. **Start Tracking**: Begin logging your daily fitness activities

### Key Interactions

#### 🏠 **Dashboard Overview**
- View daily progress metrics (steps, calories, active time)
- Monitor weekly trends with interactive charts
- Check recent achievements and NFT rewards
- Get AI-powered insights and recommendations

#### 🧠 **AI Coach**
- Chat with your personal AI fitness coach
- Get customized workout plans
- Receive nutrition advice and meal suggestions
- Ask questions about form, technique, and progress

#### 🏆 **Achievements & NFTs**
- Browse your NFT collection of achievement badges
- View progress toward unlocking new achievements
- Showcase rare and valuable fitness NFTs
- Track collection completion percentage

#### 👥 **Social Hub**
- Connect with friends and fitness partners
- Create and join group challenges
- View community leaderboards
- Share achievements and motivate others

## 🔧 Smart Contract Integration

### Contract Functions

#### User Management
```clarity
;; Create user profile
(create-user-profile fitness-level goals height weight age...)

;; Update profile information
(update-user-profile new-goals new-targets...)
```

#### Progress Tracking
```clarity
;; Record daily fitness data
(record-daily-progress date steps calories active-time)

;; Log nutrition information
(log-nutrition date calories protein carbs fats)
```

#### Achievements & NFTs
```clarity
;; Mint achievement NFT
(mint-achievement-nft user achievement-type)

;; Transfer NFT
(transfer nft-id sender recipient)
```

#### Social Features
```clarity
;; Add friend connection
(add-friend friend-address)

;; Create group challenge
(create-challenge challenge-type target-value duration)
```

## 🎨 Design System

### Color Palette
```css
Primary: Blue (#3b82f6) - Progress, Activity
Secondary: Purple (#8b5cf6) - AI, Premium features  
Accent: Orange (#f97316) - Achievements, Energy
Success: Green (#22c55e) - Goals, Health
Warning: Yellow (#fbbf24) - Challenges, Attention
```

### Typography
- **Display**: Inter 900 (headings, hero text)
- **Body**: Inter 400-600 (content, UI text)
- **Mono**: JetBrains Mono (addresses, code)

### Components
- **Glass Cards**: Glassmorphic containers with blur effects
- **Gradient Buttons**: Multi-color gradient interactive elements
- **Progress Rings**: Circular progress indicators
- **Floating Elements**: Animated background decorations

## 🔐 Security Features

### Wallet Security
- **Non-custodial**: Users maintain full control of private keys
- **Secure Connections**: All interactions through encrypted channels
- **Permission-based**: Granular control over app permissions

### Data Privacy
- **On-chain Storage**: Fitness data stored securely on blockchain
- **User Consent**: Clear privacy controls and data usage transparency
- **Anonymization**: Personal data can be anonymized for analytics

## 🌐 Deployment

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Production
```bash
npm run build      # Create optimized build
npm run type-check # Verify TypeScript types
npm run lint       # Check code quality
```

### Environment Variables
```env
VITE_STACKS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E
VITE_CONTRACT_NAME=fitness
VITE_AI_API_URL=https://api.stacksfit.ai
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://stacksfit.app](https://stacksfit.app)
- **Smart Contract**: [Stacks Explorer](https://explorer.stacks.co/txid/...)
- **Documentation**: [https://docs.stacksfit.app](https://docs.stacksfit.app)
- **Discord Community**: [Join our Discord](https://discord.gg/stacksfit)

## 🙏 Acknowledgments

- **Stacks Foundation** for blockchain infrastructure
- **Hiro Systems** for developer tools and wallet
- **Clarity Language** for smart contract capabilities
- **Open Source Community** for amazing libraries and tools

---

**Built with ❤️ for the future of decentralized fitness**

*StacksFit - Where Blockchain Meets Fitness Innovation*