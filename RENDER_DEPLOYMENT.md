# Render Deployment Guide for Gilsanum Server

## Step-by-Step Deployment on Render

### 1. Prepare Your Repository
Make sure your server code is pushed to GitHub with these files:
- ✅ `package.json` (with start script)
- ✅ `server.js` 
- ✅ All route files
- ✅ `.env.example` (for reference)

### 2. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3. Deploy Web Service
1. **Click "New +"** → **"Web Service"**
2. **Connect Repository**: Select your `Gilsanum-server` repository
3. **Configure Service**:
   - **Name**: `gilsanum-backend` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (if server is in root) or specify path
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4. Set Environment Variables
In the Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**Important**: Render uses port 10000 by default for web services.

### 5. Deploy
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
3. You'll get a URL like: `https://gilsanum-backend.onrender.com`

### 6. Update Frontend
Once deployed, update your frontend environment variable:

**In Vercel Dashboard**:
- Go to your frontend project settings
- Environment Variables
- Update or add: `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`
- Redeploy frontend

### 7. Update Backend CORS
**In Render Dashboard**:
- Update `CORS_ORIGIN` environment variable to your actual Vercel URL
- This will trigger automatic redeploy

## Testing Your Deployment

1. **Backend API**: Visit `https://your-render-app.onrender.com/api/products`
2. **Frontend**: Should now connect to production backend

## Important Notes

- **Free Tier**: Render free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request after sleep may take 30-60 seconds
- **Automatic Deploys**: Render redeploys automatically when you push to GitHub
- **Logs**: Check logs in Render dashboard if issues occur

## Troubleshooting

If deployment fails:
1. Check **logs** in Render dashboard
2. Ensure `package.json` has correct `start` script
3. Verify all dependencies are in `dependencies` (not `devDependencies`)
4. Check PORT environment variable is set to 10000

## Free Tier Limitations

- Automatic sleep after 15 minutes of inactivity
- 750 hours/month (essentially unlimited for personal projects)
- Shared CPU and 512MB RAM
- For production apps, consider upgrading to paid tier ($7/month)
