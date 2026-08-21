from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import json
import os
import numpy as np

app = FastAPI(title="Soil ML Service")

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Globals for models
model = None
scaler = None
encoder = None
metrics_data = None

def print_separator(title="", char="━", width=80):
    if title:
        pad = (width - len(title) - 2) // 2
        print(f"\n{char * pad} {title} {char * pad}")
    else:
        print(char * width)

def print_startup_metrics():
    """Print comprehensive model metrics when the ML service starts."""
    if not metrics_data:
        print("⚠  No metrics found. Train the model first!")
        return

    print_separator("SOILAI ML SERVICE — MODEL METRICS", "═")
    
    # Overall accuracy
    acc = metrics_data.get("accuracy", 0)
    print(f"\n  🎯 Overall Accuracy:     {acc * 100:.2f}%")
    print(f"  📈 Macro Precision:      {metrics_data.get('macro_precision', 0) * 100:.2f}%")
    print(f"  📈 Macro Recall:         {metrics_data.get('macro_recall', 0) * 100:.2f}%")
    print(f"  📈 Macro F1-Score:       {metrics_data.get('macro_f1', 0) * 100:.2f}%")
    print(f"  📈 Weighted F1-Score:    {metrics_data.get('weighted_f1', 0) * 100:.2f}%")
    
    # Dataset info
    ds = metrics_data.get("dataset_info", {})
    print(f"\n  📊 Dataset: {ds.get('total_samples', '?')} samples, {ds.get('total_crops', '?')} crops")
    print(f"  🔧 Train: {ds.get('train_samples', '?')} | Test: {ds.get('test_samples', '?')}")
    
    # Per-class metrics
    per_class = metrics_data.get("per_class_metrics", {})
    if per_class:
        print_separator("PER-CLASS PERFORMANCE")
        print(f"  {'Crop':<20} {'Prec':>8} {'Recall':>8} {'F1':>8} {'Support':>8}")
        print("  " + "-" * 56)
        
        sorted_classes = sorted(per_class.items(), key=lambda x: x[1].get('f1_score', 0), reverse=True)
        for cls, m in sorted_classes:
            f1 = m.get('f1_score', 0)
            if f1 >= 0.95:
                status = "✅"
            elif f1 >= 0.80:
                status = "⚠️"
            else:
                status = "❌"
            print(f"  {status} {cls:<18} {m.get('precision',0):>8.2%} {m.get('recall',0):>8.2%} {f1:>8.2%} {m.get('support',0):>8}")
    
    # Confusion matrix summary — just show misclassifications
    cm = metrics_data.get("confusion_matrix", [])
    classes = metrics_data.get("classes", [])
    if cm and classes:
        print_separator("MISCLASSIFICATIONS")
        found = False
        cm_np = np.array(cm)
        for i in range(len(classes)):
            for j in range(len(classes)):
                if i != j and cm_np[i][j] > 0:
                    found = True
                    print(f"  ⚠  {classes[i]:<20} → {classes[j]:<20} ({cm_np[i][j]} samples)")
        if not found:
            print("  ✅ No misclassifications in test set!")
    
    # Feature importance
    fi = metrics_data.get("feature_importance", {})
    if fi:
        print_separator("FEATURE IMPORTANCE")
        for feat, imp in sorted(fi.items(), key=lambda x: -x[1]):
            bar = '█' * int(imp * 50)
            print(f"  {feat:>12}: {imp:.4f} {bar}")
    
    print_separator("SERVICE READY — Predictions use real predict_proba confidence", "═")
    print()

# Load models and metrics on startup
@app.on_event("startup")
def load_models():
    global model, scaler, encoder, metrics_data
    model_path = os.path.join(MODEL_DIR, "crop_xgb_model.pkl")
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    encoder_path = os.path.join(MODEL_DIR, "label_encoder.pkl")
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print("✅ Model loaded.")
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)
        print("✅ Scaler loaded.")
    if os.path.exists(encoder_path):
        encoder = joblib.load(encoder_path)
        print("✅ Label encoder loaded.")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            metrics_data = json.load(f)
        print("✅ Metrics loaded.")
    
    # Print full metrics summary to terminal
    print_startup_metrics()

class SoilInput(BaseModel):
    n: float
    p: float
    k: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    moisture: float

