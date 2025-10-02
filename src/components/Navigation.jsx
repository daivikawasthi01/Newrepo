import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Gem, 
  Trophy, 
  BarChart3, 
  Users, 
  Settings,
  Bell
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import './Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const { state, wellnessBalance } = useWellness();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: '#4A90E2' },
    { path: '/gauntlet', icon: Gem, label: 'Gauntlet', color: '#8E44AD' },
    { path: '/challenges', icon: Trophy, label: 'Challenges', color: '#E67E22' },
    { path: '/social', icon: Users, label: 'Network', color: '#E74C3C' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: '#27AE60' },
    { path: '/profile', icon: Settings, label: 'Profile', color: '#95A5A6' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <motion.div 
          className="nav-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="logo-text">YouMatter</span>
          <span className="logo-subtitle">Wellness Gauntlet</span>
        </motion.div>
        
        <div className="wellness-indicator">
          <div className="wellness-ring">
            <svg width="60" height="60" className="progress-ring">
              <circle
                cx="30"
                cy="30"
                r="25"
                stroke="#2c3e50"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="30"
                cy="30"
                r="25"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - wellnessBalance() / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 25 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 25 * (1 - wellnessBalance() / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4A90E2" />
                  <stop offset="25%" stopColor="#8E44AD" />
                  <stop offset="50%" stopColor="#E67E22" />
                  <stop offset="75%" stopColor="#27AE60" />
                  <stop offset="100%" stopColor="#E74C3C" />
                </linearGradient>
              </defs>
            </svg>
            <div className="wellness-percentage">
              {wellnessBalance()}%
            </div>
          </div>
          <span className="wellness-label">Balance</span>
        </div>
      </div>

      <div className="nav-items">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              style={{ '--item-color': item.color }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </div>

      <div className="nav-footer">
        <motion.div 
          className="notifications-badge"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} />
          {state.notifications.length > 0 && (
            <span className="notification-count">
              {state.notifications.length}
            </span>
          )}
        </motion.div>
        
        <div className="user-level">
          <div className="level-badge">
            Level {state.user.level}
          </div>
          <div className="experience-bar">
            <div 
              className="experience-fill"
              style={{ width: `${(state.user.experience % 100)}%` }}
            />
          </div>
          {user && (
            <motion.button
              className="logout-btn"
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;