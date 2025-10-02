import logging
import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from prophet import Prophet
from dotenv import load_dotenv

# Load env variables from .env (if present)
load_dotenv()

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)

# Mock Data - In a real app, this would come from a database
all_quests = [
    {"id": 1, "name": "5-Minute Meditation", "description": "Clear your mind and find your center.", "category": "mind"},
    {"id": 2, "name": "Morning Stretch", "description": "Energize your body for the day ahead.", "category": "body"},
    {"id": 3, "name": "Gratitude Journaling", "description": "Write down three things you are thankful for.", "category": "soul"},
    {"id": 4, "name": "Deep Breathing Exercise", "description": "Practice box breathing for 3 minutes.", "category": "mind"},
    {"id": 5, "name": "Go for a 20-minute walk", "description": "Get some fresh air and move your body.", "category": "body"},
    {"id": 6, "name": "Reflect on Your Day", "description": "Think about one positive experience from today.", "category": "soul"},
]

# ----------------------
# Utility: Generate mock user data
# ----------------------
def generate_mock_user_history(user_id):
    dates = pd.to_datetime(pd.date_range(end=pd.Timestamp.now(), periods=90, freq='D'))
    balance = [60 + (20 * np.sin(i / 7)) + (np.random.rand() * 10 - 5) for i in range(90)]
    balance = np.clip(balance, 20, 100)
    df = pd.DataFrame({'ds': dates, 'y': balance})
    return df

# ----------------------
# API: Forecast
# ----------------------
@app.route('/forecast', methods=['POST'])
def get_forecast():
    data = request.get_json()
    user_id = data.get('user_id')
    app.logger.info(f"[ML] Forecast request for user_id: {user_id}")
    
    df = generate_mock_user_history(user_id)
    model = Prophet(daily_seasonality=True)
    model.fit(df)
    future = model.make_future_dataframe(periods=7)
    forecast = model.predict(future)
    
    future_predictions = forecast.iloc[-7:]
    response_data = [
        {"date": row['ds'].strftime('%Y-%m-%d'), "predicted_balance": round(row['yhat'])}
        for _, row in future_predictions.iterrows()
    ]
    return jsonify(response_data)

# ----------------------
# API: Recommendations
# ----------------------
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    user_id = data.get('user_id')
    weakest_gem = data.get('weakest_gem', 'mind')
    app.logger.info(f"[ML] Recommendation request for user_id: {user_id}, weakest_gem: {weakest_gem}")
    
    recommended_quests = [q for q in all_quests if q['category'] == weakest_gem]
    return jsonify(recommended_quests[:3])

# ----------------------
# Run Flask
# ----------------------
if __name__ == '__main__':
    port = int(os.getenv("FLASK_PORT", 5002))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(port=port, debug=debug, host="0.0.0.0")
