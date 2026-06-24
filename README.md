# SoccerrAI

An AI-powered football match prediction platform combining a custom-trained machine learning model, live match data, and LLM-generated betting market analysis — built end-to-end across a Python ML service, a Node.js/TypeScript API, and a React/Vite frontend.

**Live demo:** [soccerrai.vercel.app](https://soccerrai.vercel.app)
**API backend:** [soccerrai.onrender.com](https://soccerrai.onrender.com)
**ML prediction service:** [soccerrai-ml.onrender.com](https://soccerrai-ml.onrender.com)

> Hosted on free-tier infrastructure (Render). Services spin down after periods of inactivity and may take 30–50 seconds to respond on first load while they wake up.

---

## What it does

SoccerrAI lets users browse live and upcoming football fixtures across major competitions (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, World Cup, and more), see AI-generated win/draw/loss probabilities for each match, and get LLM-generated betting market suggestions on demand. Users authenticate via email/password or Google OAuth before accessing predictions and AI analysis.

- **Match browsing** — live scores and fixtures, filterable by league/competition, sorted alphabetically
- **ML predictions** — win/draw/loss probability for any matchup, powered by a custom XGBoost model trained on 92 years of World Cup history (1930–2022) plus ELO ratings, recent form, and head-to-head data
- **AI market analysis** — click a match card to get LLM-generated betting market suggestions (most reliable markets, with reasoning) via Groq's Llama 3.3
- **Authentication** — email/password and Google OAuth via Supabase, gating predictions and AI analysis behind login

---

## Architecture

```
┌─────────────────┐      ┌──────────────────────┐      ┌────────────────────┐
│   React + Vite   │ ──── │   Node.js + Express   │ ──── │  Python + Flask     │
│   (Vercel)        │      │   (Render)            │      │  ML Service (Render)│
│                   │      │                       │      │                     │
│ - Match cards     │      │ - football-data.org   │      │ - XGBoost model     │
│ - Tabs/filtering  │      │   proxy + caching      │      │ - ELO ratings        │
│ - Auth (Supabase) │      │ - Groq AI proxy        │      │ - Feature engineering│
│ - Predictions UI  │      │ - Prediction proxy     │      │ - /predict endpoint  │
└─────────────────┘      └──────────────────────┘      └────────────────────┘
        │                          │
        └──────────────┬───────────┘
                        │
                 ┌──────────────┐
                 │   Supabase    │
                 │ (Auth + DB)   │
                 └──────────────┘
```

The frontend never calls third-party APIs (football data, Groq, the ML model) directly — everything is proxied through the Node backend, which handles caching, API keys, and request validation server-side.

---

## Tech stack

**Frontend**
- React + TypeScript + Vite
- Supabase JS client (auth)
- Axios

**Backend (API)**
- Node.js + Express + TypeScript
- Axios (proxying football-data.org and Groq)
- node-cache (response caching to stay within third-party rate limits)
- Supabase (session verification)

**ML Service**
- Python + Flask
- XGBoost (multi-class classifier: Home Win / Draw / Away Win)
- pandas / numpy / scikit-learn
- Gunicorn (production WSGI server)

**Infrastructure**
- Vercel (frontend)
- Render (Node API + Python ML service)
- Supabase (auth + Postgres)
- cron-job.org (keep-alive pings to prevent free-tier spin-down)

**Third-party APIs**
- [football-data.org](https://www.football-data.org) — match fixtures, scores, competitions
- [Groq](https://groq.com) (Llama 3.3 70B) — AI market analysis
- [Kaggle: FIFA World Cup 1930–2022 dataset](https://www.kaggle.com) — model training data

---

## The ML pipeline

The prediction model is trained from scratch on real historical data, not a third-party prediction API.

1. **`prepare_data.py`** — cleans the raw Kaggle World Cup dataset (37 columns → 11), normalizes dates, and converts results to H/D/A labels.
2. **`features.py`** — builds ~45 features per match:
   - ELO ratings (K-factor tuned for knockout-stage volatility)
   - Rolling form (last 10 matches: points, goals, clean sheets, goal difference)
   - Head-to-head history between the two teams
   - World Cup–specific tournament experience (total matches, finals reached)
   - Stage weighting (a final counts more than a group-stage game)
   - Betting-odds-implied probability (when available)
3. **`train.py`** — walks through match history chronologically (no data leakage — only past matches are used to build features for any given match), trains an XGBoost classifier, and validates with 5-fold stratified cross-validation.
4. **`app.py`** — a Flask service that loads the trained model once at startup and serves predictions via `POST /predict`.

**Result:** ~58% accuracy on 3-class prediction (Home/Draw/Away), against a 33% random baseline — in the range of professional bookmaker accuracy on football outcomes.

---

## Notable engineering decisions

- **Caching layer on the football-data proxy** — the backend caches all third-party football API responses for 2 minutes using `node-cache`, both to respect strict free-tier rate limits and to reduce the chance of the upstream provider flagging shared-hosting traffic as abusive (a real issue encountered during development — see *Lessons learned* below).
- **Microservice split for the ML model** — the prediction model runs as an independent Python/Flask service rather than inside the Node backend, since Python's ML ecosystem (XGBoost, pandas, scikit-learn) doesn't have a practical equivalent in Node.
- **Walk-forward feature engineering** — every feature for a historical match is computed using *only* data that existed before that match was played, preventing the model from "seeing the future" during training.
- **Free-tier spin-down mitigation** — both backend services are pinged every 10 minutes via cron-job.org to avoid Render's free-tier cold-start delays (which can otherwise add 30–50s to a user's first request after inactivity).

---

## Lessons learned

A few real problems surfaced during development that are worth documenting, since they're common pitfalls when deploying multi-service apps on free-tier infrastructure:

- **Third-party API suspension on shared hosting** — the original football data provider (API-Football) suspended the account, citing suspicious network activity. This was very likely caused by Render's shared-IP infrastructure rather than actual misuse, and is a known risk of running cron-triggered or auto-restarting services from data-center IP ranges on a free plan. Resolved by switching to football-data.org and adding response caching to minimize request volume regardless.
- **Stale process zombies during local development** — repeated `nodemon`/Flask restarts during long debugging sessions occasionally left old server processes running in the background, silently answering requests with outdated code while a fresh, correctly-fixed process sat untouched in the visible terminal. Diagnosed by checking `tasklist`/`netstat` directly rather than trusting terminal output alone.
- **Environment variable scoping across environments** — `PREDICTION_SERVICE_URL` and other service URLs needed to be set independently in each deployment environment (local `.env`, Vercel, and each Render service) rather than assumed to propagate automatically; a misconfigured or missing variable in one environment silently fell back to `localhost`, which behaves very differently in production than in local development.

---

## Project structure

```
soccerpredictor/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   │   ├── match.routes.ts
│   │   │   ├── predictionRoutes.ts
│   │   │   └── geminiRoutes.ts        # AI market analysis (Groq)
│   │   ├── services/
│   │   │   ├── match.service.ts       # football-data.org proxy + caching
│   │   │   ├── predictionService.ts   # ML service proxy
│   │   │   └── geminiPrediction.ts    # Groq client
│   │   └── App.ts
│   └── model/                  # Python ML service
│       ├── data/
│       │   ├── raw/
│       │   └── matches.csv
│       ├── models/
│       │   └── model.pkl
│       ├── features.py
│       ├── train.py
│       ├── prepare_data.py
│       ├── app.py
│       └── requirements.txt
└── frontend/                    # React + Vite
    └── src/
        ├── Components/
        │   ├── MatchCard.tsx
        │   ├── MatchList.tsx
        │   ├── Tabs.tsx
        │   ├── auth.tsx
        │   └── types/
        ├── lib/
        │   └── supabaseClient.ts
        └── services/
            ├── football.ts
            ├── predictionService.ts
            └── geminiServices.ts
```

---

## Running locally

**ML service**
```bash
cd backend/model
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python prepare_data.py         # builds matches.csv from raw data
python train.py                # trains and saves model.pkl
python app.py                  # runs on :5001
```

**Backend**
```bash
cd backend
npm install
npm run dev                    # runs on :3000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Environment variables

**`backend/.env`**
```
API_KEY=                       # football-data.org API key
GROQ_API_KEY=
PREDICTION_SERVICE_URL=http://127.0.0.1:5001
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Roadmap

- [ ] Static outbound IP for the backend to eliminate shared-IP rate-limiting risk
- [ ] Expand training data with international friendlies/qualifiers (beyond World Cup matches) for stronger form signals
- [ ] User-specific prediction history and saved picks
- [ ] Paid-tier live scoring for true real-time match status

---

## License

This project is for educational and portfolio purposes. Not intended to facilitate real-money gambling decisions.
