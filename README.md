<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Rizz AI - AI-Powered Chat Assistant

An AI-powered chat assistant built with React, Vite, and Google's Gemini AI.

View your app in AI Studio: https://ai.studio/apps/drive/1tQVaT13a8MC4G5IcpCEh4AP-xzDEhqfI

## Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your API key:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```
   - Get your API key from: https://aistudio.google.com/app/apikey

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Quick Deploy:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Add Environment Variable:**
   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Name:** `VITE_GEMINI_API_KEY`
     - **Value:** Your Gemini API key
     - **Environment:** Production, Preview, Development (select all)
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

Your app will be live at `https://your-project-name.vercel.app`

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 6
- **AI:** Google Gemini API
- **Styling:** CSS
- **Icons:** Lucide React
- **Deployment:** Vercel

---

Made with ❤️ using Google AI Studio

