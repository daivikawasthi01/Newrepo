import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';
import wellnessAPI from '../services/api';
import './SimpleGauntlet.css';

const SimpleGauntlet = () => {
  const [stones, setStones] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentChanges, setRecentChanges] = useState({});
  const [showChanges, setShowChanges] = useState({});

  useEffect(() => {
    // Reset to default values on login for demo
    resetToDefault();
    loadStones();

    // Listen for challenge completions
    const handleWellnessUpdate = (event) => {
      if (event.detail.type === 'challenge-activity') {
        loadStones();
        showStoneChanges(event.detail.stoneUpdates);
      }
    };

    window.addEventListener('wellnessUpdate', handleWellnessUpdate);
    return () => window.removeEventListener('wellnessUpdate', handleWellnessUpdate);
  }, []);

  const resetToDefault = () => {
    // Set default stone values for demo
    const defaultStones = {
      power: { id: 'power', name: 'Power Stone', progress: 45, color: '#8a2be2', icon: '💪' },
      space: { id: 'space', name: 'Space Stone', progress: 32, color: '#0066ff', icon: '🌌' },
      reality: { id: 'reality', name: 'Reality Stone', progress: 67, color: '#ff0000', icon: '🔮' },
      soul: { id: 'soul', name: 'Soul Stone', progress: 23, color: '#ff8c00', icon: '❤️' },
      time: { id: 'time', name: 'Time Stone', progress: 78, color: '#00ff00', icon: '⏰' },
      mind: { id: 'mind', name: 'Mind Stone', progress: 56, color: '#ffff00', icon: '🧠' }
    };
    
    localStorage.setItem('wellness-gauntlet-data', JSON.stringify({
      stones: defaultStones,
      timestamp: Date.now()
    }));
  };

  const loadStones = async () => {
    try {
      const stonesData = await wellnessAPI.getStones();
      setStones(stonesData);
    } catch (error) {
      console.error('Failed to load stones:', error);
    } finally {
      setLoading(false);
    }
  };

  const showStoneChanges = (stoneUpdates) => {
    const changes = {};
    
    stoneUpdates?.forEach(update => {
      if (update.stone) {
        const stoneId = update.stone.id;
        const oldProgress = stones[stoneId]?.progress || 0;
        const newProgress = update.stone.progress;
        const change = newProgress - oldProgress;
        
        if (change !== 0) {
          changes[stoneId] = change;
        }

        // Show ripple effects
        update.rippleEffects?.forEach(effect => {
          if (effect.stoneId && stones[effect.stoneId]) {
            changes[effect.stoneId] = effect.change;
          }
        });
      }
    });

    setRecentChanges(changes);
    setShowChanges(changes);

    // Hide arrows after 3 seconds
    setTimeout(() => {
      setShowChanges({});
    }, 3000);
  };

  const getSortedStones = () => {
    return Object.values(stones).sort((a, b) => b.progress - a.progress);
  };

  const getOverallBalance = () => {
    const stoneValues = Object.values(stones);
    if (stoneValues.length === 0) return 0;
    const total = stoneValues.reduce((sum, stone) => sum + stone.progress, 0);
    return Math.round(total / stoneValues.length);
  };

  if (loading) {
    return (
      <div className="simple-gauntlet">
        <div className="loading-spinner"></div>
        <p>Loading Stone Powers...</p>
      </div>
    );
  }

  return (
    <div className="simple-gauntlet">
      <div className="gauntlet-header">
        <h1>🏆 Stone Power Leaderboard</h1>
        <p>Track your wellness stone progress - complete challenges to see changes!</p>
        
        <div className="overall-balance">
          <div className="balance-display">
            <span className="balance-number">{getOverallBalance()}%</span>
            <span className="balance-label">Overall Balance</span>
          </div>
        </div>
      </div>

      <div className="reset-section">
        <button 
          className="reset-btn"
          onClick={() => {
            resetToDefault();
            setTimeout(() => loadStones(), 500);
          }}
        >
          <RotateCcw size={16} />
          Reset to Demo Values
        </button>
      </div>

      <div className="stones-leaderboard">
        <div className="leaderboard-header">
          <span className="rank-col">Rank</span>
          <span className="stone-col">Stone</span>
          <span className="power-col">Power</span>
          <span className="change-col">Change</span>
        </div>

        {getSortedStones().map((stone, index) => (
          <motion.div
            key={stone.id}
            className="stone-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="rank-number">
              <Trophy 
                size={20} 
                color={index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666'}
              />
              <span>#{index + 1}</span>
            </div>

            <div className="stone-info">
              <div className="stone-icon" style={{ backgroundColor: stone.color }}>
                {stone.icon || '💎'}
              </div>
              <div className="stone-details">
                <span className="stone-name">{stone.name}</span>
                <span className="stone-type">{stone.id.toUpperCase()}</span>
              </div>
            </div>

            <div className="power-display">
              <div className="power-bar">
                <motion.div
                  className="power-fill"
                  style={{ backgroundColor: stone.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stone.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <span className="power-number">{stone.progress}%</span>
            </div>

            <div className="change-indicator">
              <AnimatePresence>
                {showChanges[stone.id] && (
                  <motion.div
                    className={`change-arrow ${showChanges[stone.id] > 0 ? 'up' : 'down'}`}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showChanges[stone.id] > 0 ? (
                      <ArrowUp size={20} color="#00ff00" />
                    ) : (
                      <ArrowDown size={20} color="#ff4444" />
                    )}
                    <span className="change-value">
                      {showChanges[stone.id] > 0 ? '+' : ''}{Math.round(showChanges[stone.id])}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="demo-instructions">
        <div className="instruction-card">
          <Zap className="instruction-icon" />
          <div>
            <h3>How to See Changes</h3>
            <p>1. Go to Challenges tab</p>
            <p>2. Join any challenge</p>
            <p>3. Complete an activity</p>
            <p>4. Return here to see arrows showing stone changes!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGauntlet;