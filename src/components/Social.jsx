import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trophy, MessageCircle, UserPlus, Crown, Zap, Target, Award, Bell } from 'lucide-react';
import wellnessAPI from '../services/api';
import './Social.css';

const Social = () => {
  const [socialData, setSocialData] = useState(null);
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadSocialData();
    loadNotifications();
  }, []);

  const loadSocialData = async () => {
    try {
      setLoading(true);
      const data = await wellnessAPI.getSocialNetwork();
      setSocialData(data);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifs = await wellnessAPI.getNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to load notifications:', error);
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
    return stoneColors[stoneId] || '#ffffff';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#00ff00';
      case 'in-challenge': return '#ffd700';
      case 'offline': return '#666';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'in-challenge': return 'In Challenge';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="social-container">
        <div className="loading-spinner"></div>
        <p>Loading social network...</p>
      </div>
    );
  }

  return (
    <div className="social-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="social-header"
      >
        <h1 className="text-cosmic">Wellness Network</h1>
        <p>Connect with fellow heroes on their wellness journey</p>
        
        <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={24} />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
      </motion.div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="notifications-panel"
          >
            <h3>Recent Activities</h3>
            <div className="notifications-list">
              {notifications.slice(0, 5).map((notification, index) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="social-tabs">
        <button
          className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <Users size={20} />
          Friends
        </button>
        <button
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={20} />
          Leaderboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          <Target size={20} />
          Groups
        </button>
      </div>

      <div className="social-content">
        {activeTab === 'friends' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="friends-section"
          >
            <div className="section-header">
              <h2>Wellness Heroes</h2>
              <button className="btn btn-cosmic">
                <UserPlus size={16} />
                Find Friends
              </button>
            </div>

            <div className="friends-grid">
              {socialData.friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="friend-card"
                >
                  <div className="friend-avatar-container">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="friend-avatar"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`;
                      }}
                    />
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(friend.status) }}
                    ></div>
                  </div>

                  <div className="friend-info">
                    <h3>{friend.name}</h3>
                    <div className="friend-level">
                      <Crown size={16} />
                      Level {friend.level}
                    </div>
                    <div className="friend-status">
                      {getStatusText(friend.status)}
                    </div>
                  </div>

                  <div className="friend-stone">
                    <div
                      className="dominant-stone"
                      style={{ backgroundColor: getStoneColor(friend.dominantStone) }}
                      title={`${friend.dominantStone} stone specialist`}
                    ></div>
                    <span className="stone-label">
                      {friend.dominantStone.charAt(0).toUpperCase() + friend.dominantStone.slice(1)}
                    </span>
                  </div>

                  <div className="friend-achievement">
                    <Award size={14} />
                    <span>{friend.recentAchievement}</span>
                  </div>

                  <div className="friend-mutual">
                    <Target size={14} />
                    <span>{friend.mutualChallenges} mutual challenges</span>
                  </div>

                  <div className="friend-actions">
                    <button className="btn btn-secondary">
                      <MessageCircle size={16} />
                      Chat
                    </button>
                    <button className="btn btn-primary">
                      <Zap size={16} />
                      Challenge
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="leaderboard-section"
          >
            <div className="section-header">
              <h2>Wellness Champions</h2>
              <div className="leaderboard-filters">
                <button className="filter-btn active">All Time</button>
                <button className="filter-btn">This Week</button>
                <button className="filter-btn">This Month</button>
              </div>
            </div>

            <div className="leaderboard-list">
              {socialData.leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}
                >
                  <div className="rank-indicator">
                    {user.rank === 1 && <Crown className="rank-crown gold" />}
                    {user.rank === 2 && <Crown className="rank-crown silver" />}
                    {user.rank === 3 && <Crown className="rank-crown bronze" />}
                    <span className="rank-number">#{user.rank}</span>
                  </div>

                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <div className="user-stone">
                      <div
                        className="stone-indicator-small"
                        style={{ backgroundColor: getStoneColor(user.dominantStone) }}
                      ></div>
                      <span>{user.dominantStone}</span>
                    </div>
                  </div>

                  <div className="user-xp">
                    <Zap size={16} />
                    <span>{user.totalXP.toLocaleString()} XP</span>
                  </div>

                  {user.name === 'You' && (
                    <div className="current-user-badge">You</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="groups-section"
          >
            <div className="section-header">
              <h2>Wellness Groups</h2>
              <button className="btn btn-cosmic">
                <UserPlus size={16} />
                Create Group
              </button>
            </div>

            <div className="groups-grid">
              {socialData.groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group-card"
                >
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    <div className="group-members">
                      <Users size={16} />
                      <span>{group.members} members</span>
                    </div>
                  </div>

                  <p className="group-description">{group.description}</p>

                  <div className="group-challenge">
                    <div className="challenge-indicator">
                      <Target size={16} />
                      <span>Active Challenge</span>
                    </div>
                    <div className="challenge-name">{group.activeChallenge}</div>
                  </div>

                  <div className="group-actions">
                    <button className="btn btn-primary">
                      <MessageCircle size={16} />
                      Join Group
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Connection Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="connection-visualization"
      >
        <h3>Your Wellness Network</h3>
        <div className="network-stats">
          <div className="stat-item">
            <Users size={24} />
            <div>
              <span className="stat-number">{socialData.friends.length}</span>
              <span className="stat-label">Friends</span>
            </div>
          </div>
          <div className="stat-item">
            <Target size={24} />
            <div>
              <span className="stat-number">
                {socialData.friends.reduce((sum, friend) => sum + friend.mutualChallenges, 0)}
              </span>
              <span className="stat-label">Shared Challenges</span>
            </div>
          </div>
          <div className="stat-item">
            <Trophy size={24} />
            <div>
              <span className="stat-number">
                #{socialData.leaderboard.find(u => u.name === 'You')?.rank || 'N/A'}
              </span>
              <span className="stat-label">Global Rank</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Social;