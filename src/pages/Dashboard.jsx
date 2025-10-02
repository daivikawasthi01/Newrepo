import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Target, 
  Zap, 
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import GemCard from '../components/GemCard';
import InfinityStone from '../components/InfinityStone';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const { state, wellnessBalance, completeQuest } = useWellness();
  
  const todayQuests = state.gems.reduce((acc, gem) => {
    return acc + gem.quests.filter(quest => !quest.completed).length;
  }, 0);

  const completedQuests = state.gems.reduce((acc, gem) => {
    return acc + gem.quests.filter(quest => quest.completed).length;
  }, 0);

  const activeGems = state.gems.filter(gem => gem.status === 'bright').length;

  const handleStoneClick = (gem) => {
    if (gem.status !== 'bright') {
      // Complete a random quest for this gem
      const availableQuests = gem.quests.filter(quest => !quest.completed);
      if (availableQuests.length > 0) {
        const randomQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
        completeQuest(gem.id, randomQuest.id, randomQuest.points);
      }
    }
  };

  const quickStats = [
    {
      icon: Target,
      label: 'Wellness Balance',
      value: `${wellnessBalance()}%`,
      color: '#4A90E2',
      trend: '+5%'
    },
    {
      icon: Zap,
      label: 'Active Gems',
      value: `${activeGems}/5`,
      color: '#8E44AD',
      trend: '+2'
    },
    {
      icon: Calendar,
      label: 'Current Streak',
      value: `${state.user.streak} days`,
      color: '#E67E22',
      trend: 'New!'
    },
    {
      icon: Award,
      label: 'Total Experience',
      value: state.user.experience,
      color: '#27AE60',
      trend: '+125'
    }
  ];

  const recentAchievements = state.achievements
    .filter(achievement => achievement.unlocked)
    .slice(0, 3);

  return (
    <div className="dashboard">
      {/* Cosmic Background Effects */}
      <div className="cosmic-background">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="cosmic-particle"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="dashboard-header">
        <motion.div
          className="hero-welcome"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-info">
            <motion.div 
              className="hero-avatar"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              style={{ '--hero-color': user?.avatar?.color || '#4A90E2' }}
            >
              <span className="hero-emoji">{user?.avatar?.emoji || '⚡'}</span>
              <div className="hero-aura"></div>
            </motion.div>
            <div className="hero-text">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Welcome back, {user?.name || state.user.name}! 
                <motion.span 
                  className="hero-title"
                  animate={{ 
                    textShadow: [
                      '0 0 5px currentColor',
                      '0 0 15px currentColor', 
                      '0 0 5px currentColor'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {user?.avatar?.name || 'Wellness Hero'}
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Harness the power of the Infinity Stones for ultimate wellness
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="daily-motivation"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="motivation-card">
            <div className="motivation-icon">🌟</div>
            <div className="motivation-content">
              <h3>Today's Inspiration</h3>
              <p>"Balance is not something you find, it's something you create."</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="quick-stats">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              <span className="stat-trend" style={{ color: stat.color }}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <motion.div 
          className="infinity-gauntlet-showcase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="section-header">
            <motion.h2
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚡ Your Infinity Stones Collection ⚡
            </motion.h2>
            <p>Click on inactive stones to activate their power</p>
          </div>
          
          <div className="infinity-stones-grid">
            {state.gems.map((gem, index) => (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.4 + index * 0.2, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              >
                <InfinityStone
                  type={gem.id}
                  isActive={gem.status === 'bright'}
                  power={gem.power}
                  size="large"
                  onClick={() => handleStoneClick(gem)}
                  showEffects={true}
                />
              </motion.div>
            ))}
          </div>

          {/* Gauntlet Power Level */}
          <motion.div
            className="gauntlet-power-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="power-core">
              <motion.div
                className="power-core-inner"
                animate={{
                  boxShadow: wellnessBalance() === 100 
                    ? [
                        '0 0 30px rgba(255, 215, 0, 0.8)',
                        '0 0 60px rgba(255, 215, 0, 1)',
                        '0 0 30px rgba(255, 215, 0, 0.8)'
                      ]
                    : [
                        '0 0 15px rgba(74, 144, 226, 0.5)',
                        '0 0 25px rgba(74, 144, 226, 0.7)',
                        '0 0 15px rgba(74, 144, 226, 0.5)'
                      ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="power-percentage">{wellnessBalance()}%</span>
                <span className="power-label">GAUNTLET POWER</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="daily-progress"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="section-header">
            <h2>Today's Progress</h2>
            <div className="progress-summary">
              <span>{completedQuests} completed</span>
              <span>{todayQuests} remaining</span>
            </div>
          </div>

          <div className="progress-ring-container">
            <svg width="120" height="120" className="progress-ring-large">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#ecf0f1"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - completedQuests / (completedQuests + todayQuests))}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 50 * (1 - completedQuests / (completedQuests + todayQuests || 1))
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A90E2" />
                  <stop offset="50%" stopColor="#8E44AD" />
                  <stop offset="100%" stopColor="#E67E22" />
                </linearGradient>
              </defs>
            </svg>
            <div className="progress-center">
              <div className="progress-percentage">
                {Math.round((completedQuests / (completedQuests + todayQuests || 1)) * 100)}%
              </div>
              <div className="progress-label">Complete</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-bottom">
        <motion.div 
          className="recent-achievements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="section-header">
            <h2>Recent Achievements</h2>
            <p>Celebrate your wellness milestones</p>
          </div>
          
          <div className="achievements-list">
            {recentAchievements.length > 0 ? (
              recentAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className="achievement-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-content">
                    <h4>{achievement.name}</h4>
                    <p>{achievement.description}</p>
                  </div>
                  <div className="achievement-badge">Unlocked!</div>
                </motion.div>
              ))
            ) : (
              <div className="no-achievements">
                <Target size={48} color="#bdc3c7" />
                <p>Complete quests to unlock achievements!</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Jump into your wellness activities</p>
          </div>
          
          <div className="action-buttons">
            <motion.button 
              className="action-btn primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={20} />
              Start Quest
            </motion.button>
            
            <motion.button 
              className="action-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp size={20} />
              View Analytics
            </motion.button>
            
            <motion.button 
              className="action-btn tertiary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock size={20} />
              Set Reminder
            </motion.button>
          </div>
        </motion.div>
      </div>

      {state.notifications.length > 0 && (
        <motion.div 
          className="notifications-panel"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h3>Recent Updates</h3>
          {state.notifications.slice(0, 3).map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`notification-item ${notification.type}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            >
              {notification.message}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;