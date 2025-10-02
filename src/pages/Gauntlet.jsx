import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  RotateCcw, 
  Moon, 
  Target,
  Info,
  ArrowRight
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import GemCard from '../components/GemCard';
import './Gauntlet.css';

const Gauntlet = () => {
  const { state, dispatch, wellnessBalance, simulateDecay, resetGauntlet } = useWellness();
  const [selectedGem, setSelectedGem] = useState(null);
  const [showInterconnections, setShowInterconnections] = useState(false);

  const handleGemClick = (gem) => {
    setSelectedGem(selectedGem?.id === gem.id ? null : gem);
  };

  const getInterconnectionLines = () => {
    const connections = [
      { from: 'mind', to: 'body', reason: 'Physical activity boosts mental clarity' },
      { from: 'body', to: 'soul', reason: 'Exercise improves emotional well-being' },
      { from: 'wealth', to: 'purpose', reason: 'Financial stability enables pursuing goals' },
      { from: 'soul', to: 'mind', reason: 'Social connections reduce stress' },
      { from: 'purpose', to: 'mind', reason: 'Clear goals improve focus' }
    ];

    return connections;
  };

  const getBalanceStatus = () => {
    const balance = wellnessBalance();
    if (balance === 100) return { text: 'Perfect Balance Achieved!', color: '#27AE60', icon: '🏆' };
    if (balance >= 80) return { text: 'Excellent Balance', color: '#2ECC71', icon: '🌟' };
    if (balance >= 60) return { text: 'Good Balance', color: '#F39C12', icon: '⚡' };
    if (balance >= 40) return { text: 'Moderate Balance', color: '#E67E22', icon: '⚖️' };
    return { text: 'Needs Attention', color: '#E74C3C', icon: '⚠️' };
  };

  const balanceStatus = getBalanceStatus();
  const activeGems = state.gems.filter(gem => gem.status === 'bright').length;
  const drainingGems = state.gems.filter(gem => gem.status === 'draining').length;

  return (
    <div className="gauntlet-page">
      <div className="gauntlet-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>The Gauntlet of Well-Being</h1>
          <p>Master the Five Wellness Gems to Achieve Perfect Balance</p>
          
          <div className="balance-status">
            <div className="status-indicator" style={{ color: balanceStatus.color }}>
              <span className="status-icon">{balanceStatus.icon}</span>
              <span className="status-text">{balanceStatus.text}</span>
            </div>
            <div className="balance-percentage" style={{ color: balanceStatus.color }}>
              {wellnessBalance()}%
            </div>
          </div>
        </motion.div>

        <motion.div
          className="gauntlet-stats"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="stat-item">
            <span className="stat-value">{activeGems}</span>
            <span className="stat-label">Active Gems</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{drainingGems}</span>
            <span className="stat-label">Need Attention</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{state.user.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </motion.div>
      </div>

      <div className="gauntlet-controls">
        <motion.button
          className="control-btn info"
          onClick={() => setShowInterconnections(!showInterconnections)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info size={20} />
          {showInterconnections ? 'Hide' : 'Show'} Connections
        </motion.button>

        <motion.button
          className="control-btn decay"
          onClick={simulateDecay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Moon size={20} />
          Simulate Daily Decay
        </motion.button>

        <motion.button
          className="control-btn reset"
          onClick={resetGauntlet}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={20} />
          Reset Gauntlet
        </motion.button>
      </div>

      <div className="gauntlet-container">
        <div className="gauntlet-visualization">
          <motion.div
            className="gauntlet-ring"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Central Balance Indicator */}
            <motion.div
              className="balance-core"
              animate={{
                boxShadow: wellnessBalance() === 100 
                  ? '0 0 50px rgba(39, 174, 96, 0.8), 0 0 100px rgba(39, 174, 96, 0.4)'
                  : '0 0 20px rgba(74, 144, 226, 0.5)'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="balance-percentage-large">
                <motion.span
                  key={wellnessBalance()}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {wellnessBalance()}%
                </motion.span>
              </div>
              <span className="balance-label">Balance</span>
            </motion.div>

            {/* Interconnection Lines */}
            <AnimatePresence>
              {showInterconnections && (
                <div className="interconnections">
                  {getInterconnectionLines().map((connection, index) => (
                    <motion.div
                      key={`${connection.from}-${connection.to}`}
                      className="connection-line"
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 0.6, pathLength: 1 }}
                      exit={{ opacity: 0, pathLength: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      title={connection.reason}
                    >
                      <svg className="connection-svg">
                        <motion.path
                          d="M 50 50 Q 150 100 250 150"
                          stroke="rgba(255, 255, 255, 0.4)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </svg>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Gem Positions in Circle */}
            {state.gems.map((gem, index) => {
              const angle = (index * 360) / state.gems.length - 90; // Start from top
              const radius = 200;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={gem.id}
                  className={`gem-position ${gem.status} ${selectedGem?.id === gem.id ? 'selected' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.2, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  onClick={() => handleGemClick(gem)}
                  whileHover={{ scale: 1.1, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="gem-orb" style={{ '--gem-color': gem.color }}>
                    <span className="gem-icon-large">{gem.icon}</span>
                    <div className="gem-power-ring">
                      <svg width="80" height="80">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke={gem.color}
                          strokeWidth="4"
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          strokeDashoffset={`${2 * Math.PI * 35 * (1 - gem.power / 100)}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                          animate={{ 
                            strokeDashoffset: 2 * Math.PI * 35 * (1 - gem.power / 100)
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                    </div>
                    {gem.status === 'bright' && (
                      <motion.div
                        className="gem-aura"
                        animate={{
                          opacity: [0.3, 0.8, 0.3],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </div>
                  <div className="gem-label">
                    <span className="gem-name-small">{gem.name}</span>
                    <span className="gem-power-text">{gem.power}%</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Gem Details Panel */}
        <AnimatePresence>
          {selectedGem && (
            <motion.div
              className="gem-details-panel"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <GemCard gem={selectedGem} showQuests={true} />
              
              <div className="gem-insights">
                <h3>Wellness Insights</h3>
                <div className="insight-list">
                  {selectedGem.status === 'bright' && (
                    <div className="insight-item positive">
                      <Zap size={16} />
                      <span>This gem is fully powered and contributing to your overall balance!</span>
                    </div>
                  )}
                  {selectedGem.status === 'draining' && (
                    <div className="insight-item warning">
                      <Target size={16} />
                      <span>This gem needs immediate attention to prevent further decline.</span>
                    </div>
                  )}
                  {selectedGem.status === 'dim' && (
                    <div className="insight-item info">
                      <ArrowRight size={16} />
                      <span>Complete quests to activate this gem and boost your wellness balance.</span>
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                className="close-panel-btn"
                onClick={() => setSelectedGem(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close Details
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Messages */}
      {state.notifications.length > 0 && (
        <motion.div
          className="status-messages"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3>Recent Updates</h3>
          {state.notifications.slice(0, 2).map((notification) => (
            <motion.div
              key={notification.id}
              className={`status-message ${notification.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {notification.message}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Gauntlet;