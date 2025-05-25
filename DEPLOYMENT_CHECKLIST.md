# Deployment Checklist

## Pre-Deployment

-   [ ] All environment variables documented
-   [ ] Supabase database is set up and accessible
-   [ ] Supabase Storage bucket "photos" is created
-   [ ] Email SMTP credentials are ready
-   [ ] Domain is ready (fotods.no)

## Backend Deployment (Railway - Recommended)

### 1. Railway Setup

-   [ ] Create Railway account at [railway.app](https://railway.app)
-   [ ] Connect GitHub repository
-   [ ] Create new project from GitHub repo

### 2. Environment Variables

Set these in Railway dashboard:

-   [ ] `NODE_ENV=production`
-   [ ] `DATABASE_URL=` (from Supabase)
-   [ ] `SUPABASE_URL=` (from Supabase)
-   [ ] `SUPABASE_SERVICE_ROLE_KEY=` (from Supabase)
-   [ ] `SESSION_SECRET=` (generate random string)
-   [ ] `EMAIL_HOST=` (SMTP server)
-   [ ] `EMAIL_PORT=587`
-   [ ] `EMAIL_USER=` (your email)
-   [ ] `EMAIL_PASS=` (your email password)
-   [ ] `EMAIL_FROM="FotoDS Contact <info@fotods.no>"`

### 3. Deploy & Test

-   [ ] Railway auto-deploys on push
-   [ ] Test API: `curl https://your-app.railway.app/api/categories`
-   [ ] Check logs for any errors
-   [ ] Note your backend URL for frontend config

## Frontend Deployment (Hostinger)

### 1. Environment Setup

-   [ ] Create `.env.production` file:
    ```
    VITE_API_URL=https://fotods-production.up.railway.app
    ```

### 2. Build & Upload

-   [ ] Run `npm run build:frontend`
-   [ ] Compress contents of `dist/public` folder
-   [ ] Upload to Hostinger `public_html` directory
-   [ ] Extract files directly in `public_html`

### 3. Domain Configuration

-   [ ] Ensure domain points to `public_html`
-   [ ] Enable HTTPS on domain
-   [ ] Update CORS origins in backend if needed

## Post-Deployment Testing

### Backend Tests

-   [ ] API endpoints respond correctly
-   [ ] Admin login works
-   [ ] Photo upload works (Supabase Storage)
-   [ ] Contact form saves to database
-   [ ] Email notifications are sent

### Frontend Tests

-   [ ] Website loads correctly
-   [ ] All pages navigate properly
-   [ ] Contact form submits successfully
-   [ ] Admin panel accessible
-   [ ] Photo galleries load from Supabase
-   [ ] Mobile responsiveness works

### Integration Tests

-   [ ] Frontend connects to backend API
-   [ ] Authentication flow works
-   [ ] File uploads work end-to-end
-   [ ] Email notifications arrive at info@fotods.no

## Monitoring Setup

-   [ ] Check Railway logs for errors
-   [ ] Set up uptime monitoring (optional)
-   [ ] Monitor email delivery
-   [ ] Check Supabase usage/limits

## Backup & Security

-   [ ] Supabase handles database backups
-   [ ] Environment variables are secure
-   [ ] HTTPS is enabled on both frontend and backend
-   [ ] Admin credentials are secure

## Cost Estimation

-   **Railway Backend:** ~$5/month
-   **Hostinger Frontend:** Already covered by your plan
-   **Supabase:** Free tier (should be sufficient)
-   **Total:** ~$5/month

## Support Contacts

-   Railway: [railway.app/help](https://railway.app/help)
-   Hostinger: Your existing support
-   Supabase: [supabase.com/support](https://supabase.com/support)
