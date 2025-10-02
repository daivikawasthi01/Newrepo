import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Shield } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      
      // Simulate login delay for better UX
      setTimeout(() => {
        // Extract name from email for personalization
        const name = email.split('@')[0].split('.').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
        
        onLogin({ 
          email, 
          name: name || 'Wellness Warrior',
          avatar: getRandomMarvelCharacter()
        });
        setIsLoading(false);
      }, 2000);
    }
  };

  const getRandomMarvelCharacter = () => {
    const characters = [
      { name: 'Iron Man', emoji: '🔴', color: '#DC143C' },
      { name: 'Captain America', emoji: '🔵', color: '#0066CC' },
      { name: 'Thor', emoji: '⚡', color: '#FFD700' },
      { name: 'Hulk', emoji: '💚', color: '#228B22' },
      { name: 'Black Widow', emoji: '🖤', color: '#2F2F2F' },
      { name: 'Hawkeye', emoji: '🏹', color: '#800080' },
      { name: 'Doctor Strange', emoji: '🔮', color: '#FF4500' },
      { name: 'Scarlet Witch', emoji: '❤️', color: '#DC143C' },
      { name: 'Vision', emoji: '💛', color: '#FFD700' },
      { name: 'Captain Marvel', emoji: '⭐', color: '#4169E1' }
    ];
    return characters[Math.floor(Math.random() * characters.length)];
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-background">
        <div className="infinity-stones-bg">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`floating-stone stone-${i + 1}`}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
        
        <div className="cosmic-particles">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Container */}
      <motion.div
        className="login-container"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="login-header">
          <motion.div
            className="app-logo"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
          >
            <div className="logo-stones">
              <span className="stone-icon mind">🧠</span>
              <span className="stone-icon body">💪</span>
              <span className="stone-icon soul">❤️</span>
              <span className="stone-icon wealth">💰</span>
              <span className="stone-icon purpose">🎯</span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            YouMatter Wellness Gauntlet
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Harness the power of the Infinity Stones for ultimate wellness
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
              <Shield className="input-icon" size={20} />
            </div>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={!email || !password || isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="loading-content"
                >
                  <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap size={20} />
                  </motion.div>
                  Activating Stones...
                </motion.div>
              ) : (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="login-content"
                >
                  <Zap size={20} />
                  Enter the Gauntlet
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p>Use any email and password to begin your wellness journey</p>
          <div className="demo-credentials">
            <span>Demo: hero@marvel.com / password123</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;