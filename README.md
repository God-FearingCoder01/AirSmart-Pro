# APFDS

Airport Passenger Flow & Delay Prediction System

This repo contains a Next.js frontend and a Django REST backend with ML-powered endpoints for passenger flow and flight delay predictions.

## Stack

- Frontend: Next.js (TypeScript, Tailwind)
- Backend: Django REST Framework, SimpleJWT
- DB: MySQL (via PyMySQL), SQLAlchemy (for analytics query)
- Models: scikit-learn, XGBoost (optional Prophet)

## Deploy (Free tier) – Quick Start

Recommended split:
- Backend → Railway (Django, MySQL, gunicorn, WhiteNoise)
- Frontend → Vercel (Next.js)

### 1) Backend on Railway

1. Create a new Railway project and add a MySQL database (Provision → Database → MySQL). Note the env vars Railway provides:
	 - `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`
2. Add a new service from GitHub and set the root directory to `airport-passenger-flow-delay-prediction/backend`.
3. Ensure these files exist in the backend folder (already in this repo):
	 - `requirements.txt` (uses PyMySQL for portability; Prophet commented out by default)
	 - `runtime.txt` (Python 3.11)
	 - `Procfile` (gunicorn command)
	 - `nixpacks.toml` (explicit build + start steps)
4. Configure environment variables on the backend service:

	 Required:
	 - `SECRET_KEY` = generate a strong random string
	 - `DEBUG` = `False`
	 - `ALLOWED_HOSTS` = `<your-railway-subdomain>.up.railway.app`
	 - `FRONTEND_URL` = `https://<your-vercel-app>.vercel.app`
	 - `CSRF_TRUSTED_ORIGIN` = `https://<your-railway-subdomain>.up.railway.app`
	 - `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD` (from DB add-on)

5. Deploy, then open a Railway shell on the backend service and run:

```powershell
python manage.py migrate
python manage.py collectstatic --noinput
# Optional admin
python manage.py createsuperuser
```

6. Verify API:
- `https://<your-railway-subdomain>.up.railway.app/api/`
- `.../api/dashboard-stats/`, `.../api/passenger-flow/`, `.../api/delay-predictions/`

### 2) Frontend on Vercel

1. Import the GitHub repo into Vercel and set the root directory to `airport-passenger-flow-delay-prediction/frontend`.
2. Add env var:
	 - `API_URL` = `https://<your-railway-subdomain>.up.railway.app/api`
3. Deploy. Visit `https://<your-vercel-app>.vercel.app`.

The frontend proxies client calls to `/api/*` (configured via `next.config.js`), and SSR calls use `process.env.API_URL`.

## Local Development

Backend (Windows PowerShell):

```powershell
cd .\airport-passenger-flow-delay-prediction\backend
py -3 manage.py runserver
```

Frontend (Windows PowerShell where npm scripts are blocked):

```powershell
cd .\airport-passenger-flow-delay-prediction\frontend
$env:API_URL="http://127.0.0.1:8000/api"
node .\node_modules\next\dist\bin\next dev
```

## Environment Variables

Backend (Django):
- `SECRET_KEY`
- `DEBUG` (`True`/`False`)
- `ALLOWED_HOSTS` (comma-separated)
- `FRONTEND_URL` (public URL of the frontend)
- `CSRF_TRUSTED_ORIGIN` (public URL of the backend)
- `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`

Frontend (Next.js):
- `API_URL` (points to `<backend-url>/api` in production)

## Troubleshooting

- Railway: “Railpack could not determine how to build the app”
	- Ensure the service Root Directory is `airport-passenger-flow-delay-prediction/backend`.
	- `nixpacks.toml` and `Procfile` are present in that directory.

- MySQL driver issues
	- The backend auto-installs `PyMySQL` as `MySQLdb` to avoid native build issues from `mysqlclient` on free tiers.

- Prophet build failures
	- Prophet is commented out in `requirements.txt`. Re-enable only if needed (may require larger build resources).

- CORS/CSRF errors
	- Set `FRONTEND_URL` and `CSRF_TRUSTED_ORIGIN` correctly.
	- `ALLOWED_HOSTS` must include your backend host.

## Project Structure

```
airport-passenger-flow-delay-prediction/
	backend/      # Django REST API + ML endpoints
	frontend/     # Next.js app
```

Happy shipping!
