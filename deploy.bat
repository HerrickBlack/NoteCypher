@echo off
echo ============================================
echo   NoteCypher - GitHub Deployment Script
echo ============================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo.
set /p GITHUB_USERNAME="Enter your GitHub username: "
if "%GITHUB_USERNAME%"=="" (
    echo ERROR: Username cannot be empty
    pause
    exit /b 1
)

echo.
echo Updating package.json with your GitHub username...
powershell -Command "(Get-Content package.json) -replace 'YOUR_USERNAME', '%GITHUB_USERNAME%' | Set-Content package.json"

echo.
echo Initializing Git repository...
git init
git config user.name "%GITHUB_USERNAME%"
git config user.email "%GITHUB_USERNAME%@users.noreply.github.com"

echo.
echo Adding files...
git add .
git commit -m "Initial commit - NoteCypher PDF Optimizer"

echo.
echo Creating main branch...
git branch -M main

echo.
echo Enter your repository URL when prompted:
echo https://github.com/%GITHUB_USERNAME%/NoteCypher.git
echo.
echo First, create a new repository on GitHub:
echo 1. Go to https://github.com/new
echo 2. Repository name: NoteCypher
echo 3. Make it Public
echo 4. Click Create repository
echo.
pause

set /p REPO_URL="Enter your repository URL: "
if "%REPO_URL%"=="" (
    echo ERROR: Repository URL cannot be empty
    pause
    exit /b 1
)

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Installing gh-pages and deploying...
npm install --save-dev gh-pages
npm run deploy

echo.
echo ============================================
echo   Deployment Complete!
echo ============================================
echo.
echo Your site will be live at:
echo https://%GITHUB_USERNAME%.github.io/NoteCypher/
echo.
echo IMPORTANT: Enable GitHub Pages in repository Settings!
echo 1. Go to your repository on GitHub
echo 2. Settings -> Pages
echo 3. Source: Deploy from branch -> gh-pages -> / (root)
echo 4. Save
echo.
pause
