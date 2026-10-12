
import os
import json
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    balanced_accuracy_score
)

# --------------------------------------------------
# 1. PATHS AND CONFIGURATION
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "bloom_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "bloom_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "features.json")
REPORT_PATH = os.path.join(MODEL_DIR, "evaluation_report.json")

os.makedirs(MODEL_DIR, exist_ok=True)

FEATURES = [
    "Temperature",
    "Specific_Conductivity",
    "DO_Saturation",
    "Dissolved_Oxygen",
    "Chlorophyll",
    "Turbidity",
    "Phycocyanin",
    "pH"
]

TARGET = "Bloom_Risk_Label"

# --------------------------------------------------
# 2. LOAD AND VALIDATE DATASET
# --------------------------------------------------

print("=" * 55)
print("ALGAL BLOOM RISK MODEL EVALUATION")
print("=" * 55)

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(
        f"Dataset not found: {DATA_PATH}"
    )

df = pd.read_csv(DATA_PATH)

print("\nOriginal dataset shape:", df.shape)

required_columns = FEATURES + [TARGET]
missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )

# Rows without a target cannot be used for supervised learning.
df = df.dropna(subset=[TARGET]).copy()

# Convert measurements to numeric.
# Invalid strings become NaN and are imputed by the pipeline.
for column in FEATURES:
    df[column] = pd.to_numeric(
        df[column], errors="coerce"
    )

# Remove rows where every feature is missing.
df = df.dropna(subset=FEATURES, how="all")

if df[TARGET].nunique() < 2:
    raise ValueError(
        "The dataset must contain at least two risk classes."
    )

X = df[FEATURES]
y = df[TARGET].astype(str).str.strip()

if (y == "").any():
    raise ValueError(
        "The target column contains empty risk labels."
    )

print("Usable dataset shape:", df.shape)

print("\nRisk class distribution:")
print(y.value_counts().to_string())

print("\nRisk class percentages:")
print(
    (y.value_counts(normalize=True) * 100)
    .round(2)
    .astype(str)
    .add("%")
    .to_string()
)

# Stratification needs enough examples in each class.
class_counts = y.value_counts()

if class_counts.min() < 2:
    raise ValueError(
        "Each risk class needs at least two samples "
        "for a stratified train/test split."
    )

# --------------------------------------------------
# 3. TRAIN / TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

# --------------------------------------------------
# 4. BUILD AND TRAIN MODEL
# --------------------------------------------------

pipeline = Pipeline([
    (
        "imputer",
        SimpleImputer(strategy="median")
    ),
    (
        "model",
        RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced",
            n_jobs=-1
        )
    )
])

print("\nTraining Random Forest model...")

pipeline.fit(X_train, y_train)

print("Training completed.")

# --------------------------------------------------
# 5. EVALUATE ON HELD-OUT TEST DATA
# --------------------------------------------------

y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
balanced_accuracy = balanced_accuracy_score(
    y_test, y_pred
)

labels = sorted(y.unique())

report = classification_report(
    y_test,
    y_pred,
    labels=labels,
    output_dict=True,
    zero_division=0
)

matrix = confusion_matrix(
    y_test,
    y_pred,
    labels=labels
)

print("\n" + "=" * 55)
print("MODEL EVALUATION RESULTS")
print("=" * 55)

print(f"\nTest accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
print(
    f"Balanced accuracy: {balanced_accuracy:.4f} "
    f"({balanced_accuracy * 100:.2f}%)"
)

print("\nClassification report:")
print(
    classification_report(
        y_test,
        y_pred,
        labels=labels,
        zero_division=0
    )
)

print("\nConfusion matrix")
print("Rows = actual labels; columns = predicted labels")
print("Label order:", labels)
print(matrix)

# --------------------------------------------------
# 6. FEATURE IMPORTANCE
# --------------------------------------------------

rf_model = pipeline.named_steps["model"]

importance = pd.Series(
    rf_model.feature_importances_,
    index=FEATURES
).sort_values(ascending=False)

print("\nFeature importance:")
print(importance.to_string())

# --------------------------------------------------
# 7. SAVE EVALUATION REPORT
# --------------------------------------------------

evaluation = {
    "dataset_rows": int(len(df)),
    "training_samples": int(len(X_train)),
    "testing_samples": int(len(X_test)),
    "random_state": 42,
    "test_accuracy": float(accuracy),
    "test_accuracy_percent": round(
        float(accuracy * 100), 2
    ),
    "balanced_accuracy": float(balanced_accuracy),
    "labels": labels,
    "confusion_matrix": matrix.tolist(),
    "classification_report": report,
    "feature_importance": {
        str(feature): float(score)
        for feature, score in importance.items()
    }
}

with open(REPORT_PATH, "w", encoding="utf-8") as file:
    json.dump(evaluation, file, indent=4)

print("\nEvaluation report saved:")
print(REPORT_PATH)

# --------------------------------------------------
# 8. SAVE MODEL AND FEATURE LIST
# --------------------------------------------------

# The model is saved only after training and evaluation finish.
joblib.dump(pipeline, MODEL_PATH)

with open(FEATURES_PATH, "w", encoding="utf-8") as file:
    json.dump(FEATURES, file, indent=4)

print("\nModel saved:")
print(MODEL_PATH)

print("\nFeature list saved:")
print(FEATURES_PATH)

print("\nTraining and evaluation finished successfully.")
