import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import wellnessAPI from '../services/api';
import './PowerLeaderboard.css';

const PowerLeaderboard = () => {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState({});

  useEffect(() => {
    resetAndLoad();
    
    // Listen for challenge completions
    const handleUpdate = (event) => {
      if (event.detail.type === 'challenge-activity') {
        loadStones();
        showChanges(event.detail.stoneUpdates);
      }
    };

    window.addEventListener('wellnessUpdate', handleUpdate);
    return () => window.removeEventListener('wellnessUpdate', handleUpdate);
  }, []);

  const resetAndLoad = () => {
    // Only reset if user specifically clicks reset button
    loadStones();
  };

  const resetToNewUser = () => {
    // Clear data to start fresh gamified journey
    localStorage.removeItem('wellness-gauntlet-data');
    setTimeout(() => loadStones(), 500);
  };

  const loadStones = async () => {
    try {
      const stonesData = await wellnessAPI.getStones();
      const stoneArray = Object.values(stonesData).sort((a, b) => b.progress - a.progress);
      setStones(stoneArray);
    } catch (error) {
      console.error('Failed to load stones:', error);
    } finally {
      setLoading(false);
    }
  };

  const showChanges = (stoneUpdates) => {
    const newChanges = {};
    
    stoneUpdates?.forEach(update => {
      if (update.stone) {
        const oldStone = stones.find(s => s.id === update.stone.id);
        const oldProgress = oldStone?.progress || 0;
        const newProgress = update.stone.progress;
        const change = newProgress - oldProgress;
        
        if (change !== 0) {
          newChanges[update.stone.id] = change;
        }
      }
      
      // Handle ripple effects
      update.rippleEffects?.forEach(effect => {
        if (effect.stoneId) {
          newChanges[effect.stoneId] = effect.change;
        }
      });
    });

    setChanges(newChanges);
    
    // Clear changes after 4 seconds
    setTimeout(() => setChanges({}), 4000);
  };

  if (loading) {
    return (
      <div className="power-leaderboard">
        <div className="loading">Loading Stone Powers...</div>
      </div>
    );
  }

  return (
    <div className="power-leaderboard">
      <div className="header">
        <h1>🏆 Stone Power Leaderboard</h1>
        <p>Complete challenges to see stone power changes with arrows!</p>
        
        <button className="reset-btn" onClick={resetToNewUser}>
          <RotateCcw size={16} />
          Start Fresh Gamified Journey
        </button>
      </div>

      <div className="leaderboard">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Stone</span>
          <span>Power Level</span>
          <span>Change</span>
        </div>

        {stones.map((stone, index) => (
          <motion.div
            key={stone.id}
            className={`stone-row ${!stone.unlocked ? 'locked' : ''} ${stone.glowing ? 'glowing' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Rank */}
            <div className="rank">
              {stone.unlocked ? (
                <Trophy 
                  size={24} 
                  color={index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666'}
                />
              ) : (
                <div className="locked-icon">🔒</div>
              )}
              <span>#{index + 1}</span>
            </div>

            {/* Stone Info */}
            <div className="stone-info">
              <div 
                className={`stone-icon ${!stone.unlocked ? 'locked' : ''} ${stone.glowing ? 'glowing' : ''}`}
                style={{ backgroundColor: stone.unlocked ? stone.color : '#333' }}
              >
                {stone.unlocked ? stone.icon : '❓'}
              </div>
              <div className="stone-details">
                <div className="stone-name">
                  {stone.name}
                  {!stone.unlocked && <span className="locked-label"> (Locked)</span>}
                  {stone.glowing && <span className="glowing-label"> ⭐</span>}
                </div>
                <div className="stone-type">
                  {stone.unlocked ? stone.id.toUpperCase() : 'LOCKED'}
                </div>
                {!stone.unlocked && (
                  <div className="unlock-requirement">{stone.unlockRequirement}</div>
                )}
              </div>
            </div>

            {/* Power Level */}
            <div className="power-level">
              <div className="power-bar">
                <motion.div
                  className={`power-fill ${!stone.unlocked ? 'locked' : ''}`}
                  style={{ backgroundColor: stone.unlocked ? stone.color : '#333' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stone.unlocked ? stone.progress : 0}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
              <span className="power-number">
                {stone.unlocked ? `${stone.progress}%` : 'Locked'}
              </span>
            </div>

            {/* Change Arrow */}
            <div className="change-arrow">
              <AnimatePresence>
                {changes[stone.id] && (
                  <motion.div
                    className={`arrow ${changes[stone.id] > 0 ? 'up' : 'down'}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {changes[stone.id] > 0 ? (
                      <ArrowUp size={24} color="#00ff00" />
                    ) : (
                      <ArrowDown size={24} color="#ff4444" />
                    )}
                    <span className="change-number">
                      {changes[stone.id] > 0 ? '+' : ''}{Math.round(changes[stone.id])}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="instructions">
        <h3>📋 How to See Changes:</h3>
        <ol>
          <li>Go to <strong>Challenges</strong> tab</li>
          <li>Join any challenge (click the challenge card)</li>
          <li>Click <strong>"Complete Activity"</strong> button</li>
          <li>Come back here to see arrows showing power changes! ⬆️ ⬇️</li>
        </ol>
      </div>
    </div>
  );
};

export default PowerLeaderboard;