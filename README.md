# Mine-Sigma – Full Stack Project (Web Portals + Blockchain)

This repository contains the complete Mine-Sigma system:

* **Web Portal (Next.js)**: Admin + Officer dashboards and citizen-facing pages
* **Core Backend (FastAPI + PostgreSQL)**: Auth, Alerts, Zones, Analytics, Complaints, Reports, Satellite analysis endpoints
* **Smart Contracts (Hardhat)**: `MineGuardRegistry` contract for report anchoring & rewards

---

## 1) Folder Structure

* `frontend/` – Next.js web app (Admin / Officer portals)
* `backend/` – Core FastAPI backend (port `8000`)
* `ai_engine/` – Mining analysis / audit engine
* `blockchain/` – Hardhat project (local RPC port `8545`)

---

## 2) Prerequisites (Windows)

* **Python**: 3.10+ recommended
* **Node.js**: 18+ recommended
* **npm**: comes with Node
* **Git**

Optional but useful:

* **PostgreSQL** (if you want a local DB instead of Neon)

---

## 3) Ports (Default)

* **Core backend**: `http://localhost:8000`
* **Core backend API base**: `http://localhost:8000/api`
* **Web frontend**: `http://localhost:3000`
* **Hardhat local RPC**: `http://127.0.0.1:8545` (chainId `31337`)

---

## 4) Environment Variables

### 4.1 Core Backend (`backend/.env`) (create this file)

Create `backend/.env` (do not commit it):

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
SECRET_KEY=replace_me_with_a_long_random_secret
```

Notes:

* The core backend uses async SQLAlchemy + `asyncpg`.
* If you use **Neon**, use the connection string you get from Neon.

---

### 4.2 Web Frontend (`frontend/.env.local`) (create this file)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

If you want to test on your LAN, replace `localhost` with your LAN IPv4.

---

## 5) Run Instructions (Local Dev)

### Step 0: Install dependencies

#### Core backend (FastAPI)

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r backend/requirements.txt
```

#### Web frontend (Next.js)

```bash
cd frontend
npm install
```

#### Blockchain (Hardhat)

```bash
cd blockchain
npm install
```

---

## 6) Start Services (recommended order)

### 6.1 Start Core Backend (port 8000)

From `backend/` folder:

```bash
python backend/main.py
```

Or:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

* `GET http://localhost:8000/api/health`

(Optional) Seed demo users:

```bash
python backend/scripts/seed_users.py
```

---

### 6.2 Start Web Frontend (port 3000)

```bash
cd frontend
npm run dev
```

Open:

* `http://localhost:3000`

---

### 6.3 Start Hardhat Local Chain (port 8545)

```bash
cd blockchain
npx hardhat node
```

Deploy contract to localhost network:

```bash
npm run deploy-local
```

After deploy:

* Note the deployed contract address for backend usage.

---

## 7) Common Workflows

### 7.1 Admin alerts

* Upload lease document in the web portal
* `POST /analyze-mine` runs the audit engine
* If illegal area detected, a new alert is automatically created

### 7.2 Citizen complaints (Web)

* Citizens submit complaints via the web portal
* Complaints are stored in the core backend
* Relevant reports can be anchored on-chain for integrity and auditing

---

## 8) Troubleshooting

* **Frontend shows API errors**: verify `frontend/.env.local` points to the correct `NEXT_PUBLIC_API_BASE_URL`.
* **Contract calls fail**: confirm Hardhat node is running and contract address matches the deployed network.
* **DB errors on startup**: verify `backend/.env` has a valid `DATABASE_URL`.

---

## 9) Security Notes

* Never commit `.env` files.
* Never expose private keys in production builds.
* Rotate keys if they were ever committed.
