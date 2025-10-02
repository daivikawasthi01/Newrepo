// Simulated Backend API Service
class WellnessAPI {
  constructor() {
    this.baseURL = 'https://api.wellness-gauntlet.com';
    this.currentUser = null;
    this.stones = this.initializeGamifiedStones();
    this.challenges = this.initializeChallenges();
    this.socialNetwork = this.initializeSocialNetwork();
    this.notifications = [];
    
    // Load from localStorage if available
    this.loadUserData();
  }

  // Initialize stone data with gamified progression
  initializeGamifiedStones() {
    return {
      mind: {
        id: 'mind',
        name: 'Mind Stone',
        color: '#ffff00',
        progress: 10, // Dim but visible
        level: 1,
        energy: 20,
        icon: '🧠',
        connectedTo: [],
        abilities: ['Mindfulness', 'Focus', 'Awareness'],
        recentActivity: 'Ready for first quest',
        multiplier: 1.0,
        unlocked: true,
        status: 'dim',
        glowing: false,
        description: 'Your first stone - ignite it with mindfulness'
      },
      power: {
        id: 'power',
        name: 'Power Stone', 
        color: '#8a2be2',
        progress: 0,
        level: 0,
        energy: 0,
        icon: '💪',
        connectedTo: [],
        abilities: ['Strength', 'Endurance', 'Physical Power'],
        recentActivity: 'Locked - Complete Mind Gem quests to unlock',
        multiplier: 0,
        unlocked: false,
        status: 'locked',
        glowing: false,
        description: 'Unlock with 3 days of Mind Gem activity'
      },
      space: {
        id: 'space',
        name: 'Space Stone',
        color: '#0066ff', 
        progress: 0,
        level: 0,
        energy: 0,
        icon: '🌌',
        connectedTo: [],
        abilities: ['Travel', 'Exploration', 'Adventure'],
        recentActivity: 'Locked - Complete introductory quests',
        multiplier: 0,
        unlocked: false,
        status: 'locked',
        glowing: false,
        description: 'Unlock with Power Stone activation'
      },
      reality: {
        id: 'reality',
        name: 'Reality Stone',
        color: '#ff0000',
        progress: 0,
        level: 0,
        energy: 0,
        icon: '🔮',
        connectedTo: [],
        abilities: ['Goal Setting', 'Visualization', 'Life Balance'],
        recentActivity: 'Locked - Master other stones first',
        multiplier: 0,
        unlocked: false,
        status: 'locked',
        glowing: false,
        description: 'Unlock with Space Stone mastery'
      },
      soul: {
        id: 'soul', 
        name: 'Soul Stone',
        color: '#ff8c00',
        progress: 0,
        level: 0,
        energy: 0,
        icon: '❤️',
        connectedTo: [],
        abilities: ['Relationships', 'Emotional Wellness', 'Empathy'],
        recentActivity: 'Locked - Requires deep wellness understanding',
        multiplier: 0,
        unlocked: false,
        status: 'locked',
        glowing: false,
        description: 'Unlock with Reality Stone wisdom'
      },
      time: {
        id: 'time',
        name: 'Time Stone',
        color: '#00ff00',
        progress: 0,
        level: 0,
        energy: 0,
        icon: '⏰',
        connectedTo: [],
        abilities: ['Time Management', 'Productivity', 'Life Balance'],
        recentActivity: 'Locked - Master of all wellness required',
        multiplier: 0,
        unlocked: false,
        status: 'locked',
        glowing: false,
        description: 'Final stone - unlock with all others mastered'
      }
    };
  }

