require('dotenv').config();  // loads variables from server/.env

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// read env vars
const PORT = process.env.PORT || 5001;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5002";

// Middleware
app.use(cors());
app.use(express.json());

// ------------------- Helpers ------------------- //
function generateHistory(range) {
    const data = [];
    for (let i = range - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const balance =
            65 + Math.sin(i * 0.5) * 15 + (Math.random() - 0.5) * 10;
        data.push({
            log_date: date.toISOString().split('T')[0],
            wellness_balance: Math.round(Math.max(0, Math.min(100, balance))),
        });
    }
    return data;
}

// ------------------- ROUTES ------------------- //

// 1. Historical Analytics (mock data)
app.get('/api/analytics/history/:userId', (req, res) => {
    console.log(`[API] History request for user ${req.params.userId}`);
    const range = req.query.range === 'week' ? 7 : 30;
    res.json(generateHistory(range));
});

// 2. Forecast (calls Flask ML)
app.get('/api/analytics/forecast/:userId', async (req, res) => {
  console.log(`[API] Forecast request for user ${req.params.userId}`);
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/forecast`, {
      user_id: req.params.userId,
    });

    // Wrap into object { values: [...] }
    res.json({ values: response.data });
  } catch (error) {
    console.error("[API] Forecast error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

// 3. Recommendations (calls Flask ML)
app.get('/api/quests/recommendations/:userId', async (req, res) => {
  console.log(`[API] Recommendations request for user ${req.params.userId}`);
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/recommendations`, {
      user_id: req.params.userId,
      weakest_gem: "soul", // TODO: make dynamic later
    });

    // Wrap into object { recommendations: [...] }
    res.json({ recommendations: response.data });
  } catch (error) {
    console.error("[API] Recommendations error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// ------------------- START SERVER ------------------- //
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    console.log(`🔗 Connected to ML service at ${ML_SERVICE_URL}`);
});
