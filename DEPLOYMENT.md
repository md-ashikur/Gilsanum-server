# Gilsanum Server Deployment Guide

## Deploy to Railway (Recommended)

### Steps:
1. **Create Railway Account**: Go to [railway.app](https://railway.app) and sign up
2. **Connect GitHub**: Link your GitHub repository
3. **Deploy**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Gilsanum-server` repository
   - Railway will automatically detect it's a Node.js app

### Environment Variables:
Set these in Railway dashboard:
```
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Custom Domain (Optional):
Railway provides a free domain like: `your-app.railway.app`

---

## Deploy to Render (Alternative)

### Steps:
1. **Create Render Account**: Go to [render.com](https://render.com) and sign up
2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose your `Gilsanum-server` repository

### Configuration:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  PORT=10000
  NODE_ENV=production
  CORS_ORIGIN=https://your-vercel-app.vercel.app
  ```

---

## Deploy to Heroku (Alternative)

### Steps:
1. **Install Heroku CLI**: Download from [heroku.com](https://heroku.com)
2. **Login**: `heroku login`
3. **Create App**: `heroku create your-app-name`
4. **Deploy**: 
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Environment Variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-vercel-app.vercel.app
```

---

## After Deployment

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)
2. **Update frontend environment variable**:
   - In your Vercel dashboard
   - Add environment variable: `VITE_API_BASE_URL=https://your-app.railway.app/api`
   - Redeploy frontend

3. **Update CORS_ORIGIN** in your backend:
   - Set to your Vercel frontend URL
   - Redeploy backend

## Testing
- Backend: Visit `https://your-backend-url/api/products`
- Frontend: Should now connect to production backend