def check_soil_health(data: SoilInput):
    tips = []
    issues = 0
    
    # Simple rule-based logic for Soil parameters
    # Ideal ranges: N (50-150), P (16-45), K (120-240), pH (6-7.5), Moisture (20-80)
    if data.n < 50:
        tips.append("Add Nitrogen-rich fertilizers like Urea.")
        issues += 1
    elif data.n > 150:
        tips.append("Reduce Nitrogen fertilizers; consider planting nitrogen-absorbing catch crops.")
        issues += 1
        
    if data.p < 16:
        tips.append("Add phosphorus-rich fertilizers like Bone Meal.")
        issues += 1
    elif data.p > 45:
        tips.append("Phosphorus is high; avoid adding P-fertilizers.")
        issues += 1
        
    if data.k < 120:
        tips.append("Add Potassium (Potash) to improve root growth and crop yield.")
        issues += 1
        
    if data.ph < 6.0:
        tips.append("Soil is acidic. Apply agricultural lime (crushed limestone).")
        issues += 1
    elif data.ph > 7.5:
        tips.append("Soil is alkaline. Add organic matter like compost or elemental sulfur.")
        issues += 1
        
    if data.moisture < 20:
        tips.append("Soil is too dry. Increase irrigation frequency and use mulch.")
        issues += 1
    elif data.moisture > 80:
        tips.append("Soil is waterlogged. Improve drainage systems.")
        issues += 1

    if issues == 0:
        quality = "Good"
        tips.append("Maintain current organic compost routines.")
    elif issues <= 2:
        quality = "Moderate"
    else:
        quality = "Poor"
        tips.append("Implement crop rotation using leguminous plants to restore balance naturally.")
        
    return quality, tips

@app.post("/api/predict")
def predict_crop(data: SoilInput):
    if not model or not scaler or not encoder:
        raise HTTPException(status_code=500, detail="Models not loaded. Please train the model first.")
    
    # 1. Soil Quality and Tips
    quality, tips = check_soil_health(data)
    
    # 2. Crop Prediction
    features = np.array([[data.n, data.p, data.k, data.temperature, data.humidity, data.ph, data.rainfall]])
    features_scaled = scaler.transform(features)
    
    # Get probabilities for ALL crops — this is the REAL per-prediction confidence
    probs = model.predict_proba(features_scaled)[0]
    top_indices = np.argsort(probs)[::-1]  # sorted descending
    
    # Top 2 crops with their actual probabilities
    top_2_indices = top_indices[:2]
    best_crops = encoder.inverse_transform(top_2_indices).tolist()
    
    # Per-prediction confidence: the actual probability the model assigns to each crop
    top_1_confidence = float(probs[top_indices[0]])
    top_2_confidence = float(probs[top_indices[1]])
    
    # Build crop details with individual confidence scores
    crop_confidences = [
        {"crop": best_crops[0], "confidence": round(top_1_confidence, 4)},
        {"crop": best_crops[1], "confidence": round(top_2_confidence, 4)},
    ]
    
    # Log the prediction to terminal for debugging
    print(f"\n{'─'*60}")
    print(f"📥 PREDICTION REQUEST")
    print(f"   Input: N={data.n}, P={data.p}, K={data.k}, pH={data.ph}, Temp={data.temperature}, Humidity={data.humidity}, Rainfall={data.rainfall}")
    print(f"   🌱 Top Crop: {best_crops[0]} ({top_1_confidence*100:.1f}% confidence)")
    print(f"   🌾 2nd Crop: {best_crops[1]} ({top_2_confidence*100:.1f}% confidence)")
    print(f"   📊 Soil Quality: {quality}")
    
    # Show top 5 probabilities for deeper insight
    top_5_indices = top_indices[:5]
    top_5_crops = encoder.inverse_transform(top_5_indices).tolist()
    print(f"   📈 Top 5 predictions:")
    for idx, crop_idx in enumerate(top_5_indices):
        crop_name = encoder.inverse_transform([crop_idx])[0]
        prob = probs[crop_idx]
        bar = '█' * int(prob * 30)
        print(f"      {idx+1}. {crop_name:<18} {prob*100:>6.2f}% {bar}")
    print(f"{'─'*60}")
    
    # If soil is good, suggest high yield, else limit crops or suggest robust ones
    if quality == "Poor":
        # Maybe insert a tip for robust crops, but we still return what the model predicted
        tips.append(f"Consider growing soil-restoring crops alongside {best_crops[0]}.")
    elif quality == "Good":
        tips.append(f"Ideal conditions for high-yield {best_crops[0]}.")

    return {
        "soil_quality": quality,
        "recommended_crops": best_crops,
        "improvement_tips": tips,
        "prediction_confidence": top_1_confidence,  # Real per-prediction confidence
        "crop_confidences": crop_confidences,        # Individual confidence per crop
        "model_accuracy": metrics_data.get("accuracy", 0) if metrics_data else None  # Overall model accuracy (for reference)
    }

@app.get("/api/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=404, detail="Metrics not found. Train the model first.")
    return metrics_data
