import pandas as pd
import numpy as np
import os
import json
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, precision_score, recall_score, f1_score

# Paths
DATA_PATH = r"c:\Users\Admin\Desktop\Soil\soil\Crop_recommendation_enhanced.csv"
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

def print_separator(title="", char="━", width=80):
    if title:
        pad = (width - len(title) - 2) // 2
        print(f"\n{char * pad} {title} {char * pad}")
    else:
        print(char * width)

def print_confusion_matrix_pretty(cm, classes):
    """Print a formatted confusion matrix to the terminal."""
    print_separator("CONFUSION MATRIX")
    
    # Abbreviate class names for display
    max_label = 8
    short_classes = [c[:max_label] for c in classes]
    
    # Header
    header = f"{'Actual↓ / Pred→':>12} | " + " ".join(f"{c:>{max_label}}" for c in short_classes)
    print(header)
    print("-" * len(header))
    
    for i, row in enumerate(cm):
        row_str = " ".join(
            f"\033[92m{v:>{max_label}}\033[0m" if i == j and v > 0 else
            f"\033[91m{v:>{max_label}}\033[0m" if i != j and v > 0 else
            f"{v:>{max_label}}"
            for j, v in enumerate(row)
        )
        print(f"{short_classes[i]:>12} | {row_str}")
    
    # Summary stats from confusion matrix
    total = cm.sum()
    correct = np.trace(cm)
    misclassified = total - correct
    print(f"\n  Total Predictions: {total}")
    print(f"  Correct:           {correct} ({correct/total*100:.1f}%)")
    print(f"  Misclassified:     {misclassified} ({misclassified/total*100:.1f}%)")

def print_per_class_metrics(y_test, y_pred, classes):
    """Print detailed per-class precision, recall, f1-score."""
    print_separator("PER-CLASS METRICS (Precision / Recall / F1-Score / Support)")
    
    report = classification_report(y_test, y_pred, target_names=classes, output_dict=True)
    
    print(f"{'Crop':<20} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'Support':>10}")
    print("-" * 62)
    
    # Sort by F1-score ascending to highlight weak classes
    class_metrics = []
    for cls in classes:
        m = report[cls]
        class_metrics.append((cls, m['precision'], m['recall'], m['f1-score'], int(m['support'])))
    
    class_metrics.sort(key=lambda x: x[3], reverse=True)
    
    for cls, prec, rec, f1, sup in class_metrics:
        # Color code: green if f1 >= 0.9, yellow if >= 0.7, red otherwise
        if f1 >= 0.95:
            color = "\033[92m"  # green
        elif f1 >= 0.80:
            color = "\033[93m"  # yellow
        else:
            color = "\033[91m"  # red
        reset = "\033[0m"
        
        bar = "█" * int(f1 * 20)
        print(f"{color}{cls:<20} {prec:>10.4f} {rec:>10.4f} {f1:>10.4f} {sup:>10} {bar}{reset}")
    
    # Averages
    print("-" * 62)
    for avg_type in ['macro avg', 'weighted avg']:
        m = report[avg_type]
        print(f"{avg_type:<20} {m['precision']:>10.4f} {m['recall']:>10.4f} {m['f1-score']:>10.4f} {int(m['support']):>10}")

def print_misclassification_details(cm, classes):
    """Print which crops get confused with each other."""
    print_separator("MISCLASSIFICATION DETAILS")
    
    found_any = False
    for i in range(len(classes)):
        for j in range(len(classes)):
            if i != j and cm[i][j] > 0:
                found_any = True
                print(f"  ⚠  {classes[i]:>20} misclassified as {classes[j]:<20} → {cm[i][j]} times")
    
    if not found_any:
        print("  ✅ No misclassifications! Perfect predictions on test set.")

