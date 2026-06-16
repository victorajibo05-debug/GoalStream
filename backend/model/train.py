"""
train.py
--------
Reads matches.csv, builds features for every historical match,
trains an XGBoost model and saves it to models/model.pkl
"""

import os
import pickle
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb

from features import compute_elo_ratings, build_match_features


DATA_PATH  = os.path.join(os.path.dirname(__file__), "data", "matches.csv")
MODEL_DIR  = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")


def build_dataset(df):
    print("Building features for every historical match...")
    print("This walks through matches one by one — takes about a minute.")

    df = df.sort_values("date").reset_index(drop=True)
    rows = []
    labels = []

    for i, row in df.iterrows():
        if i < 30:
            continue

        past = df.iloc[:i]
        elos = compute_elo_ratings(past)

        feats = build_match_features(
            df=past,
            home_team=row["home_team"],
            away_team=row["away_team"],
            match_date=row["date"],
            elos=elos,
            stage=row.get("stage", "group stage"),
        )

        rows.append(feats)
        labels.append(row["result"])

        if i % 100 == 0:
            print(f"  Processed {i} of {len(df)} matches...")

    X = pd.DataFrame(rows)
    y = pd.Series(labels)

    print(f"  Done. Dataset: {X.shape[0]} matches, {X.shape[1]} features")
    return X, y


def encode_labels(y):
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    print(f"  Label mapping: {dict(zip(le.classes_, le.transform(le.classes_)))}")
    return y_encoded, le


def build_model():
    return xgb.XGBClassifier(
        n_estimators=500,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        min_child_weight=5,
        gamma=1,
        reg_alpha=0.1,
        use_label_encoder=False,
        eval_metric="mlogloss",
        random_state=42,
        n_jobs=-1,
    )


def evaluate_model(model, X, y):
    print("Cross-validating (testing on data the model hasn't seen)...")

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    results = cross_validate(
        model, X, y, cv=cv,
        scoring=["accuracy", "neg_log_loss"],
    )

    accuracy = results["test_accuracy"].mean()
    logloss  = -results["test_neg_log_loss"].mean()

    print(f"  Accuracy:  {accuracy:.3f} ({accuracy*100:.1f}%)")
    print(f"  Log-loss:  {logloss:.3f}")
    print(f"  (Random guessing on 3 classes = 33.3% accuracy)")
    return accuracy


def print_top_features(model, feature_names, n=10):
    importances = pd.Series(model.feature_importances_, index=feature_names)
    top = importances.sort_values(ascending=False).head(n)
    print(f"\nTop {n} most important features:")
    for feat, score in top.items():
        bar = "█" * int(score * 200)
        print(f"  {feat:<35} {score:.4f}  {bar}")


def train():
    print("=== Football Predictor — Training ===\n")

    print("Loading matches.csv...")
    df = pd.read_csv(DATA_PATH)
    print(f"  Loaded {len(df)} matches")

    X, y_raw = build_dataset(df)

    print("\nEncoding labels (H/D/A -> numbers)...")
    y, le = encode_labels(y_raw)

    model = build_model()

    evaluate_model(model, X, y)

    print("\nTraining final model on all data...")
    model.fit(X, y)

    print_top_features(model, list(X.columns))

    os.makedirs(MODEL_DIR, exist_ok=True)
    artifact = {
        "model":           model,
        "label_encoder":   le,
        "feature_columns": list(X.columns),
    }
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(artifact, f)

    print(f"\nModel saved to {MODEL_PATH}")
    print("Training complete!")


if __name__ == "__main__":
    train()