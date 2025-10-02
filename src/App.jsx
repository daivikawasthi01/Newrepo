import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WellnessProvider } from './context/WellnessContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnhancedDashboard from './pages/EnhancedDashboard';
import Gauntlet from './pages/Gauntlet';
import EnhancedGauntlet from './pages/EnhancedGauntlet';
import SimpleGauntlet from './pages/SimpleGauntlet';
import PowerLeaderboard from './pages/PowerLeaderboard';
import Challenge from './components/Challenge';
import Social from './components/Social';
import Quests from './pages/Quests';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <WellnessProvider>
      <Router>
        <div className="app">
          <Navigation user={user} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<EnhancedDashboard user={user} />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/gauntlet" element={<PowerLeaderboard user={user} />} />
              <Route path="/gauntlet-enhanced" element={<EnhancedGauntlet user={user} />} />
              <Route path="/gauntlet-original" element={<Gauntlet user={user} />} />
              <Route path="/challenges" element={<Challenge />} />
              <Route path="/social" element={<Social />} />
              <Route path="/quests" element={<Quests user={user} />} />
              <Route path="/analytics" element={<Analytics user={user} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WellnessProvider>
  );
}

export default App;
