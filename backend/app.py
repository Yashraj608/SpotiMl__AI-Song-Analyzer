from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle, os, numpy as np

app = Flask(__name__)
CORS(app)

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

def load_model(name):
    path = os.path.join(MODELS_DIR, f'{name}.pkl')
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
        except FileNotFoundError:
            encoders[task] = None
    return encoders

LABEL_ENCODERS = load_label_encoders()

FEATURE_COLS = [
    'danceability','energy','loudness','speechiness',
    'acousticness','instrumentalness','liveness',
    'valence','tempo','duration_ms','key','mode','time_signature'
]

@app.route('/api/predict', methods=['POST'])
def predict():
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
