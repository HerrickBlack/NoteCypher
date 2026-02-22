# Deploy NoteCypher to GitHub Pages

## Prerequisites
1. Install Git: https://git-scm.com/download/win
2. Create a GitHub account: https://github.com/signup

## Step 1: Initialize Git Repository

Open Command Prompt or PowerShell in the NoteCypher folder:

```bash
cd G:\env\NoteCypher
git init
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Step 2: Update package.json

Replace `YOUR_USERNAME` with your GitHub username in `package.json`:

```json
"homepage": "https://YOUR_USERNAME.github.io/NoteCypher"
```

## Step 3: Add and Commit Files

```bash
git add .
git commit -m "Initial commit - NoteCypher PDF Optimizer"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `NoteCypher`
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README
5. Click "Create repository"

## Step 5: Push to GitHub

Copy the commands from GitHub and run them:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/NoteCypher.git
git push -u origin main
```

## Step 6: Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
1. Build the production version
2. Push the `dist` folder to a `gh-pages` branch

## Step 7: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select branch: **gh-pages**, folder: **/ (root)**
5. Click **Save**

## Step 8: Access Your Live Site

After 1-2 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/NoteCypher/
```

## Update After Changes

After making code changes:

```bash
git add .
git commit -m "Your update message"
git push
npm run deploy
```

## Troubleshooting

### 404 Error after deployment
- Wait 2-3 minutes for GitHub Pages to propagate
- Check Settings → Pages to ensure gh-pages branch is selected

### Build fails
- Run `npm install` first
- Check for errors in the build output

### Git not recognized
- Install Git from: https://git-scm.com/download/win
- Restart your terminal after installation

## Alternative: Manual Deployment

If you prefer not to use git:

1. Run `npm run build`
2. Copy the entire `dist` folder contents
3. Create a new repository on GitHub
4. Upload the `dist` folder files directly
5. Enable GitHub Pages from repository Settings
