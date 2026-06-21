# SolarPV Tensor

Full-stack solar PV system design platform — 3D visualization, load calculation, and component recommendation engine for solar installers and hobbyists.

## Status

- Phase 1 — Architecture & planning: done
- Phase 2 — Component database: done
- Phase 3 — Calculation engine: done
- Phase 4 — 3D visualization: in progress

## Tech stack

- **Frontend** — React + Vite, TypeScript, React Three Fiber, Zustand, Tailwind CSS
- **Backend** — Python, FastAPI, SQLAlchemy, pvlib
- **Database** — Supabase (PostgreSQL)

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (3.9 works but may need extra steps for some packages)
- Git
- A Supabase project (free tier) — ask the repo owner for access credentials

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Favourpaschal/solarpv-tensor.git
cd solarpv-tensor
```

### 2. Frontend

```bash
cd apps/web
npm install
npm run dev
```
Runs at http://localhost:5173

### 3. Backend

```bash
cd apps/api
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

### 4. Environment variables

Copy `.env.example` to `.env` inside `apps/api` and fill in real values. These credentials are not in the repo — contact the project owner to get access.

```bash
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux
```

### 5. Run the backend

```bash
uvicorn main:app --reload --port 8000
```
API docs at http://localhost:8000/docs

## Notes

- On Windows, if `pip install` fails on a package needing a C compiler, use Python 3.11+ rather than installing Visual C++ Build Tools.
- If the database connection times out, use the Supabase connection pooler URL (port 6543) instead of the direct URL (port 5432).