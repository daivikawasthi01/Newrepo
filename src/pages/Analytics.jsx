import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  BarChart3,
  PieChart,
  Award,
  Zap
} from 'lucide-react';
import { useWellness } from '../context/WellnessContext';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  BarElement
);

const Analytics = () => {
  const { state, wellnessBalance } = useWellness();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('balance');
  const [predictions, setPredictions] = useState([]);
  const [backendForecast, setBackendForecast] = useState(null);
  const [backendInsights, setBackendInsights] = useState(null);
  const [useBackend, setUseBackend] = useState(true);
  console.log("backendForecast", backendForecast);
  console.log("backendInsights", backendInsights);
  console.log("predictions", predictions);
  <div className="toggle-container">
  <button 
    onClick={() => setUseBackend(!useBackend)}
    className={`toggle-btn ${useBackend ? "active" : ""}`}
  >
    {useBackend ? "Using Backend AI 🤖" : "Using Local TF.js 📈"}
  </button>
</div>

  // Generate mock historical data
  const generateHistoricalData = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseBalance = 60 + Math.sin(i * 0.1) * 20;
      const noise = (Math.random() - 0.5) * 20;
      const balance = Math.max(0, Math.min(100, baseBalance + noise));
      data.push({
        date: date.toISOString().split('T')[0],
        balance: Math.round(balance),
        activeGems: Math.floor(balance / 20),
        completedQuests: Math.floor(Math.random() * 15) + 5,
        experience: Math.floor(Math.random() * 100) + 50
      });
    }
    return data;
  };
  const [historicalData] = useState(generateHistoricalData());

  useEffect(() => {
    async function runLocalML() {
      const history = historicalData.map(d => d.balance);
      const xs = tf.tensor1d(history.map((_, i) => i));
      const ys = tf.tensor1d(history);
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ optimizer: "sgd", loss: "meanSquaredError" });
      await model.fit(xs, ys, { epochs: 200 });
      const futureXs = tf.tensor1d(
        Array.from({ length: 7 }, (_, i) => history.length + i)
      );
      const preds = model.predict(futureXs);
      const predValues = Array.from(preds.dataSync());
      setPredictions(predValues);
    }

    async function fetchBackendML() {
      try {
        const userId = state.user?.id || "demo";
        const forecastRes = await axios.get(`/api/analytics/forecast/${userId}`);
        const insightsRes = await axios.get(`/api/quests/recommendations/${userId}`);

        if (forecastRes.data?.values) setBackendForecast(forecastRes.data.values);
        if (insightsRes.data) setBackendInsights(insightsRes.data);
      } catch (err) {
        console.warn("Backend ML unavailable, using local TF.js only.");
      }
    }

    runLocalML();
    fetchBackendML();
  }, [state.user]);

  // Chart data
