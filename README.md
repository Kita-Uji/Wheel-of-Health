# Wheel of Health Quiz

A responsive health assessment quiz that evaluates users across multiple health dimensions and displays results in an interactive radar chart.

## Features

- ✅ Dynamic question loading from CSV file
- ✅ Randomized question order each session
- ✅ Clean, responsive design
- ✅ Interactive 1-10 scoring system
- ✅ Radar chart visualization
- ✅ Color-coded results (Red/Yellow/Green)
- ✅ Category-by-category score breakdown
- ✅ Supports unlimited questions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
```

## Editing Questions

Questions are loaded from `public/questions.json`. Edit this file to add, remove, or modify questions.

### JSON Format

```json
[
  {
    "id": "1",
    "text": "How steady and reliable is your energy from morning to night?",
    "category": "Energy & Focus",
    "lowLabel": "Disagree",
    "highLabel": "Agree",
    "flipValue": false
  }
]
```

**Required Fields:**
- `id` - Unique identifier for each question (string)
- `text` - The question text (string)
- `category` - Health category (string, e.g., "Energy & Focus", "Nutrition")
- `lowLabel` - Label for low scores (string, e.g., "Disagree")
- `highLabel` - Label for high scores (string, e.g., "Agree")
- `flipValue` - true to invert scoring (1→10, 10→1), false for normal (boolean)

### Score Color Coding

- 🔴 **Red** - Score < 3 (needs attention)
- 🟡 **Yellow** - Score 3-7 (room for improvement)
- 🟢 **Green** - Score ≥ 7 (doing great)

## Deploying to GitHub & Vercel

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in top-right → **"New repository"**
3. Repository name: `wheel-of-health` (or your choice)
4. Choose Public or Private
5. **Do NOT initialize** with README, .gitignore, or license
6. Click **"Create repository"**

### Step 2: Push Code to GitHub

Open your terminal in the project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Wheel of Health quiz"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/wheel-of-health.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your `wheel-of-health` repository
4. Vercel will auto-detect Vite settings:
   - **Framework Preset:** Vite
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**

Your site will be live in ~30 seconds! 🎉

### Updating Questions After Deployment

To update questions after deployment:

```bash
# 1. Edit public/questions.json with your changes

# 2. Commit and push
git add public/questions.json
git commit -m "Update questions"
git push

# 3. Vercel automatically redeploys (takes ~30 seconds)
```

## Project Structure

```
wheel-of-health/
├── public/
│   └── questions.csv       # Quiz questions (edit this file)
├── src/
│   ├── App.jsx            # Main application logic
│   ├── App.css            # Styling
│   └── main.jsx           # React entry point
├── index.html             # HTML entry point
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **Recharts** - Radar chart visualization
- **PapaParse** - CSV parsing
- **Vercel** - Hosting platform

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT
