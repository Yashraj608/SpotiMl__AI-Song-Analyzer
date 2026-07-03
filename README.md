# 🎵 SpotiML — Spotify ML Classification Project

Multi-task ML classifier with a Spotify-themed web UI.
**12 models total: 4 algorithms × 3 prediction tasks**

## Prediction Tasks
| Task | Type | Output |
|------|------|--------|
| 🎸 Genre Classification | Multi-class | Pop, Rock, Hip-Hop, Classical, EDM... |
| 😊 Mood Detection | Multi-class | Happy, Sad, Energetic, Calm |
| 🔥 Popularity Prediction | Binary | High (≥70) / Low (<70) |

## Algorithms
- 🌿 Naive Bayes
- 🌳 Decision Tree
- 🌲 Random Forest
- 📈 Logistic Regression

---

## Project Structure
```
spotify_ml_project/
├── backend/
│   ├── app.py              ← Flask REST API
│   ├── train_models.py     ← Train all 12 models
│   └── requirements.txt    ← Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Predict.jsx
│   │       ├── ModelStats.jsx
│   │       └── Dataset.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── dataset.csv         ← PUT KAGGLE CSV HERE
└── models/                 ← Auto-generated after training
```

---

## Setup Instructions

### Step 1 — Download Dataset
1. Go to: https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset
2. Download `dataset.csv`
3. Place it in the `data/` folder as `data/dataset.csv`

### Step 2 — Backend Setup
```bash
cd backend
pip install -r requirements.txt
python train_models.py      # trains all 12 models (~2-3 mins)
python app.py               # starts API on http://localhost:5000
```

### Step 3 — Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev                 # starts UI on http://localhost:3000
```

### Step 4 — Open the App
Visit: **http://localhost:3000**

### Deploying the frontend to Vercel
1. In Vercel, create a new project from this repo.
2. Set the root directory to `frontend`.
3. Set the build command to `npm install && npm run build`.
4. Set the output directory to `dist`.
5. Add an environment variable:
   - `VITE_API_BASE_URL=https://spotimlai-song-analyzer-production.up.railway.app`
6. Deploy the project and verify the UI loads.
7. The frontend will then use your Railway backend for `/api/predict` and `/api/model_stats`.

---

## Pages
- **Dashboard** — Overview, sample predictions, pipeline view
- **Predict Song** — Adjust audio features and run all 12 models live
- **Model Stats** — Accuracy comparison table and charts
- **Dataset Info** — Feature descriptions and label engineering logic

---

## Notes
- Training takes ~2–3 minutes (Random Forest on 114k rows)
- Model Stats page shows estimated values until you train models
- Logistic Regression uses StandardScaler internally via Pipeline
- Top 10 genres are used for cleaner multi-class results

---

## 🌐 Live Deployment

The project has been successfully deployed and is publicly accessible.

- **Frontend (Vercel):** https://spoti-ml-ai-song-analyzer.vercel.app/
- **Backend (Railway):** https://spotimlai-song-analyzer-production.up.railway.app

---

## 🌐 Live Deployment

The project has been successfully deployed and is publicly accessible.

- **Frontend (Vercel):** https://spoti-ml-ai-song-analyzer.vercel.app/
- **Backend (Railway):** https://spotimlai-song-analyzer-production.up.railway.app

---

## 👨‍💻 Developer

**Developed by:** **Yash Raj**