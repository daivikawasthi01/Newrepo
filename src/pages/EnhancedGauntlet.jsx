import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  RotateCcw, 
  Moon, 
  Target,
  Info,
  ArrowRight,
  Activity,
  TrendingUp,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import GemCard from '../components/GemCard';
import InfinityStone from '../components/InfinityStone';
import wellnessAPI from '../services/api';
import './Gauntlet.css';
import './EnhancedGauntlet.css';

const EnhancedGauntlet = () => {
  const { state, dispatch, wellnessBalance, simulateDecay, resetGauntlet } = useWellness();
  const [selectedGem, setSelectedGem] = useState(null);
  const [showInterconnections, setShowInterconnections] = useState(true);
  const [apiStones, setApiStones] = useState({});
  const [loading, setLoading] = useState(true);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [connectionStrength, setConnectionStrength] = useState({});
  const [animatingStones, setAnimatingStones] = useState(new Set());

  useEffect(() => {
    loadGauntletData();
    
    // Listen for challenge completions and stone updates
    const handleWellnessUpdate = (event) => {
      const { type, stoneUpdates, stone, rippleEffects } = event.detail;
      
      if (type === 'challenge-activity' || type === 'stone-update') {
        loadGauntletData();
        
        // Add real-time update message
        const updateMessage = type === 'challenge-activity' 
          ? `Challenge activity completed! ${stoneUpdates?.length || 0} stones affected`
          : `${stone?.name || 'Stone'} energy updated! ${rippleEffects?.length || 0} ripple effects`;
          
        setRealtimeUpdates(prev => [{
          id: Date.now(),
          message: updateMessage,
          timestamp: new Date(),
          type: 'challenge-update'
        }, ...prev.slice(0, 4)]);
      }
    };
    
    const handleStorageChange = () => {
      loadGauntletData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wellnessUpdate', handleWellnessUpdate);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      simulateRealtimeUpdates();
    }, 15000); // Every 15 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wellnessUpdate', handleWellnessUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Update balance history when stones change
    if (Object.keys(apiStones).length > 0) {
      const newBalance = calculateOverallBalance();
      setOverallProgress(newBalance);
      
      setBalanceHistory(prev => {
        const newHistory = [...prev, { 
          timestamp: Date.now(), 
          balance: newBalance,
          stones: Object.values(apiStones).map(s => ({ id: s.id, progress: s.progress }))
        }];
        return newHistory.slice(-10); // Keep last 10 entries
      });
      
      updateConnectionStrengths();
    }
  }, [apiStones]);

  const loadGauntletData = async () => {
    try {
      setLoading(true);
      const [stonesData, analyticsData] = await Promise.all([
        wellnessAPI.getStones(),
        wellnessAPI.getAnalytics()
      ]);
      
      setApiStones(stonesData);
      setOverallProgress(analyticsData.overallProgress);
    } catch (error) {
      console.error('Failed to load gauntlet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateRealtimeUpdates = () => {
    const updateTypes = [
      'Stone energy naturally regenerating',
      'Connection strength increasing',
      'Balance optimization detected',
      'Wellness synergy achieved'
    ];
    
    const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const newUpdate = {
      id: Date.now(),
      message: randomUpdate,
      timestamp: new Date(),
      type: 'system'
    };
    
    setRealtimeUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
  };

  const calculateOverallBalance = () => {
    if (Object.keys(apiStones).length === 0) return 0;
    
    const totalProgress = Object.values(apiStones).reduce((sum, stone) => sum + stone.progress, 0);
    const baseBalance = totalProgress / Object.keys(apiStones).length;
    
    // Apply connection bonuses
    let connectionBonus = 0;
    Object.values(apiStones).forEach(stone => {
      stone.connectedTo.forEach(connectedId => {
        if (apiStones[connectedId]) {
          const connectionStrength = Math.min(stone.progress, apiStones[connectedId].progress) / 100;
          connectionBonus += connectionStrength * 5; // Up to 5% bonus per connection
        }
      });
    });
    
    return Math.min(100, Math.round(baseBalance + connectionBonus));
  };

  const updateConnectionStrengths = () => {
    const strengths = {};
    
    Object.values(apiStones).forEach(stone => {
      stone.connectedTo.forEach(connectedId => {
        if (apiStones[connectedId]) {
          const key = `${stone.id}-${connectedId}`;
          const strength = Math.min(stone.progress, apiStones[connectedId].progress) / 100;
          strengths[key] = strength;
        }
      });
    });
    
    setConnectionStrength(strengths);
  };

  const handleGemClick = (gem) => {
    setSelectedGem(selectedGem?.id === gem.id ? null : gem);
  };

  const handleStoneClick = async (stoneId) => {
    if (animatingStones.has(stoneId)) return;
    
    setAnimatingStones(prev => new Set([...prev, stoneId]));
    
    try {
      const result = await wellnessAPI.updateStoneProgress(stoneId, 10, 'manual-activation');
      
      if (result.success) {
        setApiStones(prev => ({
          ...prev,
          [stoneId]: result.stone
        }));
        
        // Update connected stones
        if (result.rippleEffects) {
          result.rippleEffects.forEach(effect => {
            if (effect.stoneId && apiStones[effect.stoneId]) {
              setApiStones(prev => ({
                ...prev,
                [effect.stoneId]: {
                  ...prev[effect.stoneId],
                  progress: Math.min(100, prev[effect.stoneId].progress + effect.change),
                  energy: Math.min(100, prev[effect.stoneId].energy + (effect.change * 0.5))
                }
              }));
            }
          });
        }
        
        // Add realtime update
        setRealtimeUpdates(prev => [{
          id: Date.now(),
          message: `${result.stone.name} activated! ${result.rippleEffects?.length || 0} connections energized`,
          timestamp: new Date(),
          type: 'stone-activation'
        }, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Failed to update stone:', error);
    } finally {
      setTimeout(() => {
        setAnimatingStones(prev => {
          const newSet = new Set(prev);
          newSet.delete(stoneId);
          return newSet;
        });
      }, 1000);
    }
  };

  const getInterconnectionLines = () => {
    const connections = [];
    
    Object.values(apiStones).forEach(stone => {
      stone.connectedTo.forEach(connectedId => {
        if (apiStones[connectedId]) {
          const strength = connectionStrength[`${stone.id}-${connectedId}`] || 0;
          connections.push({
            from: stone.id,
            to: connectedId,
            strength: strength,
            fromStone: stone,
            toStone: apiStones[connectedId]
          });
        }
      });
    });
    
    return connections;
  };

  const getBalanceStatus = () => {
    const balance = overallProgress;
    if (balance === 100) return { text: 'Perfect Cosmic Balance!', color: '#FFD700', icon: '👑' };
    if (balance >= 90) return { text: 'Legendary Balance', color: '#FF6B6B', icon: '🌟' };
    if (balance >= 80) return { text: 'Heroic Balance', color: '#4ECDC4', icon: '⚡' };
    if (balance >= 60) return { text: 'Growing Power', color: '#45B7D1', icon: '🔥' };
    if (balance >= 40) return { text: 'Awakening Strength', color: '#96CEB4', icon: '💫' };
    return { text: 'Journey Beginning', color: '#FECA57', icon: '🌱' };
  };

  const balanceStatus = getBalanceStatus();
  const activeStones = Object.values(apiStones).filter(stone => stone.unlocked && stone.energy > 50).length;
  const totalConnections = Object.values(apiStones).reduce((sum, stone) => sum + stone.connectedTo.length, 0);

  if (loading) {
    return (
      <div className="gauntlet-page">
        <div className="loading-container">
          <div className="loading-spinner cosmic"></div>
          <p>Assembling the Infinity Gauntlet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gauntlet-page enhanced">
      {/* Cosmic Background */}
      <div className="cosmic-background">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="cosmic-particle"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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
            className="realtime-updates gauntlet"
          >
            <div className="updates-header">
              <Activity size={16} />
              <span>Gauntlet Status</span>
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

      <div className="gauntlet-header enhanced">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="cosmic-title"
            animate={{
              textShadow: [
                '0 0 20px rgba(138, 43, 226, 0.8)',
                '0 0 40px rgba(255, 20, 147, 0.8)',
                '0 0 20px rgba(138, 43, 226, 0.8)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡ The Infinity Gauntlet ⚡
          </motion.h1>
          <p className="cosmic-subtitle">Master the cosmic forces of wellness balance</p>
          
          <div className="balance-status enhanced">
            <motion.div 
              className="status-indicator" 
              style={{ color: balanceStatus.color }}
              animate={{
                scale: overallProgress === 100 ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="status-icon">{balanceStatus.icon}</span>
              <span className="status-text">{balanceStatus.text}</span>
            </motion.div>
            <motion.div 
              className="balance-percentage cosmic" 
              style={{ color: balanceStatus.color }}
              key={overallProgress}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {overallProgress}%
            </motion.div>
          </div>

          {/* Progress History Visualization */}
          <motion.div
            className="balance-trend"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="trend-line">
              {balanceHistory.slice(-5).map((entry, index) => (
                <motion.div
                  key={entry.timestamp}
                  className="trend-point"
                  style={{ 
                    height: `${entry.balance}%`,
                    backgroundColor: entry.balance > (balanceHistory[index - 1]?.balance || 0) ? '#00FF00' : '#FF6B6B'
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${entry.balance}%` }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
            <span className="trend-label">Recent Progress</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="gauntlet-stats enhanced"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="stat-item cosmic">
            <motion.span 
              className="stat-value"
              key={activeStones}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {activeStones}
            </motion.span>
            <span className="stat-label">Active Stones</span>
            <div className="stat-glow" style={{ backgroundColor: '#8A2BE2' }}></div>
          </div>
          <div className="stat-item cosmic">
            <motion.span 
              className="stat-value"
              key={totalConnections}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {totalConnections}
            </motion.span>
            <span className="stat-label">Connections</span>
            <div className="stat-glow" style={{ backgroundColor: '#FF1493' }}></div>
          </div>
          <div className="stat-item cosmic">
            <motion.span 
              className="stat-value"
              key={Object.values(apiStones).filter(s => s.level >= 3).length}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {Object.values(apiStones).filter(s => s.level >= 3).length}
            </motion.span>
            <span className="stat-label">Mastered</span>
            <div className="stat-glow" style={{ backgroundColor: '#00BFFF' }}></div>
          </div>
        </motion.div>
      </div>

      <div className="gauntlet-controls enhanced">
        <motion.button
          className="control-btn info cosmic"
          onClick={() => setShowInterconnections(!showInterconnections)}
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          {showInterconnections ? <EyeOff size={20} /> : <Eye size={20} />}
          {showInterconnections ? 'Hide' : 'Show'} Energy Flow
        </motion.button>

        <motion.button
          className="control-btn trend cosmic"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 20, 147, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp size={20} />
          Balance Trends
        </motion.button>

        <motion.button
          className="control-btn sparkles cosmic"
          onClick={() => {
            Object.keys(apiStones).forEach(stoneId => {
              setTimeout(() => handleStoneClick(stoneId), Math.random() * 1000);
            });
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 191, 255, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          Energize All
        </motion.button>
      </div>

      <div className="gauntlet-container enhanced">
        <div className="gauntlet-visualization">
          <motion.div
            className="gauntlet-ring cosmic"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Enhanced Central Balance Core */}
            <motion.div
              className="balance-core cosmic"
              animate={{
                boxShadow: overallProgress === 100 
                  ? [
                      '0 0 50px rgba(255, 215, 0, 0.8)',
                      '0 0 100px rgba(255, 215, 0, 1)',
                      '0 0 150px rgba(255, 215, 0, 0.8)'
                    ]
                  : [
                      '0 0 30px rgba(138, 43, 226, 0.5)',
                      '0 0 50px rgba(138, 43, 226, 0.7)',
                      '0 0 30px rgba(138, 43, 226, 0.5)'
                    ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="balance-percentage-large cosmic">
                <motion.span
                  key={overallProgress}
                  initial={{ scale: 1.5, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  {overallProgress}%
                </motion.span>
              </div>
              <span className="balance-label cosmic">COSMIC POWER</span>
              
              {/* Power rings around the core */}
              <div className="power-rings">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="power-ring"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, delay: i * 0.5 }
                    }}
                    style={{
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Enhanced Interconnection Visualization */}
            <AnimatePresence>
              {showInterconnections && (
                <div className="interconnections cosmic">
                  <svg className="connections-svg" width="600" height="600">
                    {getInterconnectionLines().map((connection, index) => {
                      const fromAngle = (Object.keys(apiStones).indexOf(connection.from) * 360) / Object.keys(apiStones).length - 90;
                      const toAngle = (Object.keys(apiStones).indexOf(connection.to) * 360) / Object.keys(apiStones).length - 90;
                      
                      const radius = 180;
                      const centerX = 300;
                      const centerY = 300;
                      
                      const fromX = centerX + Math.cos((fromAngle * Math.PI) / 180) * radius;
                      const fromY = centerY + Math.sin((fromAngle * Math.PI) / 180) * radius;
                      const toX = centerX + Math.cos((toAngle * Math.PI) / 180) * radius;
                      const toY = centerY + Math.sin((toAngle * Math.PI) / 180) * radius;
                      
                      return (
                        <motion.line
                          key={`${connection.from}-${connection.to}`}
                          x1={fromX}
                          y1={fromY}
                          x2={toX}
                          y2={toY}
                          stroke={`url(#connectionGradient${index})`}
                          strokeWidth={2 + connection.strength * 3}
                          opacity={0.3 + connection.strength * 0.7}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.3 + connection.strength * 0.7 }}
                          exit={{ pathLength: 0, opacity: 0 }}
                          transition={{ 
                            duration: 1, 
                            delay: index * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 2
                          }}
                        />
                      );
                    })}
                    
                    {/* Gradients for connections */}
                    <defs>
                      {getInterconnectionLines().map((connection, index) => (
                        <linearGradient key={index} id={`connectionGradient${index}`}>
                          <stop offset="0%" stopColor={connection.fromStone.color} />
                          <stop offset="50%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor={connection.toStone.color} />
                        </linearGradient>
                      ))}
                    </defs>
                  </svg>
                </div>
              )}
            </AnimatePresence>

            {/* Enhanced Stone Positions */}
            {Object.values(apiStones).map((stone, index) => {
              const angle = (index * 360) / Object.keys(apiStones).length - 90;
              const radius = 220;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={stone.id}
                  className={`stone-position enhanced ${stone.unlocked ? 'unlocked' : 'locked'} ${animatingStones.has(stone.id) ? 'animating' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  initial={{ scale: 0, opacity: 0, y: -100 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    rotate: animatingStones.has(stone.id) ? 360 : 0
                  }}
                  transition={{ 
                    delay: index * 0.3, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    rotate: { duration: 1 }
                  }}
                  onClick={() => handleStoneClick(stone.id)}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -15,
                    boxShadow: `0 20px 40px ${stone.color}40`
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <InfinityStone
                    type={stone.id}
                    isActive={stone.unlocked && stone.energy > 50}
                    power={stone.progress}
                    size="large"
                    showEffects={true}
                    color={stone.color}
                  />
                  
                  <div className="stone-info enhanced">
                    <span className="stone-name">{stone.name}</span>
                    <div className="stone-stats">
                      <span className="level">Lv. {stone.level}</span>
                      <span className="progress">{stone.progress}%</span>
                      <span className="energy">{stone.energy}⚡</span>
                    </div>
                    
                    {/* Connection indicators */}
                    <div className="connection-indicators">
                      {stone.connectedTo.map(connectedId => (
                        <div
                          key={connectedId}
                          className="connection-dot"
                          style={{ 
                            backgroundColor: apiStones[connectedId]?.color || '#666',
                            opacity: connectionStrength[`${stone.id}-${connectedId}`] || 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Enhanced effects */}
                  {stone.unlocked && stone.energy > 80 && (
                    <motion.div
                      className="stone-aura enhanced"
                      animate={{
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.4, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ backgroundColor: stone.color }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Status Messages */}
      <motion.div
        className="gauntlet-insights"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <h3>Cosmic Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <Zap className="insight-icon" />
            <div>
              <h4>Power Level</h4>
              <p>{overallProgress >= 80 ? 'Legendary' : overallProgress >= 60 ? 'Heroic' : overallProgress >= 40 ? 'Growing' : 'Awakening'}</p>
            </div>
          </div>
          <div className="insight-card">
            <Target className="insight-icon" />
            <div>
              <h4>Balance Status</h4>
              <p>{balanceStatus.text}</p>
            </div>
          </div>
          <div className="insight-card">
            <TrendingUp className="insight-icon" />
            <div>
              <h4>Growth Trend</h4>
              <p>{balanceHistory.length >= 2 && 
                  balanceHistory[balanceHistory.length - 1].balance > balanceHistory[balanceHistory.length - 2].balance 
                  ? 'Ascending' : 'Stabilizing'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedGauntlet;