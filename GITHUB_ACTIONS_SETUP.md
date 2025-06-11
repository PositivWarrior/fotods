# GitHub Actions Setup for Frontend Auto-Deployment

## Quick Setup (5 minutes)

### Step 1: Get Your Hostinger FTP Credentials

1. **Login to Hostinger control panel**
2. **Go to Files → FTP Accounts**
3. **Note down these details:**
    - **FTP Server**: Usually `ftp.your-domain.com` or an IP address
    - **Username**: Your FTP username
    - **Password**: Your FTP password

### Step 2: Add GitHub Secrets

1. **Go to your GitHub repository**
2. **Click Settings → Secrets and variables → Actions**
3. **Click "New repository secret" and add these 3 secrets:**

    ```
    Name: HOSTINGER_FTP_SERVER
    Value: ftp.your-domain.com (or your FTP server)

    Name: HOSTINGER_FTP_USERNAME
    Value: your-ftp-username

    Name: HOSTINGER_FTP_PASSWORD
    Value: your-ftp-password
    ```

### Step 3: Test the Deployment

1. **Make a small change to your frontend** (e.g., edit a text in `client/src/App.tsx`)
2. **Commit and push to main branch:**
    ```bash
    git add .
    git commit -m "test: trigger auto deployment"
    git push origin main
    ```
3. **Watch the GitHub Actions tab** in your repository
4. **Check your website** in ~2-3 minutes

## How It Works

-   ✅ **Triggers only on frontend changes** (client/, public/, config files)
-   ✅ **Builds using your existing `npm run build:frontend`**
-   ✅ **Uploads only changed files** (faster deployments)
-   ✅ **Excludes source maps and .htaccess** (won't overwrite your server config)
-   ✅ **Can be triggered manually** from GitHub Actions tab

## Manual Trigger

You can also trigger deployment manually:

1. Go to **Actions tab** in your GitHub repo
2. Click **"🚀 Deploy Frontend to Hostinger"**
3. Click **"Run workflow"**

## Deployment Time

-   **First deployment**: ~3-5 minutes
-   **Subsequent deployments**: ~1-2 minutes (only uploads changed files)

## Troubleshooting

**If deployment fails:**

1. **Check FTP credentials** in GitHub secrets
2. **Verify FTP server allows connections** from GitHub IPs
3. **Check the Actions log** for specific error messages

**Common issues:**

-   Wrong FTP server address
-   FTP server requires different port (add `:port` to server address)
-   FTP server requires SSL (contact Hostinger support)

## That's it! 🎉

Now every time you push frontend changes to main branch, your site will automatically update!