  // Initialize challenge system
  initializeChallenges() {
    return [
      // Introductory Mind Gem Quest
      {
        id: 'mind-gem-intro',
        title: '🧠 Ignite the Mind Gem',
        description: 'Perform one act of mindfulness to ignite your first Infinity Stone. This is your first step towards cosmic wellness balance.',
        type: 'intro-quest',
        duration: 1,
        progress: 0,
        difficulty: 'beginner',
        stones: ['mind'],
        rewards: { xp: 100, energy: 25 },
        participants: 1,
        status: 'available',
        stoneImpact: [
          { stoneId: 'mind', change: 25 }
        ],
        unlockCondition: 'always-available',
        questType: 'intro'
      },
      {
        id: 'morning-routine',
        title: '🌅 Morning Mindfulness',
        description: 'Establish a mindful morning routine to strengthen your Mind Gem',
        type: 'habit',
        duration: 7,
        progress: 0,
        difficulty: 'easy',
        stones: ['mind'],
        rewards: { xp: 200, energy: 20 },
        participants: 45,
        status: 'available',
        stoneImpact: [
          { stoneId: 'mind', change: 15 }
        ],
        unlockCondition: 'mind-gem-intro-completed'
      },
      // Power Stone Unlock Quest
      {
        id: 'power-stone-unlock',
        title: '💪 Unlock the Power Stone',
        description: 'Complete 3 Mind Gem quests to unlock the Power Stone. Physical strength comes from mental clarity.',
        type: 'unlock-quest',
        duration: 1,
        progress: 0,
        difficulty: 'easy',
        stones: ['power'],
        rewards: { xp: 300, energy: 30 },
        participants: 23,
        status: 'locked',
        stoneImpact: [
          { stoneId: 'power', change: 20 }
        ],
        unlockCondition: 'complete-3-mind-quests',
        questType: 'unlock'
      },
      {
        id: 'fitness-challenge',
        title: '🏃 Daily Movement Quest',
        description: 'Log one physical activity to strengthen your Power Stone',
        type: 'physical',
        duration: 1,
        progress: 0,
        difficulty: 'easy',
        stones: ['power'],
        rewards: { xp: 150, energy: 15 },
        participants: 89,
        status: 'locked',
        stoneImpact: [
          { stoneId: 'power', change: 15 }
        ],
        unlockCondition: 'power-stone-unlocked'
      },
      {
        id: 'mindfulness-journey',
        title: '🧘 3-Minute Meditation',
        description: 'Practice mindfulness meditation to deepen your Mind Gem connection',
        type: 'mental',
        duration: 1,
        progress: 0,
        difficulty: 'easy',
        stones: ['mind'],
        rewards: { xp: 100, energy: 10 },
        participants: 234,
        status: 'available',
        stoneImpact: [
          { stoneId: 'mind', change: 10 }
        ],
        unlockCondition: 'mind-gem-intro-completed'
      },
      {
        id: 'social-wellness',
        title: '❤️ Connect with Others',
        description: 'Engage in meaningful social interaction to unlock the Soul Stone',
        type: 'social',
        duration: 1,
        progress: 0,
        difficulty: 'easy',
        stones: ['soul'],
        rewards: { xp: 200, energy: 20 },
        participants: 67,
        status: 'locked',
        stoneImpact: [
          { stoneId: 'soul', change: 20 }
        ],
        unlockCondition: 'complete-5-total-quests'
      },
      {
        id: 'advanced-challenge',
        title: '⭐ Master of Balance',
        description: 'Maintain all unlocked gems glowing for 7 consecutive days',
        type: 'mastery',
        duration: 7,
        progress: 0,
        difficulty: 'master',
        stones: ['time', 'space', 'reality', 'soul', 'power', 'mind'],
        rewards: { xp: 2000, energy: 100 },
        participants: 12,
        status: 'locked',
        stoneImpact: [
          { stoneId: 'time', change: 50 },
          { stoneId: 'space', change: 30 },
          { stoneId: 'reality', change: 25 }
        ],
        unlockCondition: 'all-stones-unlocked'
      }
    ];
  }

  // Initialize social network
  initializeSocialNetwork() {
    return {
      friends: [
        {
          id: 'user1',
          name: 'Tony Stark',
          avatar: 'https://cdn.jsdelivr.net/gh/marvel-unlimited/assets/characters/iron-man.jpg',
          level: 42,
          dominantStone: 'mind',
          status: 'online',
          recentAchievement: 'Completed Tech Innovation Challenge',
          mutualChallenges: 3
        },
        {
          id: 'user2',
          name: 'Natasha Romanoff',
          avatar: 'https://cdn.jsdelivr.net/gh/marvel-unlimited/assets/characters/black-widow.jpg',
          level: 38,
          dominantStone: 'power',
          status: 'in-challenge',
          recentAchievement: 'Fitness Master Achievement',
          mutualChallenges: 2
        },
        {
          id: 'user3',
          name: 'Stephen Strange',
          avatar: 'https://cdn.jsdelivr.net/gh/marvel-unlimited/assets/characters/doctor-strange.jpg',
          level: 45,
          dominantStone: 'time',
          status: 'offline',
          recentAchievement: 'Time Management Guru',
          mutualChallenges: 4
        }
      ],
      leaderboard: [
        { rank: 1, name: 'Stephen Strange', totalXP: 15420, dominantStone: 'time' },
        { rank: 2, name: 'Tony Stark', totalXP: 14890, dominantStone: 'mind' },
        { rank: 3, name: 'You', totalXP: 12350, dominantStone: 'reality' },
        { rank: 4, name: 'Natasha Romanoff', totalXP: 11200, dominantStone: 'power' },
        { rank: 5, name: 'Wanda Maximoff', totalXP: 10800, dominantStone: 'reality' }
      ],
      groups: [
        {
          id: 'avengers-fitness',
          name: 'Avengers Fitness Club',
          members: 23,
          activeChallenge: 'Ultimate Fitness Quest',
          description: 'Elite fitness community'
        },
        {
          id: 'mind-masters',
          name: 'Mind Stone Masters',
          members: 156,
          activeChallenge: 'Mindfulness Journey',
          description: 'Mental wellness and learning'
        }
      ]
    };
  }

