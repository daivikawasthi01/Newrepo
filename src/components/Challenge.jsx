import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, Zap, Target, Award, Play, CheckCircle } from 'lucide-react';
import wellnessAPI from '../services/api';
import './Challenge.css';

const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [joinedChallenges, setJoinedChallenges] = useState(new Set());
  const [stoneUpdates, setStoneUpdates] = useState([]);
  const [showStoneUpdate, setShowStoneUpdate] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const challengeData = await wellnessAPI.getChallenges();
      console.log('Loaded challenges:', challengeData);
      setChallenges(challengeData || []);
    } catch (error) {
      console.error('Failed to load challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      const result = await wellnessAPI.joinChallenge(challengeId);
      if (result.success) {
        setJoinedChallenges(prev => new Set([...prev, challengeId]));
        setStoneUpdates(result.stoneUpdates);
        setShowStoneUpdate(true);
        
        // Update challenges list
        setChallenges(prev => 
          prev.map(challenge => 
            challenge.id === challengeId 
              ? { ...challenge, participants: challenge.participants + 1, status: 'active' }
              : challenge
          )
        );

        // Hide stone update animation after 3 seconds
        setTimeout(() => setShowStoneUpdate(false), 3000);
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const handleCompleteActivity = async (challengeId) => {
    try {
      const result = await wellnessAPI.completeActivity(challengeId, {
        type: 'daily-activity',
        timestamp: new Date()
      });
      
      if (result.success) {
        setStoneUpdates(result.stoneUpdates);
        setShowStoneUpdate(true);
        
        // Update challenge progress
        setChallenges(prev => 
          prev.map(challenge => 
            challenge.id === challengeId 
              ? { ...challenge, progress: challenge.progress + 1 }
              : challenge
          )
        );

        setTimeout(() => setShowStoneUpdate(false), 3000);
      }
    } catch (error) {
      console.error('Failed to complete activity:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#00ff00';
      case 'medium': return '#ffd700';
      case 'hard': return '#ff4500';
      default: return '#ffffff';
    }
  };

  const getStoneColor = (stoneId) => {
    const stoneColors = {
      power: '#8a2be2',
      space: '#0066ff',
      reality: '#ff0000',
      soul: '#ff8c00',
      time: '#00ff00',
      mind: '#ffff00'
    };
    return stoneColors[stoneId] || '#666666';
  };

  const getStoneIcon = (stoneId) => {
    const stoneIcons = {
      power: '💪',
      space: '🌌',
      reality: '🔮',
      soul: '❤️',
      time: '⏰',
      mind: '🧠'
    };
    return stoneIcons[stoneId] || '💎';
  };

  if (loading) {
    return (
      <div className="challenge-container">
        <div className="loading-spinner"></div>
        <p>Loading challenges...</p>
      </div>
    );
  }

  return (
    <div className="challenge-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="challenge-header"
      >
        <h1 className="text-cosmic">Wellness Challenges</h1>
        <p>Join challenges to strengthen your Infinity Stones and connect with the community</p>
      </motion.div>

      {/* Stone Update Animation */}
      <AnimatePresence>
        {showStoneUpdate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="stone-update-notification"
          >
            <div className="stone-update-content">
              <Zap className="update-icon" />
              <div>
                <h3>Stone Energy Surge!</h3>
                <div className="stone-updates">
                  {stoneUpdates.map((update, index) => (
                    <div key={index} className="stone-update-item">
                      <div 
                        className="stone-indicator"
                        style={{ backgroundColor: getStoneColor(update.stone?.id) }}
                      ></div>
                      <span>
                        {update.stone?.name}: +{Math.abs(update.rippleEffects?.length * 5 || 10)} energy
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="challenges-grid">
        {challenges && challenges.length > 0 ? challenges.map((challenge, index) => {
          if (!challenge) return null;
          return (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`challenge-card ${challenge.status || 'available'}`}
            onClick={() => setSelectedChallenge(challenge)}
          >
            <div className="challenge-header-card">
              <div className="challenge-type">
                <Target size={20} />
                <span>{challenge.type}</span>
              </div>
              <div 
                className="challenge-difficulty"
                style={{ color: getDifficultyColor(challenge.difficulty) }}
              >
                {challenge.difficulty}
              </div>
            </div>

            <h3 className="challenge-title">{challenge.title}</h3>
            <p className="challenge-description">{challenge.description}</p>

            <div className="challenge-stones">
              <span>🏆 Stones Gained on Completion:</span>
              <div className="stone-rewards">
                {challenge.stoneImpact?.map((impact, idx) => (
                  <div key={idx} className="stone-reward">
                    <div
                      className="stone-indicator"
                      style={{ backgroundColor: getStoneColor(impact.stoneId) }}
                      title={impact.stoneId}
                    >
                      {getStoneIcon(impact.stoneId)}
                    </div>
                    <span className="stone-name">{impact.stoneId.toUpperCase()}</span>
                    <span className="stone-gain">+{impact.change}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="challenge-progress">
              <div className="progress-info">
                <span>Progress: {challenge.progress}/{challenge.duration}</span>
                <span>{Math.round((challenge.progress / challenge.duration) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(challenge.progress / challenge.duration) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            <div className="challenge-stats">
              <div className="stat">
                <Users size={16} />
                <span>{challenge.participants}</span>
              </div>
              <div className="stat">
                <Calendar size={16} />
                <span>{challenge.duration} days</span>
              </div>
              <div className="stat">
                <Award size={16} />
                <span>{challenge.rewards.xp} XP</span>
              </div>
            </div>

            <div className="challenge-actions">
              {joinedChallenges.has(challenge.id) || challenge.status === 'active' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCompleteActivity(challenge.id);
                  }}
                >
                  <CheckCircle size={16} />
                  Complete Activity
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-cosmic"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinChallenge(challenge.id);
                  }}
                >
                  <Play size={16} />
                  Join Challenge
                </motion.button>
              )}
            </div>

            {/* Stone Impact Preview */}
            <div className="stone-impact-preview">
              {challenge.stoneImpact?.map((impact, idx) => (
                <div key={idx} className="impact-item">
                  <div 
                    className="impact-stone"
                    style={{ backgroundColor: getStoneColor(impact.stoneId) }}
                  >
                    {getStoneIcon(impact.stoneId)}
                  </div>
                  <span className="impact-value">+{impact.change}</span>
                </div>
              )) || []}
            </div>
          </motion.div>
        );
        }) : (
          <div className="no-challenges">
            <p>No challenges available at the moment.</p>
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="challenge-modal-overlay"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="challenge-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedChallenge.title}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedChallenge(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <p className="modal-description">{selectedChallenge.description}</p>
                
                <div className="modal-details">
                  <div className="detail-section">
                    <h4>Challenge Impact</h4>
                    <div className="stone-impacts">
                      {selectedChallenge.stoneImpact?.map((impact, idx) => (
                        <div key={idx} className="impact-detail">
                          <div 
                            className="impact-stone-large"
                            style={{ backgroundColor: getStoneColor(impact.stoneId) }}
                          >
                            {getStoneIcon(impact.stoneId)}
                          </div>
                          <div className="impact-info">
                            <span className="stone-name">{impact.stoneId.charAt(0).toUpperCase() + impact.stoneId.slice(1)} Stone</span>
                            <span className="impact-value">+{impact.change} progress per activity</span>
                          </div>
                        </div>
                      )) || []}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Rewards</h4>
                    <div className="rewards-info">
                      <div className="reward-item">
                        <Trophy size={20} />
                        <span>{selectedChallenge.rewards.xp} XP</span>
                      </div>
                      <div className="reward-item">
                        <Zap size={20} />
                        <span>{selectedChallenge.rewards.energy} Energy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  {joinedChallenges.has(selectedChallenge.id) || selectedChallenge.status === 'active' ? (
                    <button
                      className="btn btn-success btn-large"
                      onClick={() => {
                        handleCompleteActivity(selectedChallenge.id);
                        setSelectedChallenge(null);
                      }}
                    >
                      <CheckCircle size={20} />
                      Complete Today's Activity
                    </button>
                  ) : (
                    <button
                      className="btn btn-cosmic btn-large"
                      onClick={() => {
                        handleJoinChallenge(selectedChallenge.id);
                        setSelectedChallenge(null);
                      }}
                    >
                      <Play size={20} />
                      Join This Challenge
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Challenge;