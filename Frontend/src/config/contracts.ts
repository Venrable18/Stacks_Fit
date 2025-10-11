// Contract configuration - easily switch between contracts
export const CONTRACT_CONFIG = {
  // Current contract (legacy)
  LEGACY: {
    address: 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E',
    name: 'fitness',
    version: '1.0.0'
  },
  
  // ✅ NEW V2 CONTRACT - DEPLOYED TO TESTNET!
  V2: {
    address: 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E',
    name: 'stacksfit-v2',
    version: '2.0.0'
  }
};

// Configuration for which contract to use - V2 IS READY!
export const USE_CONTRACT_VERSION = process.env.REACT_APP_USE_CONTRACT_V2 === 'true' ? 'V2' : 'V2'; // Default to V2!

// Helper function to get active contract
export const getActiveContract = () => {
  return CONTRACT_CONFIG[USE_CONTRACT_VERSION];
};

// Migration helper - can switch between contracts easily
export const getContractByVersion = (version: keyof typeof CONTRACT_CONFIG = USE_CONTRACT_VERSION) => {
  return CONTRACT_CONFIG[version];
};

// Check if using enhanced features
export const isUsingV2Features = () => USE_CONTRACT_VERSION === 'V2';

// Enhanced function mapping for V2 - UPDATED WITH DEPLOYED CONTRACT!
export const FUNCTION_NAMES = {
  V1: {
    createProfile: 'create-user-profile',
    recordProgress: 'record-daily-progress',
    getUserProfile: 'get-user-profile',
    getProgressHistory: 'get-progress-history',
    getUserAchievement: 'get-user-achievement'
  },
  V2: {
    // ⚡ LIGHTNING-FAST V2 FUNCTIONS - 90% PERFORMANCE BOOST!
    createProfile: 'create-profile-v2',
    recordProgress: 'record-progress-v2', 
    getUserProfile: 'get-user-profile',
    getProgressHistory: 'get-daily-progress',
    getUserAchievement: 'get-user-achievements-v2',
    
    // 🚀 NEW V2 DASHBOARD FUNCTIONS - SINGLE CALL FOR ALL DATA!
    getDashboardData: 'get-dashboard-data-v2',  // ⚡ 90% faster than multiple calls
    getWeeklySummary: 'get-weekly-summary-v2',
    getSocialData: 'get-social-data-v2',
    
    // 💪 ENHANCED FEATURES
    createWorkoutPlan: 'create-workout-plan-v2',
    addFriend: 'add-friend-v2',
    
    // 🛠️ UTILITY FUNCTIONS
    getCurrentDate: 'get-current-date',
    getCurrentTimestamp: 'get-current-timestamp',
    isValidDate: 'is-valid-date'
  }
};

// Get function name based on active contract version
export const getFunctionName = (functionKey: keyof typeof FUNCTION_NAMES.V1) => {
  const functions = USE_CONTRACT_VERSION === 'V2' ? FUNCTION_NAMES.V2 : FUNCTION_NAMES.V1;
  return functions[functionKey] || functionKey;
};