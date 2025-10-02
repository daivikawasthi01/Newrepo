import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WellnessContext = createContext();

// Initial state
const initialState = {
  user: {
    name: 'Wellness Warrior',
    level: 1,
    experience: 0,
    streak: 0,
    totalBalance: 0,
    achievements: [],
    joinDate: new Date().toISOString(),
  },
  gems: [
    { 
      id: 'mind', 
      name: 'Mind Gem', 
      icon: '🧠', 
      status: 'bright', 
      description: 'Mental Clarity & Focus',
      color: '#4A90E2',
      power: 80,
      streak: 1,
      lastCompleted: new Date().toISOString(),
      quests: [
        { id: 'meditation', name: 'Daily Meditation', completed: false, points: 20 },
        { id: 'journal', name: 'Gratitude Journal', completed: false, points: 15 },
        { id: 'reading', name: 'Read for 10 minutes', completed: false, points: 10 }
      ]
    },
    { 
      id: 'body', 
      name: 'Body Gem', 
      icon: '💪', 
      status: 'dim', 
      description: 'Physical Health & Energy',
      color: '#8E44AD',
      power: 0,
      streak: 0,
      lastCompleted: null,
      quests: [
        { id: 'exercise', name: 'Workout Session', completed: false, points: 25 },
        { id: 'steps', name: 'Walk 8,000 steps', completed: false, points: 20 },
        { id: 'water', name: 'Drink 8 glasses of water', completed: false, points: 15 }
      ]
    },
    { 
      id: 'soul', 
      name: 'Soul Gem', 
      icon: '❤️', 
      status: 'dim', 
      description: 'Social & Emotional Connection',
      color: '#E67E22',
      power: 0,
      streak: 0,
      lastCompleted: null,
      quests: [
        { id: 'connect', name: 'Connect with a friend', completed: false, points: 20 },
        { id: 'community', name: 'Join community challenge', completed: false, points: 25 },
        { id: 'kindness', name: 'Perform act of kindness', completed: false, points: 15 }
      ]
    },
    { 
      id: 'wealth', 
      name: 'Wealth Gem', 
      icon: '💰', 
      status: 'dim', 
      description: 'Financial Wellness & Planning',
      color: '#27AE60',
      power: 0,
      streak: 0,
      lastCompleted: null,
      quests: [
        { id: 'budget', name: 'Review monthly budget', completed: false, points: 20 },
        { id: 'save', name: 'Add to savings goal', completed: false, points: 25 },
        { id: 'learn', name: 'Read financial article', completed: false, points: 15 }
      ]
    },
    { 
      id: 'purpose', 
      name: 'Purpose Gem', 
      icon: '🎯', 
      status: 'dim', 
      description: 'Personal Growth & Purpose',
      color: '#E74C3C',
      power: 0,
      streak: 0,
      lastCompleted: null,
      quests: [
        { id: 'goal', name: 'Work on personal goal', completed: false, points: 25 },
        { id: 'skill', name: 'Learn new skill', completed: false, points: 20 },
        { id: 'reflect', name: 'Self-reflection time', completed: false, points: 15 }
      ]
    }
  ],
  dailyQuests: [],
  notifications: [],
  achievements: [
    { id: 'first_gem', name: 'First Light', description: 'Activate your first gem', unlocked: true },
    { id: 'triple_threat', name: 'Triple Threat', description: 'Keep 3 gems active simultaneously', unlocked: false },
    { id: 'perfect_balance', name: 'Perfect Balance', description: 'Achieve 100% wellness balance', unlocked: false },
    { id: 'week_streak', name: 'Dedication', description: 'Maintain gems for 7 consecutive days', unlocked: false },
    { id: 'social_butterfly', name: 'Social Butterfly', description: 'Complete 10 Soul Gem quests', unlocked: false }
  ],
  stats: {
    totalQuestsCompleted: 0,
    longestStreak: 0,
    gemsActivated: 1,
    daysActive: 1
  }
};

// Reducer function
function wellnessReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_QUEST':
      return {
        ...state,
        gems: state.gems.map(gem => {
          if (gem.id === action.payload.gemId) {
            const updatedGem = {
              ...gem,
              status: 'bright',
              power: Math.min(100, gem.power + 20),
              lastCompleted: new Date().toISOString(),
              quests: gem.quests.map(quest => 
                quest.id === action.payload.questId 
                  ? { ...quest, completed: true }
                  : quest
              )
            };
            return updatedGem;
          }
          return gem;
        }),
        user: {
          ...state.user,
          experience: state.user.experience + action.payload.points
        },
        stats: {
          ...state.stats,
          totalQuestsCompleted: state.stats.totalQuestsCompleted + 1
        }
      };

    case 'SIMULATE_DECAY':
      return {
        ...state,
        gems: state.gems.map(gem => {
          // Apply interconnectivity logic
          let newStatus = gem.status;
          let newPower = Math.max(0, gem.power - 10);

          // Interconnectivity rules
          if (gem.id === 'mind') {
            const bodyGem = state.gems.find(g => g.id === 'body');
            if (bodyGem.status === 'dim') {
              newStatus = 'draining';
              newPower = Math.max(0, gem.power - 20);
            }
          }

          return {
            ...gem,
            status: newPower === 0 ? 'dim' : newStatus,
            power: newPower
          };
        })
      };

    case 'RESET_GAUNTLET':
      return {
        ...initialState,
        user: {
          ...state.user,
          experience: state.user.experience // Keep experience
        }
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            id: Date.now(),
            message: action.payload.message,
            type: action.payload.type || 'info',
            timestamp: new Date().toISOString()
          },
          ...state.notifications.slice(0, 4) // Keep only 5 notifications
        ]
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload.achievementId
            ? { ...achievement, unlocked: true }
            : achievement
        )
      };

    default:
      return state;
  }
}

// Context Provider Component
export const WellnessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wellnessReducer, initialState);

  // Calculate wellness balance
  const wellnessBalance = () => {
    const activeGems = state.gems.filter(gem => gem.status === 'bright').length;
    return Math.round((activeGems / state.gems.length) * 100);
  };

  // Check for achievements
  useEffect(() => {
    const balance = wellnessBalance();
    const activeGems = state.gems.filter(gem => gem.status === 'bright').length;

    // Check for Perfect Balance achievement
    if (balance === 100 && !state.achievements.find(a => a.id === 'perfect_balance').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { achievementId: 'perfect_balance' } });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { 
          message: '🏆 Achievement Unlocked: Perfect Balance!', 
          type: 'achievement' 
        } 
      });
    }

    // Check for Triple Threat achievement
    if (activeGems >= 3 && !state.achievements.find(a => a.id === 'triple_threat').unlocked) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { achievementId: 'triple_threat' } });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { 
          message: '🏆 Achievement Unlocked: Triple Threat!', 
          type: 'achievement' 
        } 
      });
    }
  }, [state.gems]);

  const contextValue = {
    state,
    dispatch,
    wellnessBalance,
    completeQuest: (gemId, questId, points) => {
      dispatch({ 
        type: 'COMPLETE_QUEST', 
        payload: { gemId, questId, points } 
      });
    },
    simulateDecay: () => {
      dispatch({ type: 'SIMULATE_DECAY' });
    },
    resetGauntlet: () => {
      dispatch({ type: 'RESET_GAUNTLET' });
    },
    addNotification: (message, type) => {
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { message, type } 
      });
    }
  };

  return (
    <WellnessContext.Provider value={contextValue}>
      {children}
    </WellnessContext.Provider>
  );
};

// Custom hook to use the context
export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};

export default WellnessContext;