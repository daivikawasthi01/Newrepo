import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, AlertTriangle } from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import './GemCard.css';

const GemCard = ({ gem, compact = false, showQuests = false }) => {
  const { completeQuest } = useWellness();

  const getStatusIcon = () => {
    switch (gem.status) {
      case 'bright':
        return <Zap size={16} className="status-icon bright" />;
      case 'draining':
        return <TrendingDown size={16} className="status-icon draining" />;
      default:
        return <AlertTriangle size={16} className="status-icon dim" />;
    }
  };

  const getStatusText = () => {
    switch (gem.status) {
      case 'bright':
        return 'Active & Charged';
      case 'draining':
        return 'Losing Power';
      default:
        return 'Needs Attention';
    }
  };

  const handleQuestComplete = (questId) => {
    const quest = gem.quests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      completeQuest(gem.id, questId, quest.points);
    }
  };

  return (
    <motion.div
      className={`gem-card ${gem.status} ${compact ? 'compact' : ''}`}
      style={{ '--gem-color': gem.color }}
      whileHover={{ scale: compact ? 1.02 : 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="gem-header">
        <div className="gem-icon-container">
          <span className="gem-icon">{gem.icon}</span>
          {gem.status === 'bright' && (
            <motion.div
              className="gem-glow"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
        
        <div className="gem-info">
          <h3 className="gem-name">{gem.name}</h3>
          {!compact && <p className="gem-description">{gem.description}</p>}
          
          <div className="gem-status">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>

        {!compact && (
          <div className="gem-power">
            <div className="power-ring">
              <svg width="50" height="50">
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <motion.circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke={gem.color}
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - gem.power / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 20 * (1 - gem.power / 100)
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="power-percentage">{gem.power}%</div>
            </div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="gem-streak">
          <span className="streak-label">Current Streak:</span>
          <span className="streak-value">{gem.streak} days</span>
        </div>
      )}

      {showQuests && !compact && (
        <div className="gem-quests">
          <h4>Available Quests</h4>
          <div className="quests-list">
            {gem.quests.map((quest) => (
              <motion.div
                key={quest.id}
                className={`quest-item ${quest.completed ? 'completed' : ''}`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="quest-info">
                  <span className="quest-name">{quest.name}</span>
                  <span className="quest-points">+{quest.points} XP</span>
                </div>
                
                {!quest.completed && (
                  <motion.button
                    className="quest-complete-btn"
                    onClick={() => handleQuestComplete(quest.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Complete
                  </motion.button>
                )}
                
                {quest.completed && (
                  <div className="quest-completed-badge">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {compact && (
        <div className="compact-footer">
          <div className="power-bar">
            <motion.div
              className="power-fill"
              initial={{ width: 0 }}
              animate={{ width: `${gem.power}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="power-text">{gem.power}%</span>
        </div>
      )}
    </motion.div>
  );
};

export default GemCard;