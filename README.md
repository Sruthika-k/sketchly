# Sketchly

Real-time collaborative whiteboard application.

## Local Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd sketchly-backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Copy `.env.example` to `.env` and update values if needed:
   ```bash
   cp .env.example .env
   ```
6. Start the backend server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd sketchly-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update values if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (sketchly-backend/.env)
- `ENV`: Environment (development/production)
- `HOST`: Host address (default: 0.0.0.0)
- `PORT`: Port number (default: 8000)
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins
- `LOG_LEVEL`: Log level (DEBUG/INFO/WARNING/ERROR/CRITICAL)

### Frontend (sketchly-frontend/.env)
- `VITE_WS_URL`: WebSocket URL (e.g., wss://your-backend.onrender.com)
- `VITE_API_URL`: API URL (e.g., https://your-backend.onrender.com)

## Deployment

### Backend Deployment on Render
1. Push your code to GitHub
2. Go to [Render](https://render.com) and sign in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: sketchly-backend
   - **Runtime**: Python
   - **Region**: Choose your preferred region
   - **Branch**: main (or your default branch)
   - **Root Directory**: sketchly-backend
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `ENV`: production
   - `CORS_ORIGINS`: https://your-frontend.vercel.app (replace with your actual frontend URL)
7. Click "Create Web Service"
8. Wait for deployment to complete, then copy the backend URL (e.g., https://sketchly-backend.onrender.com)

### Frontend Deployment on Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Project Name**: sketchly-frontend
   - **Root Directory**: sketchly-frontend
6. Add environment variables:
   - `VITE_WS_URL`: wss://your-backend.onrender.com (replace with your actual backend URL, use wss:// for secure WebSocket)
   - `VITE_API_URL`: https://your-backend.onrender.com (replace with your actual backend URL)
7. Click "Deploy"
8. After deployment, copy the frontend URL and update the backend's `CORS_ORIGINS` environment variable on Render

## Remaining Manual Actions

1. **Update Backend CORS_ORIGINS**: After deploying the frontend, update the backend's `CORS_ORIGINS` environment variable on Render to include your frontend URL
2. **Update Frontend URLs**: Set the correct backend URLs in Vercel's environment variables
3. **Test Deployment**: Verify both frontend and backend are working correctly

## GitHub Actions CI

A CI pipeline is configured to run on push and pull requests:
- Frontend: Install dependencies, lint, and build
- Backend: Install dependencies and validate
