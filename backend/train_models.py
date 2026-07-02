import os, sys, pickle, warnings
import numpy as np
import pandas as pd
 
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline
 
warnings.filterwarnings('ignore')
 
# ── paths ────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR   = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)
 
# ── features ─────────────────────────────────────────────
FEATURE_COLS = [
    'danceability','loudness','speechiness',
    'acousticness','instrumentalness','liveness',
    'valence','tempo','duration_ms','key','mode','time_signature'
]
 
# ── mood logic ───────────────────────────────────────────
def get_mood(row):
    v, e = row['valence'], row['energy']
    if v >= 0.5 and e >= 0.5:
        return 'Happy'
    elif v < 0.5 and e >= 0.5:
        return 'Energetic'
    elif v >= 0.5 and e < 0.5:
        return 'Calm'
    else:
        return 'Sad'
 
# ── load dataset ─────────────────────────────────────────
def load_data():
    csv_path = os.path.join(DATA_DIR, 'dataset.csv')
 
    if not os.path.exists(csv_path):
        print(" dataset.csv not found!")
        sys.exit(1)
 
    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    print(f"    Rows loaded: {len(df):,}")
 
    # clean
    df.dropna(subset=FEATURE_COLS, inplace=True)
    df.drop_duplicates(subset=['track_id'], inplace=True)
 
    # labels
    df['mood'] = df.apply(get_mood, axis=1)
 
    # ✅ FIXED: use median as threshold for balanced 50/50 split
    threshold = int(df['popularity'].median())
    print(f"\n📊 Popularity stats:")
    print(f"    Min: {df['popularity'].min()}")
    print(f"    Median (threshold): {threshold}")
    print(f"    Mean: {df['popularity'].mean():.1f}")
    print(f"    Max: {df['popularity'].max()}")
 
    df['pop_label'] = df['popularity'].apply(
        lambda x: 'High' if x >= threshold else 'Low'
    )
 
    # keep top genres
    top_genres = df['track_genre'].value_counts().nlargest(10).index
    df = df[df['track_genre'].isin(top_genres)]
 
    print("\nClass distribution (Popularity):")
    print(df['pop_label'].value_counts())
    print(f"\nGenres: {sorted(df['track_genre'].unique())}")
    print(f"Moods : {sorted(df['mood'].unique())}\n")
 
    return df
 
# ── models ───────────────────────────────────────────────
def build_models():
    return {
        'nb': GaussianNB(),
 
        'dt': DecisionTreeClassifier(
            max_depth=12,
            random_state=42,
            class_weight='balanced'
        ),
 
        'rf': RandomForestClassifier(
            n_estimators=100,
            n_jobs=-1,
            random_state=42,
            class_weight='balanced'
        ),
 
        'lr': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(
                max_iter=1000,
                random_state=42,
                class_weight='balanced'
            ))
        ])
    }
 
# ── training ─────────────────────────────────────────────
def train_task(df, task_name, target_col, label_encoder=None):
 
    print(f"\n Training task: {task_name.upper()}")
 
    X = df[FEATURE_COLS].values
    y_raw = df[target_col].values
 
    le = label_encoder or LabelEncoder()
    y = le.fit_transform(y_raw)
 
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )
 
    algo_names = {
        'nb': 'Naive Bayes',
        'dt': 'Decision Tree',
        'rf': 'Random Forest',
        'lr': 'Logistic Regression'
    }
 
    task_metrics = {}
 
    for key, model in build_models().items():
 
        print(f"  Training {algo_names[key]}...", end=' ')
 
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
 
        acc = round(accuracy_score(y_test, preds) * 100, 2)
        print(f"Accuracy: {acc}%")
 
        # save model
        fname = f"{task_name}_{key}.pkl"
        with open(os.path.join(MODELS_DIR, fname), 'wb') as f:
            pickle.dump(model, f)
 
        task_metrics[algo_names[key]] = {
            'accuracy': acc,
            'report': classification_report(
                y_test,
                preds,
                target_names=le.classes_,
                output_dict=True,
                zero_division=0
            )
        }
 
    # save encoder
    with open(os.path.join(MODELS_DIR, f"{task_name}_le.pkl"), 'wb') as f:
        pickle.dump(le, f)
 
    return task_metrics
 
# ── main ──────────────────────────────────────────────────
def main():
 
    print("\n🎵 SpotiML Training Started\n" + "="*40)
 
    df = load_data()
 
    all_metrics = {}
 
    all_metrics['genre'] = train_task(df, 'genre', 'track_genre')
    all_metrics['mood'] = train_task(df, 'mood', 'mood')
    all_metrics['popularity'] = train_task(df, 'popularity', 'pop_label')
 
    with open(os.path.join(MODELS_DIR, 'metrics.pkl'), 'wb') as f:
        pickle.dump(all_metrics, f)
 
    print("\n✅ Training complete!")
    print("📦 Models saved in /models/")
 
 
if __name__ == '__main__':
    main()