  // Load user data from localStorage with gamified progression
  loadUserData() {
    const savedData = localStorage.getItem('wellness-gauntlet-data');
    if (savedData) {
      const data = JSON.parse(savedData);
      // If user exists, load their progress
      if (data.stones && !data.isNewUser) {
        this.stones = { ...this.stones, ...data.stones };
        this.challenges = data.challenges || this.challenges;
        this.currentUser = data.currentUser || null;
      } else {
        // Initialize new user with gamified starting state
        this.initializeNewUser();
      }
    } else {
      // First time user - initialize with gamified starting state
      this.initializeNewUser();
    }
  }

  // Initialize new user with proper gamification
  initializeNewUser() {
    this.stones = {
      // Only Mind Stone is unlocked initially (dim state)
      mind: { 
        id: 'mind', 
        name: 'Mind Stone', 
        progress: 15, // Dim state - not fully bright
        color: '#ffff00', 
        icon: '🧠', 
        unlocked: true, 
        glowing: false,
        streak: 0, 
        lastActive: null,
        level: 1,
        energy: 20,
        introQuest: 'Perform one act of mindfulness to ignite the Mind Gem',
        connectedTo: ['space'],
        abilities: ['Meditation', 'Mindfulness', 'Mental Clarity'],
        recentActivity: 'Ready to begin your journey',
        multiplier: 1.0
      },
      // Other stones are locked initially
      power: { 
        id: 'power', 
        name: 'Power Stone', 
        progress: 0, 
        color: '#8a2be2', 
        icon: '💪', 
        unlocked: false, 
        glowing: false,
        streak: 0, 
        lastActive: null,
        level: 0,
        energy: 0,
        unlockRequirement: 'Complete 3 Mind Stone quests',
        connectedTo: ['reality', 'space'],
        abilities: ['Locked - Complete Mind Stone quests to unlock'],
        recentActivity: 'Locked',
        multiplier: 0
      },
      space: { 
        id: 'space', 
        name: 'Space Stone', 
        progress: 0, 
        color: '#0066ff', 
        icon: '🌌', 
        unlocked: false, 
        glowing: false,
        streak: 0, 
        lastActive: null,
        level: 0,
        energy: 0,
        unlockRequirement: 'Complete Power Stone intro quest',
        connectedTo: ['time', 'mind'],
        abilities: ['Locked - Unlock Power Stone first'],
        recentActivity: 'Locked',
        multiplier: 0
      },
      reality: { 
        id: 'reality', 
        name: 'Reality Stone', 
        progress: 0, 
        color: '#ff0000', 
        icon: '🔮', 
        unlocked: false, 
        glowing: false,
        streak: 0, 
        lastActive: null,
        level: 0,
        energy: 0,
        unlockRequirement: 'Maintain 2 gems for 3 days',
        connectedTo: ['soul', 'power'],
        abilities: ['Locked - Maintain gem streaks to unlock'],
        recentActivity: 'Locked',
        multiplier: 0
      },
      soul: { 
        id: 'soul', 
        name: 'Soul Stone', 
        progress: 0, 
        color: '#ff8c00', 
        icon: '❤️', 
        unlocked: false, 
        glowing: false,
        streak: 0, 
        lastActive: null,
        level: 0,
        energy: 0,
        unlockRequirement: 'Complete social wellness quest',
        connectedTo: ['reality', 'time'],
        abilities: ['Locked - Focus on social wellness to unlock'],
        recentActivity: 'Locked',
        multiplier: 0
      },
      time: { 
        id: 'time', 
        name: 'Time Stone', 
        progress: 0, 
        color: '#00ff00', 
        icon: '⏰', 
        unlocked: false, 
        glowing: false,
        streak: 0, 
        lastActive: null,
        level: 0,
        energy: 0,
        unlockRequirement: 'Achieve Balance for 7 days',
        connectedTo: ['space', 'soul'],
        abilities: ['Locked - Master of Balance achievement required'],
        recentActivity: 'Locked',
        multiplier: 0
      }
    };

    // Save the new user state
    this.saveUserData();
  }

