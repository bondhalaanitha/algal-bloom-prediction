
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
from datetime import datetime, timezone
import json
import joblib
import pandas as pd
import sqlite3
import math

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Paths and model loading
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

MODEL_PATH = (
    PROJECT_DIR / "algal-bloom-ml" / "models" / "bloom_model.pkl"
)
FEATURES_PATH = (
    PROJECT_DIR / "algal-bloom-ml" / "models" / "features.json"
)
DB_PATH = BASE_DIR / "predictions.db"

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

if not FEATURES_PATH.exists():
    raise FileNotFoundError(f"Features file not found: {FEATURES_PATH}")

model = joblib.load(MODEL_PATH)

with open(FEATURES_PATH, "r", encoding="utf-8") as file:
    FEATURES = json.load(file)

classifier = model.steps[-1][1] if hasattr(model, "steps") else model


# --------------------------------------------------
# SQLite database
# --------------------------------------------------

def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                waterbody TEXT NOT NULL,
                site TEXT NOT NULL,
                risk TEXT NOT NULL,
                probability REAL,
                measurements TEXT NOT NULL,
                notes TEXT DEFAULT ''
            )
        """)


init_db()


# --------------------------------------------------
# Helpers
# --------------------------------------------------

def get_recommendation(risk):
    recommendations = {
        "LOW": "Continue routine water-quality monitoring.",
        "MEDIUM": (
            "Continue regular monitoring and review "
            "water-quality changes."
        ),
        "HIGH": (
            "Increase monitoring frequency and inspect "
            "the waterbody for possible bloom formation."
        )
    }
    return recommendations.get(
        risk,
        "Review the prediction and continue monitoring."
    )


def get_contributing_factors():
    if not hasattr(classifier, "feature_importances_"):
        return []

    importances = classifier.feature_importances_

    if len(importances) != len(FEATURES):
        return []

    ranked = sorted(
        zip(FEATURES, importances),
        key=lambda item: item[1],
        reverse=True
    )

    return [
        {
            "feature": name,
            "importance": round(float(importance), 4),
            "description": (
                f"{name.replace('_', ' ')} "
                f"({float(importance):.1%} global importance)"
            )
        }
        for name, importance in ranked[:3]
    ]


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": True,
        "database": "sqlite",
        "required_features": FEATURES
    })


# --------------------------------------------------
# Create a prediction and save it
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({"error": "Send a valid JSON object."}), 400

    data = payload.get("data", payload)

    if not isinstance(data, dict):
        return jsonify({"error": "Input data must be an object."}), 400

    missing = [name for name in FEATURES if name not in data]
    if missing:
        return jsonify({
            "error": "Missing required measurements.",
            "missing_features": missing
        }), 400

    values = []

    try:
        for name in FEATURES:
            value = float(data[name])
            if not math.isfinite(value):
                raise ValueError(f"{name} must be a finite number.")
            values.append(value)
    except (TypeError, ValueError) as error:
        return jsonify({"error": str(error)}), 400

    waterbody = str(data.get("waterbody", "")).strip()
    site = str(data.get("site", "")).strip()
    notes = str(data.get("notes", "")).strip()

    if not waterbody or not site:
        return jsonify({
            "error": "Waterbody and site are required."
        }), 400

    input_df = pd.DataFrame([values], columns=FEATURES)

    try:
        prediction = model.predict(input_df)[0]
        risk = str(prediction).strip().upper()

        probability = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_df)[0]
            classes = list(model.classes_)
            index = classes.index(prediction)
            probability = float(probabilities[index])

        timestamp = datetime.now(timezone.utc).isoformat()
        factors = get_contributing_factors()

        # Save each successful prediction
        with get_db() as db:
            cursor = db.execute("""
                INSERT INTO predictions
                (timestamp, waterbody, site, risk, probability,
                 measurements, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                timestamp,
                waterbody,
                site,
                risk,
                probability,
                json.dumps(dict(zip(FEATURES, values))),
                notes
            ))
            prediction_id = cursor.lastrowid

        return jsonify({
            "id": prediction_id,
            "risk": risk,
            "probability": probability,
            "explanation": (
                "Risk predicted using the trained water-quality model. "
                "Feature importances describe overall model behavior, "
                "not individual causes of this prediction."
            ),
            "contributingFactors": [
                item["description"] for item in factors
            ],
            "featureImportances": factors,
            "recommendation": get_recommendation(risk),
            "timestamp": timestamp
        })

    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify({
            "error": "The prediction could not be completed."
        }), 500


# --------------------------------------------------
# Prediction history
# --------------------------------------------------

@app.route("/history", methods=["GET"])
def history():
    with get_db() as db:
        rows = db.execute("""
            SELECT id, timestamp, waterbody, site, risk, probability
            FROM predictions
            ORDER BY id DESC
        """).fetchall()

    records = []

    for row in rows:
        item = dict(row)
        item["date"] = item["timestamp"]
        records.append(item)

    return jsonify(records)


# --------------------------------------------------
# Dashboard statistics
# --------------------------------------------------

@app.route("/dashboard", methods=["GET"])
def dashboard():
    with get_db() as db:
        row = db.execute("""
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN risk = 'HIGH' THEN 1 ELSE 0 END) AS high,
                SUM(CASE WHEN risk = 'MEDIUM' THEN 1 ELSE 0 END) AS medium,
                SUM(CASE WHEN risk = 'LOW' THEN 1 ELSE 0 END) AS low,
                COUNT(DISTINCT site) AS sites
            FROM predictions
        """).fetchone()

    return jsonify({
        "totalObservations": row["total"] or 0,
        "highRisk": row["high"] or 0,
        "mediumRisk": row["medium"] or 0,
        "lowRisk": row["low"] or 0,
        "sitesMonitored": row["sites"] or 0
    })


if __name__ == "__main__":
    print("Model loaded:", type(model).__name__)
    print("Database:", DB_PATH)
    app.run(host="127.0.0.1", port=8000, debug=True)