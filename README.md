# CodeReview AI

Async AI-powered code review app built with React, Vite, Express, MongoDB, GitHub OAuth, Socket.io, Monaco Editor, and Groq streaming.

## Local Setup

1. Install dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

2. Create environment files:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

3. Fill `server/.env` with MongoDB Atlas, GitHub OAuth, and Groq values.

4. Start the backend:

```bash
cd server
npm run dev
```

5. Start the frontend:

```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/health`

## Local Preview Auth

For local preview, `ENABLE_DEV_AUTH=true` and `VITE_ENABLE_DEMO_AUTH=true` allow the landing page buttons to create a local demo user through `/auth/dev-login`. This route is disabled automatically when `NODE_ENV=production`.

## Production Notes

Use real GitHub OAuth credentials and set:

```env
GITHUB_CALLBACK_URL=https://your-backend.onrender.com/auth/github/callback
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

Then set matching frontend values:

```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_ENABLE_DEMO_AUTH=false
```

## Deployment

Backend on Render:

1. Push this repository to GitHub.
2. In Render, create a new Web Service from the repo.
3. Set Root Directory to `server`.
4. Set Build Command to `npm install`.
5. Set Start Command to `npm start`.
6. Add all `server/.env` values in Render Environment, but use production URLs.
7. Set `ENABLE_DEV_AUTH=false` and `NODE_ENV=production`.

Frontend on Vercel:

1. Import the same GitHub repo in Vercel.
2. Set Root Directory to `client`.
3. Framework Preset: Vite.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add `VITE_API_URL`, `VITE_SOCKET_URL`, and `VITE_ENABLE_DEMO_AUTH=false`.

After both deploy:

1. Update Render `FRONTEND_URL` to the Vercel URL.
2. Update GitHub OAuth callback URL to `https://your-render-app.onrender.com/auth/github/callback`.
3. Update Render `GITHUB_CALLBACK_URL` to the same callback URL.
