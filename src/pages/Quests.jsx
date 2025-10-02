import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Zap, 
  Star,
  CheckCircle,
  Play,
  Filter,
  Trophy,
  Gift,
  Calendar
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import './Quests.css';

const Quests = () => {
  const { state, completeQuest, addNotification } = useWellness();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedGemType, setSelectedGemType] = useState('all');

  const allQuests = state.gems.reduce((acc, gem) => {
    const questsWithGemInfo = gem.quests.map(quest => ({
      ...quest,
      gemId: gem.id,
      gemName: gem.name,
      gemIcon: gem.icon,
      gemColor: gem.color,
      gemStatus: gem.status
    }));
    return [...acc, ...questsWithGemInfo];
  }, []);

  const filteredQuests = allQuests.filter(quest => {
    if (selectedFilter === 'completed' && !quest.completed) return false;
    if (selectedFilter === 'active' && quest.completed) return false;
    if (selectedGemType !== 'all' && quest.gemId !== selectedGemType) return false;
    return true;
  });

  const completedToday = allQuests.filter(quest => quest.completed).length;
  const totalQuests = allQuests.length;
  const availableQuests = totalQuests - completedToday;

  const questCategories = [
    { id: 'all', name: 'All Quests', color: '#667eea' },
    { id: 'mind', name: 'Mind', color: '#4A90E2' },
    { id: 'body', name: 'Body', color: '#8E44AD' },
    { id: 'soul', name: 'Soul', color: '#E67E22' },
    { id: 'wealth', name: 'Wealth', color: '#27AE60' },
    { id: 'purpose', name: 'Purpose', color: '#E74C3C' }
  ];

  const handleQuestComplete = (quest) => {
    completeQuest(quest.gemId, quest.id, quest.points);
    addNotification(
      `🎉 Quest completed! ${quest.name} (+${quest.points} XP)`,
      'achievement'
    );
  };

  const getDailyRewards = () => {
    const rewards = [];
    if (completedToday >= 5) rewards.push({ name: 'Quest Master', bonus: 50 });
    if (completedToday >= 10) rewards.push({ name: 'Dedication', bonus: 100 });
    if (completedToday >= 15) rewards.push({ name: 'Champion', bonus: 200 });
    return rewards;
  };

  const dailyRewards = getDailyRewards();

  return (
    <div className="quests-page">
      <div className="quests-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Cosmic Quests</h1>
          <p>Complete daily challenges to power up your wellness gems</p>
        </motion.div>

        <motion.div
          className="quest-stats"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle size={24} color="#27AE60" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{completedToday}</span>
              <span className="stat-label">Completed Today</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Target size={24} color="#4A90E2" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{availableQuests}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Star size={24} color="#F39C12" />
            </div>
            <div className="stat-content">
              <span className="stat-value">{state.user.experience}</span>
              <span className="stat-label">Total XP</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Daily Progress */}
      <motion.div
        className="daily-progress-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="progress-header">
          <h2>Daily Progress</h2>
          <div className="progress-percentage">
            {Math.round((completedToday / totalQuests) * 100)}%
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(completedToday / totalQuests) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="progress-text">{completedToday} of {totalQuests} quests</span>
        </div>

        {dailyRewards.length > 0 && (
          <div className="daily-rewards">
            <h3>🎁 Daily Rewards Unlocked!</h3>
            <div className="rewards-list">
              {dailyRewards.map((reward, index) => (
                <motion.div
                  key={reward.name}
                  className="reward-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Trophy size={20} color="#FFD700" />
                  <span>{reward.name} (+{reward.bonus} XP)</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        className="quest-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="filter-group">
          <h3>Filter by Status:</h3>
          <div className="filter-buttons">
            {['all', 'active', 'completed'].map(filter => (
              <motion.button
                key={filter}
                className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={16} />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Filter by Category:</h3>
          <div className="category-buttons">
            {questCategories.map(category => (
              <motion.button
                key={category.id}
                className={`category-btn ${selectedGemType === category.id ? 'active' : ''}`}
                style={{ '--category-color': category.color }}
                onClick={() => setSelectedGemType(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quests Grid */}
      <motion.div
        className="quests-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <AnimatePresence>
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={`${quest.gemId}-${quest.id}`}
              className={`quest-card ${quest.completed ? 'completed' : ''}`}
              style={{ '--gem-color': quest.gemColor }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              layout
            >
              <div className="quest-header">
                <div className="gem-indicator">
                  <span className="gem-icon">{quest.gemIcon}</span>
                  <span className="gem-name">{quest.gemName}</span>
                </div>
                
                {quest.completed ? (
                  <div className="completion-badge">
                    <CheckCircle size={20} color="#27AE60" />
                  </div>
                ) : (
                  <div className="quest-points">
                    +{quest.points} XP
                  </div>
                )}
              </div>

              <div className="quest-content">
                <h3 className="quest-name">{quest.name}</h3>
                
                <div className="quest-details">
                  <div className="quest-difficulty">
                    {quest.points <= 15 && (
                      <span className="difficulty easy">Easy</span>
                    )}
                    {quest.points > 15 && quest.points <= 20 && (
                      <span className="difficulty medium">Medium</span>
                    )}
                    {quest.points > 20 && (
                      <span className="difficulty hard">Hard</span>
                    )}
                  </div>
                  
                  <div className="quest-time">
                    <Clock size={14} />
                    <span>
                      {quest.points <= 15 && '5-10 min'}
                      {quest.points > 15 && quest.points <= 20 && '15-20 min'}
                      {quest.points > 20 && '30+ min'}
                    </span>
                  </div>
                </div>

                <div className="quest-status">
                  {quest.gemStatus === 'bright' && (
                    <div className="status-indicator active">
                      <Zap size={14} />
                      <span>Gem Active</span>
                    </div>
                  )}
                  {quest.gemStatus === 'draining' && (
                    <div className="status-indicator warning">
                      <Target size={14} />
                      <span>Urgent</span>
                    </div>
                  )}
                  {quest.gemStatus === 'dim' && (
                    <div className="status-indicator inactive">
                      <Play size={14} />
                      <span>Needs Activation</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="quest-actions">
                {!quest.completed ? (
                  <motion.button
                    className="complete-quest-btn"
                    onClick={() => handleQuestComplete(quest)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle size={18} />
                    Complete Quest
                  </motion.button>
                ) : (
                  <div className="completed-indicator">
                    <CheckCircle size={18} color="#27AE60" />
                    <span>Completed!</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredQuests.length === 0 && (
        <motion.div
          className="no-quests"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Target size={64} color="#bdc3c7" />
          <h3>No Quests Found</h3>
          <p>Try adjusting your filters to see more quests.</p>
        </motion.div>
      )}

      {/* Weekly Challenge Preview */}
      <motion.div
        className="weekly-challenge"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="challenge-header">
          <div className="challenge-icon">
            <Calendar size={32} />
          </div>
          <div className="challenge-info">
            <h3>Weekly Challenge</h3>
            <p>Complete all daily quests for 7 consecutive days</p>
          </div>
          <div className="challenge-reward">
            <Gift size={24} color="#FFD700" />
            <span>500 XP Bonus</span>
          </div>
        </div>
        
        <div className="challenge-progress">
          <div className="progress-days">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className={`day-indicator ${state.user.streak > index ? 'completed' : ''}`}
              >
                Day {index + 1}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Quests;