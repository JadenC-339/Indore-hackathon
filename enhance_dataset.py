"""
Enhanced Dataset Builder for KrishiMitra
- Adds 15 new India-specific crops with realistic agricultural parameters
- Augments existing 22 crops with noise-based synthetic samples
- Parameter ranges sourced from ICAR (Indian Council of Agricultural Research),
  NBSS&LUP soil survey data, and IMD climate averages
"""

import pandas as pd
import numpy as np
import os

np.random.seed(42)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART A: New India-Specific Crops
# Each crop has realistic parameter ranges based on
# Indian agricultural research and ICAR recommendations
# Format: (min, max) for each parameter
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INDIA_CROPS = {
    'wheat': {
        'N': (70, 120), 'P': (40, 80), 'K': (30, 60),
        'temperature': (15, 25), 'humidity': (40, 70), 'ph': (6.0, 7.5), 'rainfall': (50, 120),
        'info': 'Major rabi crop — Punjab, Haryana, UP, MP'
    },
    'sugarcane': {
        'N': (80, 150), 'P': (30, 60), 'K': (40, 80),
        'temperature': (24, 35), 'humidity': (60, 85), 'ph': (5.5, 7.5), 'rainfall': (150, 250),
        'info': 'Cash crop — UP, Maharashtra, Karnataka'
    },
    'tea': {
        'N': (60, 100), 'P': (20, 45), 'K': (20, 40),
        'temperature': (18, 28), 'humidity': (70, 95), 'ph': (4.5, 5.8), 'rainfall': (150, 300),
        'info': 'Plantation crop — Assam, Darjeeling, Nilgiris'
    },
    'turmeric': {
        'N': (40, 80), 'P': (20, 50), 'K': (50, 100),
        'temperature': (20, 32), 'humidity': (60, 85), 'ph': (5.5, 7.0), 'rainfall': (100, 200),
        'info': 'Spice crop — Andhra Pradesh, Tamil Nadu, Odisha'
    },
    'ginger': {
        'N': (50, 90), 'P': (25, 55), 'K': (40, 80),
        'temperature': (20, 30), 'humidity': (70, 90), 'ph': (5.5, 6.8), 'rainfall': (150, 280),
        'info': 'Spice crop — Kerala, Karnataka, Meghalaya'
    },
    'groundnut': {
        'N': (15, 40), 'P': (30, 70), 'K': (20, 50),
        'temperature': (25, 35), 'humidity': (50, 75), 'ph': (5.5, 7.0), 'rainfall': (50, 130),
        'info': 'Oilseed crop — Gujarat, Rajasthan, AP, TN'
    },
    'soybean': {
        'N': (10, 30), 'P': (40, 80), 'K': (30, 60),
        'temperature': (22, 32), 'humidity': (55, 80), 'ph': (6.0, 7.5), 'rainfall': (60, 150),
        'info': 'Oilseed/pulse — MP, Maharashtra, Rajasthan'
    },
    'mustard': {
        'N': (50, 90), 'P': (25, 55), 'K': (15, 40),
        'temperature': (12, 25), 'humidity': (40, 65), 'ph': (6.0, 7.8), 'rainfall': (30, 80),
        'info': 'Rabi oilseed — Rajasthan, UP, MP, Haryana'
    },
    'tomato': {
        'N': (80, 140), 'P': (40, 80), 'K': (60, 120),
        'temperature': (18, 30), 'humidity': (50, 75), 'ph': (5.5, 7.0), 'rainfall': (50, 130),
        'info': 'Vegetable — Andhra, Karnataka, MP, Maharashtra'
    },
    'potato': {
        'N': (80, 130), 'P': (50, 90), 'K': (80, 150),
        'temperature': (15, 25), 'humidity': (60, 80), 'ph': (5.0, 6.5), 'rainfall': (50, 120),
        'info': 'Tuber crop — UP, West Bengal, Bihar, Punjab'
    },
    'onion': {
        'N': (60, 110), 'P': (30, 60), 'K': (40, 80),
        'temperature': (18, 30), 'humidity': (50, 70), 'ph': (6.0, 7.5), 'rainfall': (40, 100),
        'info': 'Vegetable — Maharashtra, Karnataka, MP, Gujarat'
    },
    'chilli': {
        'N': (70, 120), 'P': (30, 60), 'K': (40, 80),
        'temperature': (22, 35), 'humidity': (55, 80), 'ph': (6.0, 7.2), 'rainfall': (60, 130),
        'info': 'Spice crop — Andhra, Telangana, Karnataka, MP'
    },
    'cardamom': {
        'N': (40, 75), 'P': (20, 50), 'K': (60, 120),
        'temperature': (15, 28), 'humidity': (75, 95), 'ph': (5.0, 6.5), 'rainfall': (200, 350),
        'info': 'Plantation spice — Kerala, Karnataka, TN hills'
    },
    'blackpepper': {
        'N': (30, 60), 'P': (15, 40), 'K': (80, 150),
        'temperature': (22, 32), 'humidity': (70, 95), 'ph': (5.5, 6.8), 'rainfall': (200, 350),
        'info': 'Spice — Kerala, Karnataka coastal, Goa'
    },
    'rubber': {
        'N': (20, 50), 'P': (15, 35), 'K': (20, 50),
        'temperature': (24, 34), 'humidity': (75, 95), 'ph': (4.5, 6.0), 'rainfall': (200, 400),
        'info': 'Plantation — Kerala, Tripura, NE India'
    },
}


