from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle, os, numpy as np

app = Flask(__name__)
CORS(app)


MODELS_AVAILABLE = False


def find_models_dir():
    candidates = [
        os.getenv('MODELS_DIR'),
        os.path.join(os.path.dirname(__file__), '..', 'models'),
        os.path.join(os.path.dirname(__file__), 'models'),
        os.path.join(os.path.dirname(__file__), '..', '..', 'models'),
    ]

    for path in candidates:
        if not path:
            continue
        path = os.path.abspath(path)
        if os.path.isdir(path) and os.path.exists(os.path.join(path, 'genre_dt.pkl')):
            return path

    # Fall back to a default path so the app can still start without models
    default = os.path.abspath(os.path.join(os.path.dirname(__file__), 'models'))
    print(
        f'WARNING: Could not find a models directory containing genre_dt.pkl. '
        f'Defaulting to {default}. '
        f'Run train_models.py or set the MODELS_DIR environment variable to enable predictions.'
    )
    return default


MODELS_DIR = find_models_dir()
MODELS_AVAILABLE = os.path.isdir(MODELS_DIR) and os.path.exists(os.path.join(MODELS_DIR, 'genre_dt.pkl'))
print(f'Using models directory: {MODELS_DIR} | models available: {MODELS_AVAILABLE}')


def load_model(name):
    path = os.path.join(MODELS_DIR, f'{name}.pkl')
    if not os.path.exists(path):
        return None
    with open(path, 'rb') as f:
        return pickle.load(f)

def load_label_encoders():
    """Load all label encoders at startup so predictions decode to real names."""
    encoders = {}
    for task in ['genre', 'mood', 'popularity']:
        path = os.path.join(MODELS_DIR, f'{task}_le.pkl')
        try:
            with open(path, 'rb') as f:
                encoders[task] = pickle.load(f)
        except (FileNotFoundError, OSError):
            encoders[task] = None
    return encoders

LABEL_ENCODERS = load_label_encoders()

FEATURE_COLS = [
    'danceability','loudness','speechiness',
    'acousticness','instrumentalness','liveness',
    'valence','tempo','duration_ms','key','mode','time_signature'
]

@app.route('/api/predict', methods=['POST'])
def predict():
    if not MODELS_AVAILABLE:
        return jsonify({
            'status': 'unavailable',
            'message': (
                'Models have not been trained yet. '
                'Run train_models.py to generate the required .pkl files and redeploy, '
                'or set the MODELS_DIR environment variable to point to an existing models directory.'
            )
        }), 503

    data = request.json
    features = [float(data.get(f, 0)) for f in FEATURE_COLS]
    X = np.array(features).reshape(1, -1)

    results = {}
    tasks   = ['genre', 'mood', 'popularity']
    algos   = ['nb', 'dt', 'rf', 'lr']
    algo_names = {
        'nb': 'Naive Bayes',
        'dt': 'Decision Tree',
        'rf': 'Random Forest',
        'lr': 'Logistic Regression'
    }

    for task in tasks:
        results[task] = {}
        le = LABEL_ENCODERS.get(task)
        for algo in algos:
            try:
                model = load_model(f'{task}_{algo}')
                if model is None:
                    results[task][algo_names[algo]] = {'error': f'Model file {task}_{algo}.pkl not found'}
                    continue
                pred_encoded = model.predict(X)[0]
                # Decode integer back to the real label name (e.g. 0 → "Pop")
                if le is not None:
                    pred_label = le.inverse_transform([pred_encoded])[0]
                else:
                    pred_label = str(pred_encoded)
                proba = model.predict_proba(X)[0]
                conf  = round(float(max(proba)) * 100, 1)
                results[task][algo_names[algo]] = {
                    'prediction': str(pred_label),
                    'confidence': conf
                }
            except Exception as e:
                results[task][algo_names[algo]] = {'error': str(e)}

    return jsonify({'status': 'success', 'results': results, 'features': data})


@app.route('/api/model_stats', methods=['GET'])
def model_stats():
    try:
        with open(os.path.join(MODELS_DIR, 'metrics.pkl'), 'rb') as f:
            metrics = pickle.load(f)
        return jsonify({'status': 'success', 'metrics': metrics})
    except:
        return jsonify({'status': 'error', 'message': 'Train models first — run train_models.py'})


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'SpotiML backend running'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
