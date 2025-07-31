# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code pushed to GitHub
- [ ] `package.json` has `"start": "node server.js"` script
- [ ] Server uses `process.env.PORT` for port configuration
- [ ] CORS configured with environment variable

## 🚀 Deployment Steps

### 1. Go to Render
- Visit [render.com](https://render.com)
- Sign up/login with GitHub

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect your `Gilsanum-server` repository

### 3. Configuration
```
Name: gilsanum-backend
Region: (choose closest to you)
Branch: main
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 4. Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### 5. Deploy
- Click **"Create Web Service"**
- Wait for deployment (3-5 minutes)
- Get your URL: `https://your-app.onrender.com`

## 🔗 Connect Frontend

### Update Vercel Environment Variable
```
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
```

## 🧪 Test Your Deployment

1. **Health Check**: `https://your-render-app.onrender.com/health`
2. **API Test**: `https://your-render-app.onrender.com/api/products`
3. **Frontend**: Should connect to production backend

## 📝 Important Notes

- **Free Tier**: Sleeps after 15 min of inactivity
- **Cold Start**: First request may take 30-60 seconds after sleep
- **Logs**: Check Render dashboard for any errors
- **Auto Deploy**: Pushes to GitHub trigger automatic redeploys

## 🆘 Troubleshooting

If deployment fails:
1. Check logs in Render dashboard
2. Verify `start` script in package.json
3. Ensure PORT environment variable is set
4. Check all dependencies are in `dependencies` section

## 🎉 After Successful Deployment

1. Update CORS_ORIGIN with actual Vercel URL
2. Test all API endpoints
3. Verify frontend connects to backend
4. Share your live application! 🚀