  // Save user data to localStorage
  saveUserData() {
    const data = {
      stones: this.stones,
      challenges: this.challenges,
      currentUser: this.currentUser,
      timestamp: Date.now()
    };
    localStorage.setItem('wellness-gauntlet-data', JSON.stringify(data));
  }

  // Simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication
  async login(email, password) {
    await this.delay();
    
    // Simulate login (accepts any gmail)
    if (email.includes('@gmail.com')) {
      this.currentUser = {
        id: 'current-user',
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        avatar: 'https://cdn.jsdelivr.net/gh/marvel-unlimited/assets/characters/captain-america.jpg',
        level: 12,
        totalXP: 12350,
        joinDate: '2024-01-15',
        dominantStone: 'reality',
        activeChallenges: 2,
        completedChallenges: 8,
        streak: 14
      };
      
      this.saveUserData();
      return { success: true, user: this.currentUser };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  // Get user profile
  async getUserProfile() {
    await this.delay(200);
    return this.currentUser;
  }

  // Get stones data with interconnections
  async getStones() {
    await this.delay(300);
    return this.stones;
  }

  // Update stone progress with ripple effects
  async updateStoneProgress(stoneId, progressDelta, source = 'manual') {
    await this.delay(400);
    
    const stone = this.stones[stoneId];
    if (!stone) return { success: false, error: 'Stone not found' };

    // Apply direct progress update
    stone.progress = Math.min(100, Math.max(0, stone.progress + progressDelta));
    stone.energy = Math.min(100, stone.energy + (progressDelta * 0.5));
    
    // Calculate ripple effects to connected stones
    const rippleEffects = [];
    for (const connectedId of stone.connectedTo) {
      const connectedStone = this.stones[connectedId];
      if (connectedStone) {
        const rippleAmount = Math.floor(progressDelta * 0.3 * stone.multiplier);
        connectedStone.progress = Math.min(100, Math.max(0, connectedStone.progress + rippleAmount));
        connectedStone.energy += rippleAmount * 0.2;
        
        rippleEffects.push({
          stoneId: connectedId,
          change: rippleAmount,
          type: 'ripple'
        });
      }
    }

    // Check for level ups
    const newLevel = Math.floor(stone.progress / 20) + 1;
    const leveledUp = newLevel > stone.level;
    stone.level = newLevel;

    // Unlock stones based on progress
    if (stone.progress >= 50 && !this.stones.soul.unlocked && stoneId === 'reality') {
      this.stones.soul.unlocked = true;
      rippleEffects.push({ type: 'unlock', stoneId: 'soul' });
    }

    this.saveUserData();
    
    // Emit storage event to notify other components
    window.dispatchEvent(new CustomEvent('wellnessUpdate', {
      detail: {
        type: 'stone-update',
        stoneId: stoneId,
        stone: stone,
        rippleEffects: rippleEffects,
        leveledUp: leveledUp,
        source: source
      }
    }));
    
    return {
      success: true,
      stone: stone,
      rippleEffects: rippleEffects,
      leveledUp: leveledUp,
      source: source
    };
  }

  // Get active challenges
  async getChallenges() {
    await this.delay(250);
    return this.challenges;
  }

  // Join a challenge
  async joinChallenge(challengeId) {
    await this.delay(600);
    
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, error: 'Challenge not found' };

    // Update challenge participants
    challenge.participants += 1;
    challenge.status = 'active';

    // Apply stone impacts
    const stoneUpdates = [];
    if (challenge.stoneImpact) {
      for (const impact of challenge.stoneImpact) {
        const result = await this.updateStoneProgress(impact.stoneId, impact.change, 'challenge-join');
        stoneUpdates.push(result);
      }
    }

    // Add to notifications
    this.notifications.push({
      id: Date.now(),
      type: 'challenge-joined',
      title: 'Challenge Joined!',
      message: `You've joined "${challenge.title}"`,
      timestamp: new Date(),
      read: false
    });

    this.saveUserData();
    
    return {
      success: true,
      challenge: challenge,
      stoneUpdates: stoneUpdates,
      message: `Successfully joined ${challenge.title}!`
    };
  }

  // Complete challenge activity
  async completeActivity(challengeId, activityData) {
    await this.delay(500);
    
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, error: 'Challenge not found' };

    // Update progress
    challenge.progress += 1;
    
    // Calculate stone impacts based on activity
    const stoneUpdates = [];
    
    if (challenge.stoneImpact) {
      for (const impact of challenge.stoneImpact) {
        const multiplier = challenge.difficulty === 'hard' ? 1.5 : challenge.difficulty === 'easy' ? 0.8 : 1;
        const actualImpact = Math.floor(impact.change * multiplier);
        const result = await this.updateStoneProgress(impact.stoneId, actualImpact, 'activity-complete');
        stoneUpdates.push(result);
      }
    }

    // Add XP and rewards
    if (this.currentUser) {
      this.currentUser.totalXP += challenge.rewards.xp * 0.1; // Partial XP for activity
    }

    // Check if challenge is completed
    const isCompleted = challenge.progress >= challenge.duration;
    if (isCompleted) {
      challenge.status = 'completed';
      
      // Full rewards
      if (this.currentUser) {
        this.currentUser.totalXP += challenge.rewards.xp;
        this.currentUser.completedChallenges += 1;
      }

      this.notifications.push({
        id: Date.now(),
        type: 'challenge-completed',
        title: 'Challenge Mastered!',
        message: `Congratulations! You've completed "${challenge.title}"`,
        timestamp: new Date(),
        read: false
      });
    }

    this.saveUserData();
    
    // Emit storage event to notify other components
    window.dispatchEvent(new CustomEvent('wellnessUpdate', {
      detail: {
        type: 'challenge-activity',
        challengeId: challengeId,
        stoneUpdates: stoneUpdates,
        isCompleted: isCompleted
      }
    }));
    
    return {
      success: true,
      challenge: challenge,
      stoneUpdates: stoneUpdates,
      isCompleted: isCompleted,
      xpGained: isCompleted ? challenge.rewards.xp : challenge.rewards.xp * 0.1
    };
  }