def generate_crop_samples(crop_name, params, n_samples=100):
    """Generate realistic samples for a crop using truncated normal distribution
    within the specified parameter ranges."""
    data = {}
    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    for feat in features:
        low, high = params[feat]
        mean = (low + high) / 2
        std = (high - low) / 4  # ~95% within range
        
        values = np.random.normal(mean, std, n_samples)
        # Clip to realistic bounds (allow slight overflow for natural variation)
        values = np.clip(values, low * 0.9, high * 1.1)
        
        # Round appropriately
        if feat == 'ph':
            values = np.round(values, 6)
        elif feat in ('temperature', 'humidity', 'rainfall'):
            values = np.round(values, 6)
        else:
            values = np.round(values, 0).astype(int)
        
        data[feat] = values
    
    data['label'] = [crop_name] * n_samples
    return pd.DataFrame(data)


def augment_existing_data(df, augment_factor=0.5):
    """Create synthetic samples from existing data by adding Gaussian noise.
    augment_factor=0.5 means 50% more samples per crop."""
    
    augmented = []
    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    
    for crop in df['label'].unique():
        crop_data = df[df['label'] == crop]
        n_new = int(len(crop_data) * augment_factor)
        
        # Sample random rows to augment
        sampled = crop_data.sample(n=n_new, replace=True, random_state=42)
        
        for feat in features:
            std = crop_data[feat].std()
            noise_level = std * 0.15  # 15% of the original std — subtle but useful
            noise = np.random.normal(0, noise_level, n_new)
            sampled[feat] = sampled[feat].values + noise
        
        # Ensure pH stays in valid range
        sampled['ph'] = sampled['ph'].clip(3.5, 9.5)
        # Ensure no negatives
        for feat in ['N', 'P', 'K', 'temperature', 'humidity', 'rainfall']:
            sampled[feat] = sampled[feat].clip(0, None)
        
        augmented.append(sampled)
    
    return pd.concat(augmented, ignore_index=True)


def main():
    # Load original dataset
    original_path = os.path.join(os.path.dirname(__file__), '..', 'soil', 'Crop_recommendation.csv')
    df_original = pd.read_csv(original_path)
    
    print(f"━━━ Original Dataset ━━━")
    print(f"  Rows: {len(df_original)}")
    print(f"  Crops: {df_original['label'].nunique()}")
    print(f"  Crop list: {sorted(df_original['label'].unique())}")
    
    # ━━━ PART A: Generate new India-specific crop data ━━━
    print(f"\n━━━ Adding {len(INDIA_CROPS)} New India-Specific Crops ━━━")
    new_crop_frames = []
    for crop_name, params in INDIA_CROPS.items():
        crop_df = generate_crop_samples(crop_name, params, n_samples=100)
        new_crop_frames.append(crop_df)
        print(f"  ✅ {crop_name}: {len(crop_df)} samples — {params['info']}")
    
    df_new_crops = pd.concat(new_crop_frames, ignore_index=True)
    
    # ━━━ PART B: Augment existing data ━━━
    print(f"\n━━━ Augmenting Existing 22 Crops (50% more samples each) ━━━")
    df_augmented = augment_existing_data(df_original, augment_factor=0.5)
    print(f"  Generated {len(df_augmented)} augmented samples")
    
    # ━━━ Combine everything ━━━
    df_enhanced = pd.concat([df_original, df_new_crops, df_augmented], ignore_index=True)
    df_enhanced = df_enhanced.sample(frac=1, random_state=42).reset_index(drop=True)  # shuffle
    
    print(f"\n━━━ Enhanced Dataset Summary ━━━")
    print(f"  Total rows: {len(df_enhanced)} (was {len(df_original)})")
    print(f"  Total crops: {df_enhanced['label'].nunique()} (was {df_original['label'].nunique()})")
    print(f"  New crops added: {sorted(set(df_enhanced['label'].unique()) - set(df_original['label'].unique()))}")
    print(f"\n  Per-crop distribution:")
    print(df_enhanced['label'].value_counts().to_string())
    
    # Save enhanced dataset
    output_path = os.path.join(os.path.dirname(__file__), '..', 'soil', 'Crop_recommendation_enhanced.csv')
    df_enhanced.to_csv(output_path, index=False)
    print(f"\n  ✅ Saved to: {output_path}")
    
    return output_path


if __name__ == '__main__':
    main()
