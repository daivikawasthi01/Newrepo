import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Target, 
  Zap, 
  TrendingUp,
  Award,
  Clock,
  Activity,
  Bell,
  Plus,
  Users,
  BarChart3
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import GemCard from '../components/GemCard';
import InfinityStone from '../components/InfinityStone';
import wellnessAPI from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const { state, wellnessBalance, completeQuest } = useWellness();
  const [apiStones, setApiStones] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [socialData, setSocialData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stoneConnections, setStoneConnections] = useState([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  useEffect(() => {
    loadDashboardData();
    // Set up real-time updates simulation
    const interval = setInterval(() => {
      simulateRealtimeUpdates();
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stonesData, challengesData, socialNetworkData, notificationsData, analyticsData] = 
        await Promise.all([
          wellnessAPI.getStones(),
          wellnessAPI.getChallenges(),
          wellnessAPI.getSocialNetwork(),
          wellnessAPI.getNotifications(),
          wellnessAPI.getAnalytics()
        ]);

      setApiStones(stonesData);
      setChallenges(challengesData.filter(c => c.status === 'active').slice(0, 3));
      setSocialData(socialNetworkData);
      setNotifications(notificationsData.slice(0, 5));
      setAnalytics(analyticsData);
      
      // Calculate stone connections
      calculateStoneConnections(stonesData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStoneConnections = (stones) => {
    const connections = [];
    Object.values(stones).forEach(stone => {
      stone.connectedTo.forEach(connectedId => {
        if (stones[connectedId]) {
          connections.push({
            from: stone.id,
            to: connectedId,
            strength: Math.min(stone.progress, stones[connectedId].progress) / 100
          });
        }
      });
    });
    setStoneConnections(connections);
  };

  const simulateRealtimeUpdates = () => {
    const updateTypes = [
      'Friend completed a challenge',
      'New stone energy surge detected',
      'Community milestone reached',
      'Achievement unlocked'
    ];
    
    const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const newUpdate = {
      id: Date.now(),
      message: randomUpdate,
      timestamp: new Date(),
      type: 'realtime'
    };
    
    setRealtimeUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
  };

  const handleStoneClick = async (gem) => {
    if (gem.status !== 'bright') {
      // Complete a random quest for this gem
      const availableQuests = gem.quests.filter(quest => !quest.completed);
      if (availableQuests.length > 0) {
        const randomQuest = availableQuests[Math.floor(Math.random() * availableQuests.length)];
        completeQuest(gem.id, randomQuest.id, randomQuest.points);
        
        // Update stone via API
        const stoneMapping = {
          'physical': 'power',
          'mental': 'mind',
          'emotional': 'soul',
          'social': 'space',
          'environmental': 'reality',
          'spiritual': 'time'
        };
        
        const stoneId = stoneMapping[gem.id] || 'power';
        const result = await wellnessAPI.updateStoneProgress(stoneId, 15, 'quest-completion');
        
        if (result.success) {
          setApiStones(prev => ({
            ...prev,
            [stoneId]: result.stone
          }));
          
          // Show ripple effects
          if (result.rippleEffects.length > 0) {
            setRealtimeUpdates(prev => [{
              id: Date.now(),
              message: `Stone energy rippled through ${result.rippleEffects.length} connected stones!`,
              timestamp: new Date(),
              type: 'stone-ripple'
            }, ...prev.slice(0, 4)]);
          }
        }
      }
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      const result = await wellnessAPI.joinChallenge(challengeId);
      if (result.success) {
        setChallenges(prev => 
          prev.map(challenge => 
            challenge.id === challengeId 
              ? { ...challenge, participants: challenge.participants + 1, status: 'active' }
              : challenge
          )
        );
        
        setRealtimeUpdates(prev => [{
          id: Date.now(),
          message: `Joined challenge: ${result.challenge.title}`,
          timestamp: new Date(),
          type: 'challenge-join'
        }, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };
  
  const todayQuests = state.gems.reduce((acc, gem) => {
    return acc + gem.quests.filter(quest => !quest.completed).length;
  }, 0);

  const completedQuests = state.gems.reduce((acc, gem) => {
    return acc + gem.quests.filter(quest => quest.completed).length;
  }, 0);

  const activeGems = state.gems.filter(gem => gem.status === 'bright').length;

  const quickStats = [
    {
      icon: Target,
      label: 'Wellness Balance',
      value: analytics ? `${analytics.overallProgress}%` : `${wellnessBalance()}%`,
      color: '#4A90E2',
      trend: '+5%'
    },
    {
      icon: Zap,
      label: 'Active Stones',
      value: Object.values(apiStones).filter(stone => stone.unlocked).length,
      color: '#8E44AD',
      trend: `+${Object.values(apiStones).filter(stone => stone.energy > 80).length}`
    },
    {
      icon: Calendar,
      label: 'Active Challenges',
      value: challenges.length,
      color: '#E67E22',
      trend: 'Live!'
    },
    {
      icon: Users,
      label: 'Network Rank',
      value: socialData ? `#${socialData.leaderboard.find(u => u.name === 'You')?.rank || 'N/A'}` : '#N/A',
      color: '#27AE60',
      trend: '↑2'
    }
  ];

  const recentAchievements = state.achievements
    .filter(achievement => achievement.unlocked)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Synchronizing with the cosmos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Cosmic Background Effects */}
      <div className="cosmic-background">
        {[...Array(30)].map((_, i) => (
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

      {/* Real-time Updates Panel */}
      <AnimatePresence>
        {realtimeUpdates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="realtime-updates"
          >
            <div className="updates-header">
              <Activity size={16} />
              <span>Live Updates</span>
            </div>
            {realtimeUpdates.slice(0, 3).map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`update-item ${update.type}`}
              >
                {update.message}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
                  {user?.avatar?.name || 'Cosmic Guardian'}
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Master the interconnected power of the Infinity Stones
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="quick-stats">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card enhanced"
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
            <div className="stat-glow" style={{ backgroundColor: stat.color }}></div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <motion.div 
          className="infinity-gauntlet-showcase enhanced"
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
              ⚡ Infinity Stones Network ⚡
            </motion.h2>
            <p>Watch the energy flow between connected stones</p>
          </div>
          
          {/* Stone Connections Visualization */}
          <div className="stone-connections-container">
            <svg className="connections-svg" width="100%" height="300">
              {stoneConnections.map((connection, index) => (
                <motion.line
                  key={`${connection.from}-${connection.to}`}
                  x1="15%"
                  y1="50%"
                  x2="85%"
                  y2="50%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  opacity={connection.strength}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: index * 0.2 }}
                />
              ))}
              <defs>
                <linearGradient id="connectionGradient">
                  <stop offset="0%" stopColor="#8a2be2" />
                  <stop offset="50%" stopColor="#ff1493" />
                  <stop offset="100%" stopColor="#00bfff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="infinity-stones-grid">
            {Object.values(apiStones).map((stone, index) => (
              <motion.div
                key={stone.id}
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.4 + index * 0.2, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="enhanced-stone-container"
              >
                <InfinityStone
                  type={stone.id}
                  isActive={stone.unlocked && stone.energy > 50}
                  power={stone.progress}
                  size="large"
                  onClick={() => handleStoneClick({ id: stone.id, status: stone.unlocked ? 'bright' : 'dim', quests: [{ id: 1, completed: false, points: 10 }] })}
                  showEffects={true}
                />
                <div className="stone-info">
                  <h4>{stone.name}</h4>
                  <div className="stone-stats">
                    <span>Level {stone.level}</span>
                    <span>{stone.progress}% Complete</span>
                  </div>
                  <div className="stone-energy-bar">
                    <motion.div
                      className="energy-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${stone.energy}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                      style={{ backgroundColor: stone.color }}
                    />
                  </div>
                  <div className="stone-abilities">
                    {stone.abilities.slice(0, 2).map(ability => (
                      <span key={ability} className="ability-tag">{ability}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Gauntlet Power Display */}
          <motion.div
            className="gauntlet-power-display enhanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="power-core">
              <motion.div
                className="power-core-inner"
                animate={{
                  boxShadow: analytics?.overallProgress === 100 
                    ? [
                        '0 0 30px rgba(255, 215, 0, 0.8)',
                        '0 0 60px rgba(255, 215, 0, 1)',
                        '0 0 30px rgba(255, 215, 0, 0.8)'
                      ]
                    : [
                        '0 0 15px rgba(138, 43, 226, 0.5)',
                        '0 0 25px rgba(138, 43, 226, 0.7)',
                        '0 0 15px rgba(138, 43, 226, 0.5)'
                      ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="power-percentage">{analytics?.overallProgress || 0}%</span>
                <span className="power-label">COSMIC POWER</span>
              </motion.div>
            </div>
            <div className="power-details">
              <div className="detail-item">
                <span>Connections: {stoneConnections.length}</span>
              </div>
              <div className="detail-item">
                <span>Active Stones: {Object.values(apiStones).filter(s => s.unlocked).length}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Active Challenges Section */}
        <motion.div 
          className="active-challenges"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="section-header">
            <h2>Active Challenges</h2>
            <div className="challenge-summary">
              <span>{challenges.length} active</span>
            </div>
          </div>

          <div className="challenges-list">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                className="challenge-card mini"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="challenge-header">
                  <h4>{challenge.title}</h4>
                  <div className="challenge-type">{challenge.type}</div>
                </div>
                <div className="challenge-progress">
                  <div className="progress-bar mini">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.duration) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <span>{challenge.progress}/{challenge.duration} days</span>
                </div>
                <div className="challenge-stones">
                  {challenge.stones.map(stoneId => (
                    <div
                      key={stoneId}
                      className="mini-stone"
                      style={{ backgroundColor: apiStones[stoneId]?.color || '#ccc' }}
                    ></div>
                  ))}
                </div>
                <button 
                  className="btn btn-mini btn-cosmic"
                  onClick={() => handleJoinChallenge(challenge.id)}
                >
                  Complete Activity
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Social Network Preview */}
      {socialData && (
        <motion.div
          className="social-preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="section-header">
            <h2>Wellness Network</h2>
            <div className="network-stats">
              <span>{socialData.friends.length} friends</span>
              <span>Rank #{socialData.leaderboard.find(u => u.name === 'You')?.rank || 'N/A'}</span>
            </div>
          </div>
          
          <div className="friends-preview">
            {socialData.friends.slice(0, 4).map((friend, index) => (
              <motion.div
                key={friend.id}
                className="friend-preview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <img 
                  src={friend.avatar} 
                  alt={friend.name}
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`;
                  }}
                />
                <div className={`status-dot ${friend.status}`}></div>
                <span>{friend.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <motion.div 
          className="notifications-panel enhanced"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="notifications-header">
            <Bell size={20} />
            <h3>Recent Activities</h3>
          </div>
          {notifications.slice(0, 3).map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`notification-item ${notification.type}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            >
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;