def main():
    print_separator("SOILAI ML MODEL TRAINING", "═")
    
    print("\n📂 Loading data...")
    df = pd.read_csv(DATA_PATH)
    
    # We will use the exact columns present in the dataset to predict the crop.
    # The dataset has: N, P, K, temperature, humidity, ph, rainfall, label
    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[features]
    y = df['label']

    # Dataset Info
    print_separator("DATASET SUMMARY")
    print(f"  📊 Total samples:     {len(df)}")
    print(f"  🌱 Total crop classes: {df['label'].nunique()}")
    print(f"  📋 Features:          {', '.join(features)}")
    print(f"\n  Crop Distribution:")
    crop_counts = df['label'].value_counts()
    for crop, count in crop_counts.items():
        bar = "█" * (count // 10)
        print(f"    {crop:<20} {count:>5} samples  {bar}")
    
    # Label encode the target variable (crops)
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)
    
    print_separator("TRAINING")
    print(f"  🔧 Train samples: {len(X_train)}")
    print(f"  🧪 Test samples:  {len(X_test)}")
    
    # Build Ensemble Model (XGBoost + Random Forest)
    print("\n  ⚡ Training Ensemble Classifier (XGBoost + Random Forest)...")
    xgb = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', n_estimators=200, max_depth=6, learning_rate=0.1, random_state=42)
    rf = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)
    
    # Voting classifier with soft voting to support predict_proba
    ensemble_model = VotingClassifier(estimators=[('xgb', xgb), ('rf', rf)], voting='soft')
    ensemble_model.fit(X_train, y_train)
    print("  ✅ Training complete!")
    
    # Evaluate
    y_pred = ensemble_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    # Overall Results
    print_separator("OVERALL RESULTS")
    print(f"  🎯 Accuracy:          {acc * 100:.2f}%")
    print(f"  📈 Macro Precision:   {precision_score(y_test, y_pred, average='macro') * 100:.2f}%")
    print(f"  📈 Macro Recall:      {recall_score(y_test, y_pred, average='macro') * 100:.2f}%")
    print(f"  📈 Macro F1-Score:    {f1_score(y_test, y_pred, average='macro') * 100:.2f}%")
    print(f"  📈 Weighted F1-Score: {f1_score(y_test, y_pred, average='weighted') * 100:.2f}%")
    
    # Detailed metrics
    classes = le.classes_.tolist()
    cm_np = np.array(cm)
    
    print_confusion_matrix_pretty(cm_np, classes)
    print_per_class_metrics(y_test, y_pred, classes)
    print_misclassification_details(cm_np, classes)
    
    # Save objects (keeping the name crop_xgb_model.pkl as per earlier plan for simplicity)
    model_path = os.path.join(MODEL_DIR, "crop_xgb_model.pkl")
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    encoder_path = os.path.join(MODEL_DIR, "label_encoder.pkl")
    
    joblib.dump(ensemble_model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(le, encoder_path)

    # Extract feature importance from the Random Forest sub-model
    rf_model = ensemble_model.named_estimators_['rf']
    feature_importance = dict(zip(features, rf_model.feature_importances_.tolist()))

    # Generate per-class metrics for JSON
    report = classification_report(y_test, y_pred, target_names=classes, output_dict=True)
    per_class_metrics = {}
    for cls in classes:
        per_class_metrics[cls] = {
            "precision": round(report[cls]['precision'], 4),
            "recall": round(report[cls]['recall'], 4),
            "f1_score": round(report[cls]['f1-score'], 4),
            "support": int(report[cls]['support'])
        }

    # Generate Metrics JSON
    metrics = {
        "accuracy": float(acc),
        "macro_precision": float(precision_score(y_test, y_pred, average='macro')),
        "macro_recall": float(recall_score(y_test, y_pred, average='macro')),
        "macro_f1": float(f1_score(y_test, y_pred, average='macro')),
        "weighted_f1": float(f1_score(y_test, y_pred, average='weighted')),
        "confusion_matrix": cm,
        "classes": classes,
        "per_class_metrics": per_class_metrics,
        "feature_importance": feature_importance,
        "dataset_info": {
            "total_samples": len(df),
            "total_crops": int(df['label'].nunique()),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
        }
    }
    
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=4)

    # Feature Importance
    print_separator("FEATURE IMPORTANCE")
    for feat, imp in sorted(feature_importance.items(), key=lambda x: -x[1]):
        bar = '█' * int(imp * 50)
        print(f"  {feat:>12}: {imp:.4f} {bar}")

    # Final summary
    print_separator("FILES SAVED")
    print(f"  📦 Model:    {model_path}")
    print(f"  📦 Scaler:   {scaler_path}")
    print(f"  📦 Encoder:  {encoder_path}")
    print(f"  📦 Metrics:  {metrics_path}")
    print_separator("TRAINING COMPLETE", "═")

if __name__ == "__main__":
    main()
