# Soil Parameter Classifier — outputs 0 (low), 1 (in range), 2 (above range) for 7 parameters
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. Load dataset
df = pd.read_csv('Crop_recommendation.csv')
print(f"Loaded {df.shape[0]} samples with {df.shape[1]} columns")

# 2. Add mock sensor columns (replace with real sensor data later)
np.random.seed(42)
df['EC'] = np.random.uniform(0.0, 2.5, len(df))        # wider range to get all 3 classes
df['moisture'] = np.random.uniform(10, 95, len(df))     # wider range to get all 3 classes
print("Added EC and moisture columns")

# 3. Define healthy ranges for each parameter
ranges = {
    'N':           (50, 150),
    'P':           (16, 45),
    'K':           (120, 240),
    'EC':          (0.2, 1.8),
    'ph':          (6.0, 7.5),
    'moisture':    (20, 80),
    'temperature': (15, 35),
}

# 4. Create tri-state labels:  0 = low, 1 = in range, 2 = above range
def tri_label(value, low, high):
    if value < low:
        return 0
    elif value <= high:
        return 1
    else:
        return 2

def create_labels(row):
    return pd.Series({
        param: tri_label(row[param], lo, hi)
        for param, (lo, hi) in ranges.items()
    })

labels = df.apply(create_labels, axis=1).astype(int)

print("\nLabel distribution per parameter:")
for col in labels.columns:
    counts = labels[col].value_counts().sort_index()
    print(f"  {col}:  0(low)={counts.get(0,0)}  1(ok)={counts.get(1,0)}  2(high)={counts.get(2,0)}")

# 5. Features (9 sensor columns)
features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'EC', 'moisture']
X = df[features].copy()

# 6. Scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, labels, test_size=0.2, random_state=42
)
print(f"\nTrain: {X_train.shape}, Test: {X_test.shape}")

# 7. Train multi-output model (RandomForest handles 3 classes per output cleanly)
print("Training multi-output RandomForest (3-class)...")
base_model = RandomForestClassifier(n_estimators=200, random_state=42)
model = MultiOutputClassifier(base_model)
model.fit(X_train, y_train)

# 8. Evaluate
y_pred = model.predict(X_test)
print("\nAccuracy per parameter:")
for i, param in enumerate(labels.columns):
    acc = accuracy_score(y_test.iloc[:, i], y_pred[:, i])
    print(f"  {param}: {acc:.3f}")

# 9. Test with user-provided sensor input
print("\n--- Sensor Input ---")
print("Enter your soil sensor readings:")
n_val       = float(input("  Nitrogen (N):      "))
p_val       = float(input("  Phosphorus (P):    "))
k_val       = float(input("  Potassium (K):     "))
temp_val    = float(input("  Temperature (°C):  "))
hum_val     = float(input("  Humidity (%):      "))
ph_val      = float(input("  pH:                "))
rain_val    = float(input("  Rainfall (mm):     "))
ec_val      = float(input("  EC (dS/m):         "))
moist_val   = float(input("  Moisture (%):      "))

sensor_input = np.array([[n_val, p_val, k_val, temp_val, hum_val, ph_val, rain_val, ec_val, moist_val]])
sensor_scaled = scaler.transform(sensor_input)
prediction = model.predict(sensor_scaled)[0]

status_map = {0: 'LOW', 1: 'OK', 2: 'HIGH'}
print(f"\n  {'Parameter':<15} {'Value':<8} {'Code':<6} {'Status'}")
print(f"  {'-'*40}")
param_names = list(labels.columns)
param_to_input = {'N': n_val, 'P': p_val, 'K': k_val, 'EC': ec_val, 'ph': ph_val, 'moisture': moist_val, 'temperature': temp_val}
for param, code in zip(param_names, prediction):
    val = param_to_input.get(param, '—')
    print(f"  {param:<15} {str(val):<8} {code:<6} {status_map[code]}")

# 10. Save model & scaler
joblib.dump(model, 'fpga_led_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print("\nSaved: fpga_led_model.pkl + scaler.pkl")
print("Done! Model outputs 0/1/2 for each parameter — ready for FPGA.")