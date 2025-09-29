# Deployment Guide

This Lab Equipment Management System can be deployed on various platforms. Here are the instructions for popular hosting services:

## 🚀 Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   vercel --prod
   ```

4. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Vercel will automatically deploy on every push

## 🌐 Netlify Deployment

### Option 1: Netlify CLI
1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option 2: Drag & Drop
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to the deploy area

### Option 3: GitHub Integration
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 🔥 Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Build and deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## 📦 GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## ⚙️ Build Configuration

The project uses Vite and requires these build settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+ recommended

## 🔐 Environment Variables

If you plan to integrate with real services later, you may need these environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=your_deployed_url
```

## 📱 Features Working Out of the Box

- ✅ Mock Authentication (no backend required)
- ✅ Equipment Management
- ✅ QR Code Generation
- ✅ Maintenance Tracking
- ✅ Alert System
- ✅ Dashboard Analytics
- ✅ Responsive Design
- ✅ Local Data Storage

## 🔄 Upgrading to Real Backend

To connect to a real database later:
1. Set up Supabase project
2. Add environment variables
3. The app will automatically switch from mock to real data

## 🎯 Demo Accounts

Use these accounts to test the deployed application:
- **Admin**: admin@lab.com / password123
- **Technician**: tech@lab.com / password123
- **Staff**: staff@lab.com / password123

---

Choose the platform that best fits your needs. All configurations are included in this project!