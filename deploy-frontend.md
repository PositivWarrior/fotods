# Frontend Deployment to Hostinger

## Prerequisites

1. Your backend should be deployed and running (see backend deployment section)
2. Note your backend URL: `https://fotods-production.up.railway.app`

## Build Steps

1. **Set environment variable for production API URL:**
   Create a `.env.production` file in your project root:

    ```
    VITE_API_URL=https://fotods-production.up.railway.app
    ```

2. **Build the frontend:**

    ```bash
    npm run build:frontend
    ```

    This creates a `dist/public` folder with all static files.

3. **Upload to Hostinger:**
    - Compress the contents of `dist/public` folder (not the folder itself, just the contents)
    - Upload to your Hostinger file manager in the `public_html` directory
    - Extract the files directly in `public_html`

## File Structure on Hostinger

Your `public_html` should contain:

```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── other static files
```

## Domain Configuration

-   Your domain should point to the `public_html` directory
-   Ensure your domain has HTTPS enabled
-   Update the backend CORS settings to allow your domain

## Environment Variables for Production

Create `.env.production` in project root:

```
VITE_API_URL=https://fotods-production.up.railway.app
```

## Testing

1. Visit your domain
2. Check browser console for any API connection errors
3. Test contact form and admin login functionality
