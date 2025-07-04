# Render.com Deployment Guide for Memee Frontend

## 🚀 Quick Deploy (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Render.com deployment configuration"
git push origin main
```

### Step 2: Deploy on Render.com
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository: `orincore/memee-frontend`
4. Configure:
   - **Name**: `memee-frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment**: `Static Site`

### Step 3: Environment Variables (Optional)
Add these in Render.com dashboard:
- `NODE_ENV`: `production`
- `VITE_API_URL`: `https://memeeapi.orincore.com`

## 🔧 Configuration Files Created

### 1. `render.yaml` - Render.com Configuration
- SPA routing with rewrite rules
- Security headers
- Cache control
- Health check path

### 2. `static.json` - Static Site Configuration
- Root directory: `dist`
- Clean URLs enabled
- All routes redirect to `index.html`
- HTTPS enforcement

### 3. `public/_redirects` - Redirect Rules
- SPA routing support
- HTTPS redirects
- Specific route handling

## 🛠️ Troubleshooting

### If routes still don't work:

#### Option 1: Use Hash Router (Fallback)
1. Rename `src/main-hash.tsx` to `src/main.tsx`
2. Update `package.json` build command:
   ```json
   "build": "tsc && vite build --config vite.config.hash.ts"
   ```
3. Redeploy

#### Option 2: Manual Server Configuration
If using custom server, add this to your server config:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Common Issues:
1. **404 on direct route access**: Ensure `static.json` is in root directory
2. **Build fails**: Check Node.js version (use 18+)
3. **API calls fail**: Verify `VITE_API_URL` environment variable

## ✅ Verification
After deployment, test these URLs:
- `https://your-app.onrender.com/` (Homepage)
- `https://your-app.onrender.com/signup` (Signup page)
- `https://your-app.onrender.com/login` (Login page)
- `https://your-app.onrender.com/verify-otp` (OTP page)

All should work without 404 errors!

## 🔄 Auto-Deploy
Render.com will automatically redeploy when you push to the `main` branch. 