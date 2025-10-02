import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Smartphone,
  Crown,
  Trophy,
  Target,
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import './Profile.css';

const Profile = () => {
  const { state, wellnessBalance } = useWellness();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: state.user.name,
    email: 'wellness.warrior@youmatter.com',
    bio: 'On a journey to achieve perfect wellness balance through consistent daily practices.'
  });

  const profileSections = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const userStats = [
    {
      label: 'Current Balance',
      value: `${wellnessBalance()}%`,
      icon: Target,
      color: '#4A90E2',
      description: 'Your overall wellness score'
    },
    {
      label: 'Active Streak',
      value: `${state.user.streak} days`,
      icon: Calendar,
      color: '#E67E22',
      description: 'Consecutive days with activity'
    },
    {
      label: 'Total Experience',
      value: state.user.experience,
      icon: Crown,
      color: '#8E44AD',
      description: 'Points earned from quests'
    },
    {
      label: 'Level',
      value: state.user.level,
      icon: Trophy,
      color: '#27AE60',
      description: 'Your current wellness level'
    }
  ];

  const recentActivity = [
    { action: 'Completed Mind Gem quest', time: '2 hours ago', points: 20 },
    { action: 'Achieved 80% wellness balance', time: '1 day ago', points: 50 },
    { action: 'Joined Wellness Warrior challenge', time: '2 days ago', points: 25 },
    { action: 'Connected with 3 community members', time: '3 days ago', points: 15 },
    { action: 'Maintained 7-day streak', time: '1 week ago', points: 100 }
  ];

  const handleSaveProfile = () => {
    // Save profile changes
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: state.user.name,
      email: 'wellness.warrior@youmatter.com',
      bio: 'On a journey to achieve perfect wellness balance through consistent daily practices.'
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <motion.div
          className="profile-banner"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="banner-background">
            <div className="wellness-visualization">
              {state.gems.map((gem, index) => (
                <motion.div
                  key={gem.id}
                  className={`floating-gem ${gem.status}`}
                  style={{ '--gem-color': gem.color }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: gem.status === 'bright' ? [0.6, 1, 0.6] : 0.3
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  {gem.icon}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="profile-info">
            <div className="avatar-section">
              <motion.div
                className="profile-avatar"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                🧠
                <div className="level-badge">
                  <Crown size={16} />
                  {state.user.level}
                </div>
              </motion.div>
              
              {!isEditing ? (
                <motion.button
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit3 size={16} />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="edit-actions">
                  <motion.button
                    className="save-btn"
                    onClick={handleSaveProfile}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={16} />
                    Save
                  </motion.button>
                  <motion.button
                    className="cancel-btn"
                    onClick={handleCancelEdit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={16} />
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>

            <div className="user-details">
              {!isEditing ? (
                <>
                  <h1 className="user-name">{editedProfile.name}</h1>
                  <p className="user-email">{editedProfile.email}</p>
                  <p className="user-bio">{editedProfile.bio}</p>
                </>
              ) : (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="edit-input name-input"
                    placeholder="Your name"
                  />
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="edit-input email-input"
                    placeholder="Your email"
                  />
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                    className="edit-input bio-input"
                    placeholder="Tell us about your wellness journey..."
                    rows="3"
                  />
                </div>
              )}
              
              <div className="user-badges">
                <div className="badge">Wellness Warrior</div>
                <div className="badge">7-Day Streak</div>
                <div className="badge">Community Member</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stats-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {userStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              style={{ '--stat-color': stat.color }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
                <span className="stat-description">{stat.description}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Section Navigation */}
      <motion.div
        className="section-navigation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {profileSections.map(section => (
          <motion.button
            key={section.id}
            className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <section.icon size={20} />
            {section.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Section Content */}
      <motion.div
        className="section-content"
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="activity-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="activity-content">
                        <p className="activity-action">{activity.action}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                      <div className="activity-points">
                        +{activity.points} XP
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="wellness-summary">
                <h2>Wellness Summary</h2>
                <div className="gem-status-grid">
                  {state.gems.map((gem, index) => (
                    <motion.div
                      key={gem.id}
                      className={`gem-status-item ${gem.status}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="gem-icon-small" style={{ color: gem.color }}>
                        {gem.icon}
                      </div>
                      <div className="gem-info">
                        <h4>{gem.name}</h4>
                        <div className="gem-power-bar">
                          <div 
                            className="power-fill" 
                            style={{ 
                              width: `${gem.power}%`,
                              backgroundColor: gem.color 
                            }}
                          />
                        </div>
                        <span className="power-text">{gem.power}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className="achievements-section">
            <h2>Your Achievements</h2>
            <div className="achievements-grid">
              {state.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: achievement.unlocked ? 1.05 : 1.02 }}
                >
                  <div className="achievement-icon">
                    {achievement.unlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="achievement-content">
                    <h3>{achievement.name}</h3>
                    <p>{achievement.description}</p>
                    <div className={`achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                      {achievement.unlocked ? 'Unlocked!' : 'Not yet achieved'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="settings-section">
            <h2>Account Settings</h2>
            <div className="settings-groups">
              <div className="settings-group">
                <h3>Profile Settings</h3>
                <div className="setting-item">
                  <User size={20} />
                  <div className="setting-content">
                    <h4>Personal Information</h4>
                    <p>Update your name, email, and profile picture</p>
                  </div>
                  <button className="setting-action">Edit</button>
                </div>
                <div className="setting-item">
                  <Shield size={20} />
                  <div className="setting-content">
                    <h4>Privacy Settings</h4>
                    <p>Control who can see your wellness progress</p>
                  </div>
                  <button className="setting-action">Configure</button>
                </div>
              </div>

              <div className="settings-group">
                <h3>App Preferences</h3>
                <div className="setting-item">
                  <Smartphone size={20} />
                  <div className="setting-content">
                    <h4>Connected Devices</h4>
                    <p>Manage your fitness trackers and health apps</p>
                  </div>
                  <button className="setting-action">Manage</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="notifications-section">
            <h2>Notification Preferences</h2>
            <div className="notification-settings">
              <div className="notification-group">
                <h3>Quest Reminders</h3>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>Daily Quest Reminders</h4>
                    <p>Get notified about incomplete daily quests</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>Streak Warnings</h4>
                    <p>Alerts when your streak is at risk</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="notification-group">
                <h3>Community</h3>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>Challenge Invitations</h4>
                    <p>When friends invite you to join challenges</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <h4>Achievement Celebrations</h4>
                    <p>Share your achievements with the community</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;