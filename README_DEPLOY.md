# Quick deployment guide — GitHub + Render

This project is prepared to be deployed as a single Render Web Service where the backend (Express) serves the built React frontend.

Summary (single-service):
- Render will run a build step that installs root/frontend deps, installs backend deps, and runs `npm run build` to produce `build/`.
- The backend (`backend/server.js`) is configured to serve `build/` when `NODE_ENV=production`.

Steps

1) Push your code to GitHub (from repo root `dis`):

```powershell
Set-Location -Path 'C:\Users\aaksh\OneDrive\Desktop\New folder\dis'
git init
git add .
git commit -m "Deploy-ready: add render manifest and deploy docs"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

2) Create a new Web Service on Render
- Go to https://dashboard.render.com/new/web-service
- Connect your GitHub repo and select branch `main`.
- Build Command:

```
npm install && npm --prefix backend install && npm run build
```

- Start Command:

```
npm --prefix backend start
```

3) Set environment variables in Render (Service -> Environment):
- NODE_ENV = production
- MONGODB_URI = mongodb+srv://<user>:<pass>@cluster0.../dis_app?retryWrites=true&w=majority
- JWT_SECRET = <a_long_random_secret>
- FRONTEND_URL = https://<your-render-service-url>

4) Deploy and verify
- Open the Render URL for the service. The app should load (frontend) and API endpoints will be available under `/api/...` on the same domain.
- Check logs in the Render dashboard for any startup or build errors.

Notes & best practices
- Do not store secrets in the repo. Use Render's Environment settings for secrets.
- If you prefer separation, you can deploy the frontend as a Render Static Site and the backend as a Web Service; that gives CDN benefits.
- If you need help setting specific Render secrets or adding a custom domain, tell me and I can provide step-by-step instructions.