const wellnessBalanceData = {
  labels: [
    ...historicalData.map(d => new Date(d.date).toLocaleDateString()),
    ...Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return date.toLocaleDateString();
    })
  ],
  datasets: [
    {
      label: 'Wellness Balance (History)',
      data: historicalData.map(d => d.balance),
      borderColor: '#4A90E2',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4A90E2',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
      pointRadius: 5
    },
    ...(useBackend && backendForecast?.length > 0
      ? [{
          label: "Backend Forecast (Prophet)",
          data: [
            ...Array(historicalData.length).fill(null),
            ...backendForecast.map(v => Math.round(v.predicted_balance))
          ],
          borderColor: "orange",
          borderDash: [6, 6],
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        }]
      : []),
    ...(!useBackend && predictions.length > 0
      ? [{
          label: "Local Forecast (TF.js)",
          data: [
            ...Array(historicalData.length).fill(null),
            ...predictions.map(p => Math.round(p))
          ],
          borderColor: "lightblue",
          borderDash: [6, 4],
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        }]
      : [])
  ]
};

  const gemStatusData = {
    labels: state.gems?.map(gem => gem.name) || [],
    datasets: [
      {
        label: 'Gem Power Level',
        data: state.gems?.map(gem => gem.power) || [],
        backgroundColor: state.gems?.map(gem => gem.color) || [],
        borderColor: state.gems?.map(gem => gem.color) || [],
        borderWidth: 2
      }
    ]
  };

  const gemDistributionData = {
    labels: ['Active Gems', 'Draining Gems', 'Inactive Gems'],
    datasets: [
      {
        data: [
          state.gems?.filter(gem => gem.status === 'bright').length || 0,
          state.gems?.filter(gem => gem.status === 'draining').length || 0,
          state.gems?.filter(gem => gem.status === 'dim').length || 0
        ],
        backgroundColor: ['#27AE60', '#E67E22', '#95A5A6'],
        borderColor: ['#2ECC71', '#F39C12', '#BDC3C7'],
        borderWidth: 2
      }
    ]
  };

  const activityData = {
    labels: historicalData.slice(-7).map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Completed Quests',
        data: historicalData.slice(-7).map(d => d.completedQuests),
        backgroundColor: 'rgba(142, 68, 173, 0.8)',
        borderColor: '#8E44AD',
        borderWidth: 2
      },
      ...(backendForecast && backendForecast.length > 0
        ? [{
            label: "Backend Forecast (Prophet)",
            data: backendForecast.map(v => Math.round(v.predicted_balance)),
            borderColor: "orange",
            borderDash: [4, 4],
            tension: 0.3,
          }]
        : []),
      {
        label: 'Experience Gained',
        data: historicalData.slice(-7).map(d => d.experience),
        backgroundColor: 'rgba(230, 126, 34, 0.8)',
        borderColor: '#E67E22',
        borderWidth: 2
      }
    ]
  };

  const analyticsCards = [
    {
      title: 'Current Balance',
      value: `${wellnessBalance()}%`,
      change: '+5%',
      changeType: 'positive',
      icon: Target,
      color: '#4A90E2'
    },
    {
      title: 'Weekly Average',
      value: `${Math.round(historicalData.slice(-7).reduce((sum, d) => sum + d.balance, 0) / 7)}%`,
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: '#27AE60'
    },
    {
      title: 'Total Experience',
      value: state.user?.experience || 0,
      change: '+150',
      changeType: 'positive',
      icon: Award,
      color: '#E67E22'
    },
    {
      title: 'Active Streak',
      value: `${state.user?.streak || 0} days`,
      change: 'New record!',
      changeType: 'positive',
      icon: Zap,
      color: '#8E44AD'
    }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Excellent Progress!',
      description: 'Your wellness balance has improved by 15% this week.',
      recommendation: 'Keep up the great work with your daily quests.'
    },
    {
      type: 'warning',
      title: 'Mind-Body Connection',
      description: 'Your Mind Gem performs better when Body Gem is active.',
      recommendation: 'Try completing physical activities before mental tasks.'
    },
    {
      type: 'info',
      title: 'Peak Performance Time',
      description: 'You complete most quests between 9 AM and 11 AM.',
      recommendation: 'Schedule important wellness activities during this window.'
    }
  ];

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    maintainAspectRatio: false,
  };

  return (
    <div className="analytics-page">
      {/* Header & Time Range */}
      <div className="analytics-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Wellness Analytics</h1>
          <p>Deep insights into your wellness journey and progress patterns</p>
        </motion.div>

        <motion.div
          className="time-range-selector"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
                  {["week", "month", "quarter"].map((range) => (
            <motion.button
              key={range}
              className={`range-btn ${timeRange === range ? "active" : ""}`}
              onClick={() => setTimeRange(range)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Key Metrics Cards */}
      <motion.div
        className="metrics-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              className="metric-card"
              style={{ "--card-color": card.color }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="metric-header">
                <div className="metric-icon">
                  <Icon size={24} />
                </div>
                <div className="metric-change">
                  <span className={`change ${card.changeType}`}>{card.change}</span>
                </div>
              </div>
              <div className="metric-content">
                <h3 className="metric-value">{card.value}</h3>
                <p className="metric-title">{card.title}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Wellness Balance Trend */}
        <motion.div
          className="chart-container large"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <TrendingUp size={20} />
              <h3>Wellness Balance Trend</h3>
            </div>
            <div className="chart-controls">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="metric-selector"
              >
                <option value="balance">Wellness Balance</option>
                <option value="quests">Completed Quests</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          </div>
          <div className="chart-wrapper">
            <Line data={wellnessBalanceData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Gem Power Levels */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <BarChart3 size={20} />
              <h3>Gem Power Levels</h3>
            </div>
          </div>
          <div className="chart-wrapper">
            <Bar data={gemStatusData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Gem Distribution */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <PieChart size={20} />
              <h3>Gem Status Distribution</h3>
            </div>
          </div>
          <div className="chart-wrapper">
            <Doughnut
              data={gemDistributionData}
              options={{ ...chartOptions, scales: undefined }}
            />
          </div>
        </motion.div>

        {/* Activity Overview */}
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="chart-header">
            <div className="chart-title">
              <Activity size={20} />
              <h3>Weekly Activity</h3>
            </div>
          </div>
          <div className="chart-wrapper">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

{/* Insights Section */}
<motion.div
  className="insights-section"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.9, duration: 0.6 }}
>
  <div className="section-header flex items-center justify-between">
    <div>
      <h2>AI-Powered Insights</h2>
      <p>Personalized recommendations based on your wellness patterns</p>
    </div>

    {/* Toggle Button */}
    <button
      onClick={() => setUseBackend(!useBackend)}
      className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
    >
      {useBackend ? "Show Local Forecast" : "Show AI Recommendations"}
    </button>
  </div>

  <div className="insights-grid">
    {(() => {
      if (useBackend && backendInsights?.recommendations?.length > 0) {
        return backendInsights.recommendations.map((rec, i) => (
          <motion.div
            key={rec.id || i}
            className="insight-card backend"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="insight-header">
              <div className="insight-indicator">🤖</div>
              <h4>{rec.name}</h4>
            </div>
            <p className="insight-description">{rec.description}</p>
            <div className="insight-category">
              <strong>Category:</strong> {rec.category}
            </div>
          </motion.div>
        ));
      } else if (!useBackend && predictions.length > 0) {
        const localMsgs = [
          `Your wellness balance is predicted to change by ${Math.round(
            predictions[predictions.length - 1] - predictions[0]
          )}% over the next week.`,
          "Keep consistency — local trend shows improvement!",
        ];
        return localMsgs.map((msg, i) => (
          <motion.div
            key={i}
            className="insight-card local"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="insight-header">
              <div className="insight-indicator">📈</div>
              <h4>Predicted Insight</h4>
            </div>
            <p className="insight-description">{msg}</p>
          </motion.div>
        ));
      } else {
        return insights.map((insight, index) => (
          <motion.div
            key={index}
            className={`insight-card ${insight.type}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`insight-indicator ${insight.type}`}>
              {insight.type === "positive" && "✅"}
              {insight.type === "warning" && "⚠️"}
              {insight.type === "info" && "ℹ️"}
            </div>
            <h4>{insight.title}</h4>
            <p className="insight-description">{insight.description}</p>
            <div className="insight-recommendation">
              <strong>Recommendation:</strong> {insight.recommendation}
            </div>
          </motion.div>
        ));
      }
    })()}
  </div>
</motion.div>


      {/* Achievements Progress */}
      <motion.div
        className="achievements-analytics"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="section-header">
          <h2>Achievement Progress</h2>
          <p>Track your wellness milestones and unlock new goals</p>
        </div>

        <div className="achievements-progress-grid">
          {state.achievements?.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`achievement-progress-card ${
                achievement.unlocked ? "unlocked" : ""
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? "🏆" : "🔒"}
              </div>
              <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </div>
              <div className="achievement-status">
                {achievement.unlocked ? (
                  <span className="unlocked-badge">Unlocked!</span>
                ) : (
                  <span className="locked-badge">In Progress</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};


export default Analytics;
