"""
app.py
------
Flask web server that loads the trained model and serves
predictions via a REST API.

Endpoints:
    POST /predict  — takes two team names, returns win/draw/loss %
    GET  /health   — confirms the server is running
"""

import os
import pickle
import pandas as pd
from flask import Flask, request, jsonify

from features import compute_elo_ratings, build_match_features


app = Flask(__name__)


DATA_PATH  = os.path.join(os.path.dirname(__file__), "data", "matches.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pkl")


# ---------------------------------------------------------------------------
# Load everything once at startup
# ---------------------------------------------------------------------------

print("Loading historical data...")
df = pd.read_csv(DATA_PATH)
elos = compute_elo_ratings(df)
print(f"  ELO computed for {len(elos)} teams")

print("Loading trained model...")
with open(MODEL_PATH, "rb") as f:
    artifact = pickle.load(f)

MODEL         = artifact["model"]
LABEL_ENCODER = artifact["label_encoder"]
FEAT_COLS     = artifact["feature_columns"]
print("  Model loaded. Ready to predict.")


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "teams_tracked": len(elos),
        "model_features": len(FEAT_COLS),
    })


# ---------------------------------------------------------------------------
# Prediction endpoint
# ---------------------------------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        body = request.get_json()

        if not body:
            return jsonify({"error": "No JSON body provided"}), 400

        home_team  = body.get("home_team")
        away_team  = body.get("away_team")
        match_date = body.get("match_date", "2026-06-01")
        stage      = body.get("stage", "group stage")
        home_odds  = float(body.get("home_odds", 0))
        draw_odds  = float(body.get("draw_odds", 0))
        away_odds  = float(body.get("away_odds", 0))

        if not home_team or not away_team:
            return jsonify({"error": "home_team and away_team are required"}), 400

        feats = build_match_features(
            df=df,
            home_team=home_team,
            away_team=away_team,
            match_date=match_date,
            elos=elos,
            home_odds=home_odds,
            draw_odds=draw_odds,
            away_odds=away_odds,
            stage=stage,
        )

        X = pd.DataFrame([feats]).reindex(columns=FEAT_COLS, fill_value=0)

        proba = MODEL.predict_proba(X)[0]

        classes   = LABEL_ENCODER.classes_
        class_map = {cls: idx for idx, cls in enumerate(classes)}

        result = {
            "home_win": round(float(proba[class_map["H"]]), 3),
            "draw":     round(float(proba[class_map["D"]]), 3),
            "away_win": round(float(proba[class_map["A"]]), 3),
        }

        max_prob = max(result["home_win"], result["draw"], result["away_win"])
        if max_prob > 0.55:
            result["confidence"] = "high"
        elif max_prob > 0.42:
            result["confidence"] = "medium"
        else:
            result["confidence"] = "low"

        result["value_bet"] = None
        if home_odds and draw_odds and away_odds:
            implied_home = 1 / home_odds
            implied_draw = 1 / draw_odds
            implied_away = 1 / away_odds
            if result["home_win"] > implied_home + 0.05:
                result["value_bet"] = "home_win"
            elif result["away_win"] > implied_away + 0.05:
                result["value_bet"] = "away_win"
            elif result["draw"] > implied_draw + 0.05:
                result["value_bet"] = "draw"

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# Start the server
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)