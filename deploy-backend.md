# Backend Deployment Guide

## Recommended: Railway Deployment (No Cold Starts, $5/month)

Railway is perfect for your needs - no cold starts, excellent performance, and very affordable.

### 1. Setup Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your repository

### 2. Deploy to Railway

1. **Create New Project:**

    - Click "New Project"
    - Select "Deploy from GitHub repo"
    - Choose your repository

2. **Environment Variables:**
   Add these in Railway dashboard under Variables:

    ```
    NODE_ENV=production
    DATABASE_URL=your_supabase_database_url
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
    SUPABASE_ANON_KEY=your_supabase_anon_key
    SESSION_SECRET=your_random_session_secret
    EMAIL_HOST=your_smtp_host
    EMAIL_PORT=587
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
    EMAIL_FROM="FotoDS Contact <info@fotods.no>"
    ```

3. **Deploy:**
    - Railway will automatically build and deploy
    - Your app will be available at `https://fotods-production.up.railway.app`

### 3. Custom Domain (Optional)

1. In Railway dashboard, go to Settings > Domains
2. Add your custom domain (e.g., `api.fotods.no`)
3. Update your DNS records as instructed

## Alternative: Render (Free Tier Available)

### 1. Setup Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### 2. Deploy to Render

1. **Create Web Service:**

    - Click "New +" → "Web Service"
    - Connect your repository
    - Use these settings:
        - **Build Command:** `npm run build`
        - **Start Command:** `npm run start`
        - **Environment:** Node

2. **Environment Variables:**
   Same as Railway above

**Note:** Render free tier has cold starts (spins down after 15 minutes of inactivity)

## Alternative: Fly.io (Good Performance, Pay-as-you-go)

### 1. Install Fly CLI

```bash
# macOS
brew install flyctl

# Windows
iwr https://fly.io/install.ps1 -useb | iex

# Linux
curl -L https://fly.io/install.sh | sh
```

### 2. Deploy to Fly.io

```bash
# Login
fly auth login

# Initialize app
fly launch

# Set environment variables
fly secrets set NODE_ENV=production
fly secrets set DATABASE_URL=your_supabase_database_url
fly secrets set SUPABASE_URL=your_supabase_project_url
fly secrets set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
# ... add all other environment variables

# Deploy
fly deploy
```

## Environment Variables Checklist

Make sure you have all these set in your deployment platform:

### Required:

-   `NODE_ENV=production`
-   `DATABASE_URL` (from Supabase)
-   `SUPABASE_URL` (from Supabase)
-   `SUPABASE_SERVICE_ROLE_KEY` (from Supabase)
-   `SESSION_SECRET` (generate a random string)

### For Email (Contact Form):

-   `EMAIL_HOST` (e.g., `smtp.hostinger.com`)
-   `EMAIL_PORT` (usually `587`)
-   `EMAIL_USER` (your email address)
-   `EMAIL_PASS` (your email password)
-   `EMAIL_FROM` (optional, defaults to generic)

### Optional:

-   `PORT` (usually auto-set by platform)
-   `SUPABASE_ANON_KEY` (if needed for client-side operations)

## Post-Deployment Steps

1. **Test API Endpoints:**

    ```bash
    curl https://fotods-production.up.railway.app/api/categories
    ```

2. **Update Frontend Configuration:**

    - Update `.env.production` with your backend URL
    - Rebuild and redeploy frontend

3. **Test Email Functionality:**
    - Submit a contact form
    - Check server logs for email sending status

## Monitoring & Maintenance

### Railway:

-   Built-in metrics and logs
-   Automatic deployments on git push
-   $5/month for hobby plan (no cold starts)

### Render:

-   Free tier: 750 hours/month (enough for most sites)
-   Paid tier: $7/month (no cold starts)

### Fly.io:

-   Pay for what you use
-   Excellent global performance
-   Around $2-10/month depending on usage

## Recommended Choice: Railway

For your use case, **Railway is the best choice** because:

-   ✅ No cold starts
-   ✅ Simple deployment
-   ✅ Affordable ($5/month)
-   ✅ Excellent performance
-   ✅ Built-in monitoring
-   ✅ Automatic deployments
