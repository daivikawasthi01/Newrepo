import React from 'react';
import { motion } from 'framer-motion';
import './InfinityStone.css';

const InfinityStone = ({ 
  type, 
  isActive = false, 
  power = 0, 
  onClick, 
  size = 'large',
  showEffects = true 
}) => {
  const stoneConfigs = {
    mind: {
      name: 'Mind Stone',
      color: '#4A90E2',
      icon: '🧠',
      glowColor: 'rgba(74, 144, 226, 0.8)',
      description: 'Mental Clarity & Focus'
    },
    body: {
      name: 'Power Stone',
      color: '#8E44AD',
      icon: '💪',
      glowColor: 'rgba(142, 68, 173, 0.8)',
      description: 'Physical Health & Energy'
    },
    soul: {
      name: 'Soul Stone',
      color: '#E67E22',
      icon: '❤️',
      glowColor: 'rgba(230, 126, 34, 0.8)',
      description: 'Social & Emotional Connection'
    },
    wealth: {
      name: 'Time Stone',
      color: '#27AE60',
      icon: '💰',
      glowColor: 'rgba(39, 174, 96, 0.8)',
      description: 'Financial Wellness & Planning'
    },
    purpose: {
      name: 'Reality Stone',
      color: '#E74C3C',
      icon: '🎯',
      glowColor: 'rgba(231, 76, 60, 0.8)',
      description: 'Personal Growth & Purpose'
    },
    space: {
      name: 'Space Stone',
      color: '#3498DB',
      icon: '🌌',
      glowColor: 'rgba(52, 152, 219, 0.8)',
      description: 'Balance & Harmony'
    }
  };

  const config = stoneConfigs[type] || stoneConfigs.mind;
  const stoneSize = {
    small: 60,
    medium: 100,
    large: 140,
    xlarge: 180
  };

  const currentSize = stoneSize[size];

  return (
    <motion.div
      className={`infinity-stone ${type} ${isActive ? 'active' : 'inactive'} ${size}`}
      onClick={onClick}
      style={{
        '--stone-color': config.color,
        '--glow-color': config.glowColor,
        '--stone-size': `${currentSize}px`
      }}
      whileHover={{ 
        scale: 1.1,
        y: -10,
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotateY: isActive ? [0, 360] : 0,
      }}
      transition={{ 
        duration: 0.8,
        type: "spring",
        stiffness: 200,
        damping: 20,
        rotateY: { duration: 3, repeat: isActive ? Infinity : 0, ease: "linear" }
      }}
    >
      {/* Outer Glow Ring */}
      {showEffects && isActive && (
        <motion.div
          className="stone-outer-glow"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Power Ring */}
      <div className="stone-power-ring">
        <svg width={currentSize + 20} height={currentSize + 20}>
          <circle
            cx={(currentSize + 20) / 2}
            cy={(currentSize + 20) / 2}
            r={currentSize / 2 + 5}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.circle
            cx={(currentSize + 20) / 2}
            cy={(currentSize + 20) / 2}
            r={currentSize / 2 + 5}
            stroke={config.color}
            strokeWidth="3"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * (currentSize / 2 + 5)}`}
            strokeDashoffset={`${2 * Math.PI * (currentSize / 2 + 5) * (1 - power / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * (currentSize / 2 + 5) }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * (currentSize / 2 + 5) * (1 - power / 100)
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* Main Stone Body */}
      <motion.div
        className="stone-body"
        animate={isActive ? {
          boxShadow: [
            `0 0 20px ${config.glowColor}`,
            `0 0 40px ${config.glowColor}, 0 0 60px ${config.color}`,
            `0 0 20px ${config.glowColor}`
          ]
        } : {}}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      >
        {/* Stone Surface with Hexagonal Pattern */}
        <div className="stone-surface">
          <div className="hexagon-pattern">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="hexagon"
                animate={isActive ? {
                  opacity: [0.1, 0.6, 0.1],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isActive ? Infinity : 0,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Stone Icon */}
        <motion.div
          className="stone-icon"
          animate={isActive ? {
            scale: [1, 1.2, 1],
            filter: [
              'drop-shadow(0 0 5px currentColor)',
              'drop-shadow(0 0 15px currentColor)',
              'drop-shadow(0 0 5px currentColor)'
            ]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: isActive ? Infinity : 0, 
            ease: "easeInOut" 
          }}
        >
          {config.icon}
        </motion.div>

        {/* Power Level Indicator */}
        <div className="power-indicator">
          <span>{power}%</span>
        </div>

        {/* Energy Particles */}
        {showEffects && isActive && (
          <div className="energy-particles">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 30],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 30],
                  opacity: [1, 0],
                  scale: [0.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Stone Name */}
      <motion.div
        className="stone-name"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {config.name}
      </motion.div>

      {/* Ripple Effect on Click */}
      <motion.div
        className="click-ripple"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{ 
          scale: [0, 2], 
          opacity: [0.6, 0],
          transition: { duration: 0.6 }
        }}
      />
    </motion.div>
  );
};

export default InfinityStone;