  // Get social network data
  async getSocialNetwork() {
    await this.delay(300);
    return this.socialNetwork;
  }

  // Get notifications
  async getNotifications() {
    await this.delay(200);
    return this.notifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Simulate real-time updates
  simulateRealTimeUpdates() {
    setInterval(() => {
      // Randomly update friend statuses
      const friends = this.socialNetwork.friends;
      if (friends.length > 0) {
        const randomFriend = friends[Math.floor(Math.random() * friends.length)];
        const statuses = ['online', 'in-challenge', 'offline'];
        randomFriend.status = statuses[Math.floor(Math.random() * statuses.length)];
      }

      // Randomly add notifications from friends
      if (Math.random() < 0.1) { // 10% chance every interval
        const activities = [
          'completed a challenge',
          'reached a new level',
          'unlocked a new stone',
          'joined your challenge'
        ];
        
        const randomFriend = friends[Math.floor(Math.random() * friends.length)];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        this.notifications.push({
          id: Date.now(),
          type: 'friend-activity',
          title: 'Friend Update',
          message: `${randomFriend.name} ${randomActivity}!`,
          timestamp: new Date(),
          read: false
        });
      }
    }, 30000); // Every 30 seconds
  }

  // Get analytics data
  async getAnalytics() {
    await this.delay(400);
    
    const stones = Object.values(this.stones);
    const totalProgress = stones.reduce((sum, stone) => sum + stone.progress, 0);
    const averageProgress = totalProgress / stones.length;
    
    return {
      overallProgress: Math.round(averageProgress),
      strongestStone: stones.reduce((prev, current) => 
        (prev.progress > current.progress) ? prev : current
      ),
      weakestStone: stones.reduce((prev, current) => 
        (prev.progress < current.progress) ? prev : current
      ),
      totalChallenges: this.challenges.length,
      activeChallenges: this.challenges.filter(c => c.status === 'active').length,
      completedChallenges: this.challenges.filter(c => c.status === 'completed').length,
      stoneConnections: stones.reduce((sum, stone) => sum + stone.connectedTo.length, 0),
      weeklyGrowth: {
        power: Math.floor(Math.random() * 20) + 5,
        space: Math.floor(Math.random() * 15) + 3,
        reality: Math.floor(Math.random() * 25) + 8,
        soul: Math.floor(Math.random() * 10) + 2,
        time: Math.floor(Math.random() * 30) + 10,
        mind: Math.floor(Math.random() * 18) + 6
      }
    };
  }
}

// Create singleton instance
const wellnessAPI = new WellnessAPI();

// Start real-time updates
wellnessAPI.simulateRealTimeUpdates();

export default wellnessAPI;