import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  Heart,
  Share2,
  Crown,
  Zap,
  Target,
  Calendar,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import './Community.css';

const Community = () => {
  const { state, addNotification } = useWellness();
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Mock community data
  const communityFeed = [
    {
      id: 1,
      user: 'Sarah Chen',
      avatar: '👩‍💼',
      action: 'completed the Mind Gem quest',
      quest: 'Daily Meditation',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
      achievement: 'Mindfulness Master',
      streakCount: 15
    },
    {
      id: 2,
      user: 'Alex Rodriguez',
      avatar: '👨‍🏫',
      action: 'achieved Perfect Balance',
      timestamp: '4 hours ago',
      likes: 28,
      comments: 8,
      achievement: 'Balance Champion',
      balanceScore: 100
    },
    {
      id: 3,
      user: 'Maya Patel',
      avatar: '👩‍🎨',
      action: 'started a 30-day challenge',
      challenge: 'Wellness Warrior',
      timestamp: '6 hours ago',
      likes: 15,
      comments: 5,
      participants: 47
    },
    {
      id: 4,
      user: 'James Wilson',
      avatar: '👨‍💻',
      action: 'shared a wellness tip',
      tip: 'Morning sunlight for 10 minutes boosts energy and mood!',
      timestamp: '8 hours ago',
      likes: 22,
      comments: 12
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Emma Thompson', avatar: '👸', score: 2850, streak: 28, badge: 'Wellness Queen' },
    { rank: 2, name: 'David Kim', avatar: '🤴', score: 2740, streak: 25, badge: 'Balance Master' },
    { rank: 3, name: 'Lisa Wang', avatar: '🌟', score: 2690, streak: 22, badge: 'Gem Collector' },
    { rank: 4, name: 'You', avatar: '🧠', score: 2580, streak: state.user.streak, badge: 'Rising Star' },
    { rank: 5, name: 'Carlos Silva', avatar: '⚡', score: 2450, streak: 18, badge: 'Quest Hunter' }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Wellness Warrior',
      description: 'Complete all daily quests for 30 consecutive days',
      duration: '30 days',
      participants: 234,
      reward: '1000 XP + Exclusive Badge',
      difficulty: 'Hard',
      category: 'Endurance',
      daysLeft: 12,
      progress: 60,
      isJoined: true
    },
    {
      id: 2,
      title: 'Mind-Body Harmony',
      description: 'Maintain both Mind and Body gems active for 2 weeks',
      duration: '14 days',
      participants: 156,
      reward: '500 XP + Harmony Badge',
      difficulty: 'Medium',
      category: 'Balance',
      daysLeft: 8,
      progress: 0,
      isJoined: false
    },
    {
      id: 3,
      title: 'Social Butterfly',
      description: 'Connect with 10 friends and complete 5 Soul Gem quests',
      duration: '7 days',
      participants: 89,
      reward: '300 XP + Social Badge',
      difficulty: 'Easy',
      category: 'Social',
      daysLeft: 5,
      progress: 0,
      isJoined: false
    },
    {
      id: 4,
      title: 'Perfect Week',
      description: 'Achieve 100% wellness balance for 7 consecutive days',
      duration: '7 days',
      participants: 67,
      reward: '750 XP + Perfection Badge',
      difficulty: 'Hard',
      category: 'Excellence',
      daysLeft: 3,
      progress: 0,
      isJoined: false
    }
  ];

  const handleLike = (postId) => {
    addNotification(`❤️ You liked a community post!`, 'info');
  };

  const handleJoinChallenge = (challengeId) => {
    addNotification(`🎯 You joined a community challenge!`, 'achievement');
  };

  const handleShare = (item) => {
    addNotification(`📤 Achievement shared with community!`, 'info');
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Wellness Community</h1>
          <p>Connect, compete, and grow with fellow wellness warriors</p>
        </motion.div>

        <motion.div
          className="community-stats"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="stat-item">
            <Users size={20} />
            <span className="stat-value">12.5K</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-item">
            <Zap size={20} />
            <span className="stat-value">47K</span>
            <span className="stat-label">Quests Completed</span>
          </div>
          <div className="stat-item">
            <Trophy size={20} />
            <span className="stat-value">156</span>
            <span className="stat-label">Active Challenges</span>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <motion.div
        className="tab-navigation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {[
          { id: 'feed', label: 'Community Feed', icon: MessageCircle },
          { id: 'challenges', label: 'Challenges', icon: Target },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
        ].map(tab => (
          <motion.button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon size={20} />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'feed' && (
          <motion.div
            key="feed"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="feed-controls">
              <div className="search-bar">
                <Search size={20} />
                <input 
                  type="text" 
                  placeholder="Search community posts..." 
                  className="search-input"
                />
              </div>
              <div className="filter-buttons">
                <button className="filter-btn active">
                  <Filter size={16} />
                  All Posts
                </button>
                <button className="filter-btn">Friends</button>
                <button className="filter-btn">Achievements</button>
              </div>
            </div>

            <div className="community-feed">
              {communityFeed.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="feed-post"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="post-header">
                    <div className="user-info">
                      <div className="user-avatar">{post.avatar}</div>
                      <div className="user-details">
                        <h4 className="user-name">{post.user}</h4>
                        <span className="post-time">{post.timestamp}</span>
                      </div>
                    </div>
                    {post.achievement && (
                      <div className="achievement-badge">
                        <Trophy size={16} />
                        {post.achievement}
                      </div>
                    )}
                  </div>

                  <div className="post-content">
                    <p className="post-text">
                      <strong>{post.user}</strong> {post.action}
                      {post.quest && <span className="highlight"> "{post.quest}"</span>}
                      {post.challenge && <span className="highlight"> "{post.challenge}"</span>}
                    </p>

                    {post.tip && (
                      <div className="post-tip">
                        💡 <em>{post.tip}</em>
                      </div>
                    )}

                    {post.streakCount && (
                      <div className="post-stats">
                        <div className="stat-chip">
                          🔥 {post.streakCount} day streak
                        </div>
                      </div>
                    )}

                    {post.balanceScore && (
                      <div className="post-stats">
                        <div className="stat-chip perfect-balance">
                          ⚖️ {post.balanceScore}% Perfect Balance
                        </div>
                      </div>
                    )}

                    {post.participants && (
                      <div className="post-stats">
                        <div className="stat-chip">
                          👥 {post.participants} participants joined
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="post-actions">
                    <motion.button
                      className="action-btn like"
                      onClick={() => handleLike(post.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart size={18} />
                      {post.likes}
                    </motion.button>

                    <motion.button
                      className="action-btn comment"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MessageCircle size={18} />
                      {post.comments}
                    </motion.button>

                    <motion.button
                      className="action-btn share"
                      onClick={() => handleShare(post)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 size={18} />
                      Share
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="challenges-header">
              <h2>Community Challenges</h2>
              <motion.button
                className="create-challenge-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Create Challenge
              </motion.button>
            </div>

            <div className="challenges-grid">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  className={`challenge-card ${challenge.isJoined ? 'joined' : ''}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="challenge-header">
                    <div className="challenge-category">
                      {challenge.category}
                    </div>
                    <div className={`challenge-difficulty ${challenge.difficulty.toLowerCase()}`}>
                      {challenge.difficulty}
                    </div>
                  </div>

                  <div className="challenge-content">
                    <h3 className="challenge-title">{challenge.title}</h3>
                    <p className="challenge-description">{challenge.description}</p>

                    <div className="challenge-stats">
                      <div className="stat-row">
                        <Calendar size={16} />
                        <span>{challenge.duration}</span>
                      </div>
                      <div className="stat-row">
                        <Users size={16} />
                        <span>{challenge.participants} participants</span>
                      </div>
                      <div className="stat-row">
                        <Trophy size={16} />
                        <span>{challenge.reward}</span>
                      </div>
                    </div>

                    {challenge.isJoined && (
                      <div className="challenge-progress">
                        <div className="progress-header">
                          <span>Progress: {challenge.progress}%</span>
                          <span>{challenge.daysLeft} days left</span>
                        </div>
                        <div className="progress-bar">
                          <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${challenge.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="challenge-actions">
                    {challenge.isJoined ? (
                      <div className="joined-indicator">
                        <Zap size={18} />
                        <span>Participating</span>
                      </div>
                    ) : (
                      <motion.button
                        className="join-challenge-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinChallenge(challenge.id);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={18} />
                        Join Challenge
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="leaderboard-header">
              <h2>Wellness Leaderboard</h2>
              <div className="leaderboard-filters">
                <button className="filter-btn active">This Week</button>
                <button className="filter-btn">This Month</button>
                <button className="filter-btn">All Time</button>
              </div>
            </div>

            <div className="leaderboard-list">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''} ${user.rank <= 3 ? 'top-three' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="rank-section">
                    <div className={`rank-number ${user.rank <= 3 ? 'top-rank' : ''}`}>
                      {user.rank <= 3 ? (
                        user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                      ) : (
                        user.rank
                      )}
                    </div>
                  </div>

                  <div className="user-section">
                    <div className="user-avatar-large">{user.avatar}</div>
                    <div className="user-info-detailed">
                      <h4 className="user-name">{user.name}</h4>
                      <span className="user-badge">{user.badge}</span>
                    </div>
                  </div>

                  <div className="stats-section">
                    <div className="stat-item">
                      <span className="stat-value">{user.score.toLocaleString()}</span>
                      <span className="stat-label">XP</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{user.streak}</span>
                      <span className="stat-label">Streak</span>
                    </div>
                  </div>

                  {user.rank === 1 && (
                    <div className="crown-icon">
                      <Crown size={24} color="#FFD700" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="leaderboard-footer">
              <p>🎯 Keep completing quests to climb the leaderboard!</p>
              <motion.button
                className="share-progress-btn"
                onClick={() => handleShare({ type: 'leaderboard', rank: 4 })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={18} />
                Share Your Progress
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;